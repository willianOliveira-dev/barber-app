import { db } from "../db/connection"
import {
  and,
  asc,
  count,
  countDistinct,
  desc,
  eq,
  ilike,
  isNull,
  sql,
} from "drizzle-orm"
import {
  barbershop,
  barbershopHour,
  barbershopService,
  booking,
  category,
  review,
  barbershopStatus,
  dayOfWeekEnum,
} from "../db/schemas"
import type {
  Barbershop,
  BarbershopDetails,
  BarbershopHour,
  BarbershopService,
  BarbershopSummary,
  BarbershopWithRatings,
  CreateBarbershopData,
  NearbyBarbershop,
  PaginationMeta,
  PopularBarbershop,
  WithReviews,
  RatingSource,
  BarbershopSearchResult,
  BarbershopOwnerResult,
  BarbershopServiceResult,
  UpdateBarbershopData,
  CrateBarbershopHoursData,
  UpdateBarbershopHoursData,
  CreateBarbershopStatusData,
  UpdateBarbershopStatusData,
} from "../db/types"

export type DayOfWeekEnum = (typeof dayOfWeekEnum.enumValues)[number]

class BarbershopRepository {
  private get ratingSelection() {
    return {
      averageRating: sql<number>`COALESCE(ROUND(AVG(${review.rating})::numeric, 1), 0)::float`,
      totalReviews: sql<number>`COUNT(${review.id})::int`,
    }
  }

  private mapRatings<T extends WithReviews>(
    result: T | null | undefined,
  ): (Omit<T, "reviews"> & BarbershopWithRatings) | null {
    if (!result) return null

    const totalReviews = result.reviews?.length || 0
    const averageRating =
      totalReviews > 0
        ? Number(
            (
              result.reviews!.reduce(
                (acc: number, r: RatingSource) => acc + r.rating,
                0,
              ) / totalReviews
            ).toFixed(1),
          )
        : 0

    const { reviews, ...rest } = result

    return {
      ...rest,
      totalReviews,
      averageRating,
    } as Omit<T, "reviews"> & BarbershopWithRatings
  }

  async create(
    data: CreateBarbershopData,
    hours?: CrateBarbershopHoursData[],
    status?: CreateBarbershopStatusData,
  ): Promise<Barbershop> {
    const [createdBarbershop] = await db
      .insert(barbershop)
      .values(data)
      .returning()

    if (hours) {
      const hoursToInsert = hours.map((hour) => ({
        barbershopId: createdBarbershop.id,
        dayOfWeek: hour.dayOfWeek,
        openingTime: hour.openingTime,
        closingTime: hour.closingTime,
        isOpen: hour.isOpen,
      }))
      await db.insert(barbershopHour).values(hoursToInsert)
    }

    await db.insert(barbershopStatus).values({
      barbershopId: createdBarbershop.id,
      isOpen: status?.isOpen ?? true,
      reason: status?.reason ?? null,
      closedUntil: status?.closedUntil ?? null,
    })

    return createdBarbershop
  }

  async update(
    barbershopId: string,
    data: UpdateBarbershopData,
    hours: UpdateBarbershopHoursData[],
    status: UpdateBarbershopStatusData,
  ): Promise<Barbershop> {
    const [updatedBarbershop] = await db
      .update(barbershop)
      .set(data)
      .where(eq(barbershop.id, barbershopId))
      .returning()

    if (hours && hours.length > 0) {
      await Promise.all(
        hours.map((hour) =>
          db
            .update(barbershopHour)
            .set({
              openingTime: hour.openingTime,
              closingTime: hour.closingTime,
              isOpen: hour.isOpen,
            })
            .where(
              and(
                eq(barbershopHour.barbershopId, updatedBarbershop.id),
                eq(barbershopHour.dayOfWeek, hour.dayOfWeek),
              ),
            ),
        ),
      )
    }

    await db
      .update(barbershopStatus)
      .set({
        isOpen: status?.isOpen ?? true,
        reason: status?.reason ?? null,
        closedUntil: status?.closedUntil ?? null,
      })
      .where(eq(barbershopStatus.barbershopId, updatedBarbershop.id))

    return updatedBarbershop
  }

