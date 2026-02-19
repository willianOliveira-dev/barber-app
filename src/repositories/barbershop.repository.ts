import { db } from "../db/connection"
import { and, countDistinct, eq, ilike, sql } from "drizzle-orm"
import {
  barbershop,
  barbershopHour,
  barbershopService,
  category,
} from "../db/schemas"
import { dayOfWeekEnum } from "../db/schemas"
import { NearbyBarbershop } from "../db/types"

export type DayOfWeekEnum = (typeof dayOfWeekEnum.enumValues)[number]

class BarbershopRepository {
  async findAll() {
    return db.select().from(barbershop) ?? []
  }

  async findNearbyBarbershops(
    userLat: number,
    userLng: number,
    radiusKm: number = 100,
  ): Promise<NearbyBarbershop[]> {
    const MAX_RESULTS = 50
    const latDelta = radiusKm / 111.0 // ~111 km por grau de latitude
    const lngDelta = radiusKm / (111.0 * Math.cos((userLat * Math.PI) / 180))

    const minLat = userLat - latDelta
    const maxLat = userLat + latDelta
    const minLng = userLng - lngDelta
    const maxLng = userLng + lngDelta

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
      .where(
        sql`
        ${barbershop.isActive}    = true
        AND ${barbershop.deletedAt} IS NULL
        AND ${barbershop.latitude}  IS NOT NULL
        AND ${barbershop.longitude} IS NOT NULL
        AND ${barbershop.latitude}  BETWEEN ${minLat} AND ${maxLat}
        AND ${barbershop.longitude} BETWEEN ${minLng} AND ${maxLng}
        AND calculate_distance(
              ${userLat}::double precision,
              ${userLng}::double precision,
              ${barbershop.latitude}::double precision,
              ${barbershop.longitude}::double precision
            ) <= ${radiusKm}
      `,
      )
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
      where: eq(barbershop.slug, slug),
      with: {
        services: {
          with: {
            category: true,
          },
        },
        hours: true,
        statusHistory: {
          limit: 1,
          orderBy: (status, { desc }) => [desc(status.updatedAt)],
        },
        owner: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!result) return null

    return result
  }

  async findById(id: string) {
    return db.query.barbershop.findFirst({
      where: eq(barbershop.id, id),
    })
  }

  async findWithPagination(
    search?: string,
    categorySlug?: string,
    page: number = 1,
    limit: number = 12,
  ) {
    const safeLimit = Math.min(limit, 12)

    const filters = []

    if (search) {
      filters.push(ilike(barbershop.name, `%${search}%`))
    }

    if (categorySlug) {
      filters.push(eq(category.slug, categorySlug))
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined

    const totalResult = await db
      .select({ count: countDistinct(barbershop.id) })
      .from(barbershop)
      .leftJoin(
        barbershopService,
        eq(barbershop.id, barbershopService.barbershopId),
      )
      .leftJoin(category, eq(barbershopService.categoryId, category.id))
      .where(whereClause)

    const total = Number(totalResult[0]?.count ?? 0)
    const totalPages = Math.max(1, Math.ceil(total / safeLimit))
    const safePage = Math.min(page, totalPages)
    const offset = (safePage - 1) * safeLimit

    const data = await db
      .selectDistinct({ barbershop })
      .from(barbershop)
      .leftJoin(
        barbershopService,
        eq(barbershop.id, barbershopService.barbershopId),
      )
      .leftJoin(category, eq(barbershopService.categoryId, category.id))
      .where(whereClause)
      .limit(safeLimit)
      .offset(offset)

    const barbershops = data.map((item) => item.barbershop)

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
