import { db } from "../db/connection"
import { and, countDistinct, desc, eq, ilike, sql } from "drizzle-orm"
import {
  barbershop,
  barbershopHour,
  barbershopService,
  booking,
  category,
  review,
  dayOfWeekEnum,
} from "../db/schemas"
import {
  BarbershopSummary,
  BarbershopWithRatings,
  NearbyBarbershop,
  PopularBarbershop,
} from "../db/types"

export type DayOfWeekEnum = (typeof dayOfWeekEnum.enumValues)[number]

type RatingSource = {
  rating: number
}

export type WithReviews = {
  reviews: RatingSource[]
}
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

  async findAll() {
    const data = await db
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
      .groupBy(barbershop.id)

    return data ?? []
  }

  async findPopular(limit: number = 4): Promise<PopularBarbershop[]> {
    const safeLimit = Math.min(limit, 4)
    return await db
      .select({
        id: barbershop.id,
        name: barbershop.name,
        description: barbershop.description,
        slug: barbershop.slug,
        image: barbershop.image,
        address: barbershop.address,
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
      .limit(safeLimit)
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

    return result
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
        latitude: barbershop.latitude,
        longitude: barbershop.longitude,
        address: barbershop.address,
        city: barbershop.city,
        state: barbershop.state,
        zipCode: barbershop.zipCode,
        phone: barbershop.phone,
        image: barbershop.image,
        ...this.ratingSelection,
        distance: sql<number>`
        calculate_distance(
          ${userLat}::double precision,
          ${userLng}::double precision,
          ${barbershop.latitude}::double precision,
          ${barbershop.longitude}::double precision
        )
      `.as("distance"),
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
    })) as NearbyBarbershop[]
  }

  async findBySlug(slug: string) {
    const result = await db.query.barbershop.findFirst({
      where: and(eq(barbershop.slug, slug), eq(barbershop.isActive, true)),
      with: {
        services: {
          where: eq(barbershopService.isActive, true),
          with: { category: { columns: { id: true, name: true } } },
        },
        hours: true,
        reviews: true,
        statusHistory: {
          limit: 1,
          orderBy: (status, { desc }) => [desc(status.updatedAt)],
        },
        owner: { columns: { id: true, name: true, email: true } },
      },
    })

    return this.mapRatings(result)
  }

  async findById(id: string) {
    const result = await db.query.barbershop.findFirst({
      where: eq(barbershop.id, id),
      with: {
        reviews: true,
      },
    })
    return this.mapRatings(result)
  }

  async findWithPagination(
    search?: string,
    categorySlug?: string,
    page: number = 1,
    limit: number = 12,
  ) {
    const safeLimit = Math.min(limit, 12)
    const filters = [eq(barbershop.isActive, true)]

    if (search) filters.push(ilike(barbershop.name, `%${search}%`))
    if (categorySlug) filters.push(eq(category.slug, categorySlug))

    const whereClause = and(...filters)

    const totalResult = await db
      .select({ count: countDistinct(barbershop.id) })
      .from(barbershop)
      .leftJoin(
        barbershopService,
        eq(barbershop.id, barbershopService.barbershopId),
      )
      .leftJoin(category, eq(barbershopService.categoryId, category.id))
      .where(whereClause)
      .orderBy()

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
        eq(barbershop.id, barbershopService.barbershopId),
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

  async findServiceById(serviceId: string) {
    return db.query.barbershopService.findFirst({
      where: eq(barbershopService.id, serviceId),
    })
  }

  async findHoursByBarbershopAndDay(
    barbershopId: string,
    dayOfWeek: DayOfWeekEnum,
  ) {
    return await db.query.barbershopHour.findFirst({
      where: and(
        eq(barbershopHour.dayOfWeek, dayOfWeek),
        eq(barbershopHour.barbershopId, barbershopId),
      ),
    })
  }
}

export const barbershopRepo = new BarbershopRepository()