  async hasBooking(barbershopId: string) {
    const result = await db
      .select({ id: booking.id })
      .from(booking)
      .where(
        and(
          eq(booking.barbershopId, barbershopId),
          eq(booking.status, "confirmed"),
        ),
      )
      .limit(1)
    return result.length > 0
  }

  async delete(id: string): Promise<Barbershop | null> {
    const [deleteBarbershop] = await db
      .update(barbershop)
      .set({
        isActive: false,
        deletedAt: new Date(),
      })
      .where(eq(barbershop.id, id))
      .returning()

    return deleteBarbershop ?? null
  }

  async findPopular(limit: number = 4): Promise<PopularBarbershop[]> {
    const safeLimit = Math.min(limit, 4)
    return (await db
      .select({
        id: barbershop.id,
        name: barbershop.name,
        description: barbershop.description,
        slug: barbershop.slug,
        image: barbershop.image,
        address: barbershop.address,
        streetNumber: barbershop.streetNumber,
        neighborhood: barbershop.neighborhood,
        complement: barbershop.complement,
        zipCode: barbershop.zipCode,
        city: barbershop.city,
        state: barbershop.state,
        phone: barbershop.phone,
        email: barbershop.email,
        latitude: barbershop.latitude,
        longitude: barbershop.longitude,
        ...this.ratingSelection,
        totalBookings: sql<number>`COUNT(DISTINCT ${booking.id})::int`,
      })
      .from(barbershop)
      .leftJoin(booking, eq(booking.barbershopId, barbershop.id))
      .leftJoin(review, eq(review.barbershopId, barbershop.id))
      .where(eq(barbershop.isActive, true))
      .groupBy(barbershop.id)
      .orderBy(desc(sql`COUNT(${booking.id})`))
      .limit(safeLimit)) as PopularBarbershop[]
  }

  async findRecommended(limit: number = 8): Promise<BarbershopSummary[]> {
    const result = await db
      .select({
        id: barbershop.id,
        name: barbershop.name,
        description: barbershop.description,
        slug: barbershop.slug,
        image: barbershop.image,
        address: barbershop.address,
        city: barbershop.city,
        streetNumber: barbershop.streetNumber,
        neighborhood: barbershop.neighborhood,
        complement: barbershop.complement,
        zipCode: barbershop.zipCode,
        state: barbershop.state,
        phone: barbershop.phone,
        email: barbershop.email,
        latitude: barbershop.latitude,
        longitude: barbershop.longitude,
        ...this.ratingSelection,
      })
      .from(barbershop)
      .leftJoin(review, eq(review.barbershopId, barbershop.id))
      .where(eq(barbershop.isActive, true))
      .groupBy(barbershop.id)
      .orderBy(
        desc(this.ratingSelection.averageRating),
        desc(sql`COUNT(${review.id})`),
      )
      .limit(limit)

    return result as BarbershopSummary[]
  }

  async findNearbyBarbershops(
    userLat: number,
    userLng: number,
    radiusKm: number = 50,
  ): Promise<NearbyBarbershop[]> {
    const MAX_RESULTS = 50
    const latDelta = radiusKm / 111.0
    const lngDelta = radiusKm / (111.0 * Math.cos((userLat * Math.PI) / 180))

    const rows = await db
      .select({
        id: barbershop.id,
        name: barbershop.name,
        slug: barbershop.slug,
        description: barbershop.description,
        email: barbershop.email,
        latitude: barbershop.latitude,
        longitude: barbershop.longitude,
        address: barbershop.address,
        city: barbershop.city,
        state: barbershop.state,
        zipCode: barbershop.zipCode,
        phone: barbershop.phone,
        streetNumber: barbershop.streetNumber,
        neighborhood: barbershop.neighborhood,
        complement: barbershop.complement,
        image: barbershop.image,
        ...this.ratingSelection,
        distance:
          sql<number>`calculate_distance(${userLat}, ${userLng}, ${barbershop.latitude}, ${barbershop.longitude})`.as(
            "distance",
          ),
      })
      .from(barbershop)
      .leftJoin(review, eq(review.barbershopId, barbershop.id))
      .where(
        sql`
        ${barbershop.isActive} = true
        AND ${barbershop.deletedAt} IS NULL
        AND ${barbershop.latitude} BETWEEN ${userLat - latDelta} AND ${userLat + latDelta}
        AND ${barbershop.longitude} BETWEEN ${userLng - lngDelta} AND ${userLng + lngDelta}
      `,
      )
      .groupBy(barbershop.id)
      .orderBy(sql`distance ASC`)
      .limit(MAX_RESULTS)

    return rows.map((row) => ({
      ...row,
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      distance: Number(row.distance),
    })) as unknown as NearbyBarbershop[]
  }

  async findBySlug(slug: string): Promise<BarbershopDetails | null> {
    const result = await db.query.barbershop.findFirst({
      where: and(eq(barbershop.slug, slug), eq(barbershop.isActive, true)),
      with: {
        services: {
          where: and(
            eq(barbershopService.isActive, true),
            isNull(barbershop.deletedAt),
            isNull(barbershopService.deletedAt),
          ),
          with: { category: { columns: { id: true, name: true } } },
        },
        hours: true,
        reviews: true,
        status: true,
        owner: { columns: { id: true, name: true, email: true } },
      },
    })

    return this.mapRatings(result) as unknown as BarbershopDetails | null
  }

  async findServicesByBarbershop(
    barbershopId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ services: BarbershopServiceResult[]; meta: PaginationMeta }> {
    const safeLimit = Math.min(limit, 50)
    const whereClause = and(
      eq(barbershopService.barbershopId, barbershopId),
      isNull(barbershop.deletedAt),
      isNull(barbershopService.deletedAt),
    )

    const totalResult = await db
      .select({ count: count(barbershopService.id) })
      .from(barbershopService)
      .leftJoin(barbershop, eq(barbershopService.barbershopId, barbershop.id))
      .where(whereClause)

    const total = Number(totalResult[0]?.count ?? 0)
    const totalPages = Math.max(1, Math.ceil(total / safeLimit))
    const safePage = Math.min(page, totalPages)
    const offset = (safePage - 1) * safeLimit

    const services = await db
      .select({
        id: barbershopService.id,
        name: barbershopService.name,
        slug: barbershopService.slug,
        barbershopId: barbershopService.barbershopId,
        description: barbershopService.description,
        durationMinutes: barbershopService.durationMinutes,
        priceInCents: barbershopService.priceInCents,
        image: barbershopService.image,
        isActive: barbershopService.isActive,
        category: {
          id: category.id,
          name: category.name,
        },
      })
      .from(barbershopService)
      .leftJoin(barbershop, eq(barbershopService.barbershopId, barbershop.id))
      .leftJoin(category, eq(barbershopService.categoryId, category.id))
      .where(whereClause)
      .limit(safeLimit)
      .offset(offset)
      .orderBy(asc(barbershopService.name))

    return {
      services,
      meta: {
        total,
        page: safePage,
        totalPages,
        limit: safeLimit,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1,
      },
    }
  }

  async findBarbershopsByOwner(
    ownerId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    barbershops: BarbershopOwnerResult[]
    meta: PaginationMeta
  }> {
    const safeLimit = Math.min(limit, 10)
    const whereClause = and(
      eq(barbershop.ownerId, ownerId),
      isNull(barbershop.deletedAt),
    )

    const totalResult = await db
      .select({ count: count(barbershop.id) })
      .from(barbershop)
      .where(whereClause)

    const total = Number(totalResult[0]?.count ?? 0)
    const totalPages = Math.max(1, Math.ceil(total / safeLimit))
    const safePage = Math.min(page, totalPages)
    const offset = (safePage - 1) * safeLimit

    const barbershops = await db
      .select({
        id: barbershop.id,
        name: barbershop.name,
        slug: barbershop.slug,
        image: barbershop.image,
        address: barbershop.address,
        streetNumber: barbershop.streetNumber,
        state: barbershop.state,
        isActive: barbershop.isActive,
        servicesCount: count(barbershopService.id).mapWith(Number),
      })
      .from(barbershop)
      .leftJoin(
        barbershopService,
        and(
          eq(barbershop.id, barbershopService.barbershopId),
          isNull(barbershopService.deletedAt),
        ),
      )
      .where(whereClause)
      .groupBy(barbershop.id)
      .limit(safeLimit)
      .offset(offset)
      .orderBy(desc(barbershop.createdAt))

    return {
      barbershops,
      meta: {
        total,
        page: safePage,
        totalPages,
        limit: safeLimit,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1,
      },
    }
  }

  async findBarbershopsBySearch(
    search?: string,
    categorySlug?: string,
    page: number = 1,
    limit: number = 12,
  ): Promise<{ barbershops: BarbershopSearchResult[]; meta: PaginationMeta }> {
    const safeLimit = Math.min(limit, 12)
    const filters = [
      eq(barbershop.isActive, true),
      isNull(barbershop.deletedAt),
    ]

    if (search) filters.push(ilike(barbershop.name, `%${search}%`))
    if (categorySlug) filters.push(eq(category.slug, categorySlug))

    const whereClause = and(...filters)

    const totalResult = await db
      .select({ count: countDistinct(barbershop.id) })
      .from(barbershop)
      .leftJoin(
        barbershopService,
        and(
          eq(barbershop.id, barbershopService.barbershopId),
          eq(barbershopService.isActive, true),
          isNull(barbershopService.deletedAt),
        ),
      )
      .leftJoin(category, eq(barbershopService.categoryId, category.id))
      .where(whereClause)

    const total = Number(totalResult[0]?.count ?? 0)
    const totalPages = Math.max(1, Math.ceil(total / safeLimit))
    const safePage = Math.min(page, totalPages)
    const offset = (safePage - 1) * safeLimit

    const barbershops = await db
      .select({
        id: barbershop.id,
        name: barbershop.name,
        slug: barbershop.slug,
        image: barbershop.image,
        address: barbershop.address,
        city: barbershop.city,
        ...this.ratingSelection,
      })
      .from(barbershop)
      .leftJoin(review, eq(review.barbershopId, barbershop.id))
      .leftJoin(
        barbershopService,
        and(
          eq(barbershop.id, barbershopService.barbershopId),
          eq(barbershopService.isActive, true),
          isNull(barbershopService.deletedAt),
        ),
      )
      .leftJoin(category, eq(barbershopService.categoryId, category.id))
      .where(whereClause)
      .groupBy(barbershop.id)
      .limit(safeLimit)
      .offset(offset)
      .orderBy(
        desc(this.ratingSelection.averageRating),
        desc(barbershop.createdAt),
      )

    return {
      barbershops,
      meta: {
        total,
        page: safePage,
        totalPages,
        limit: safeLimit,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1,
      },
    }
  }

  async findServiceById(
    serviceId: string,
  ): Promise<BarbershopService | undefined> {
    return db.query.barbershopService.findFirst({
      where: eq(barbershopService.id, serviceId),
    })
  }

  async findHoursByBarbershopAndDay(
    barbershopId: string,
    dayOfWeek: DayOfWeekEnum,
  ): Promise<BarbershopHour | undefined> {
    return await db.query.barbershopHour.findFirst({
      where: and(
        eq(barbershopHour.dayOfWeek, dayOfWeek),
        eq(barbershopHour.barbershopId, barbershopId),
      ),
    })
  }
}

export const barbershopRepo = new BarbershopRepository()
