import { and, desc, eq, inArray, lt, or, sql, gte, lte } from "drizzle-orm"
import { barbershop, barbershopService, booking } from "../db/schemas"
import { db } from "../db/connection"
import { BookingStatus, BookingWithRelations } from "../db/types/booking.type"

export interface CursorPaginationResponse {
  bookings: BookingWithRelations[]
  meta: {
    nextCursor: {
      id: string
      scheduledAt: Date
    } | null
    hasMore: boolean
    total: number
  }
}

export class BookingRepository {
  // ─── helper interno ───────────────────────────────────────────
  private barbershopFilter(barbershopId: string | string[]) {
    return Array.isArray(barbershopId)
      ? inArray(booking.barbershopId, barbershopId)
      : eq(booking.barbershopId, barbershopId)
  }

  // ─── sem alteração ────────────────────────────────────────────
  async findLatestByUser(userId: string): Promise<BookingWithRelations[]> {
    return db.query.booking.findMany({
      limit: 3,
      with: {
        barbershop: {
          columns: {
            id: true, name: true, slug: true, image: true,
            address: true, city: true, zipCode: true,
            state: true, phone: true, email: true,
          },
        },
        user: {
          columns: { id: true, email: true, name: true, image: true },
        },
        service: {
          columns: { id: true, name: true, priceInCents: true, durationMinutes: true },
        },
      },
      where: and(eq(booking.userId, userId), eq(booking.status, "completed")),
      orderBy: desc(booking.scheduledAt),
    })
  }

  async findWithCursorPagination(
    userId: string,
    cursor?: { id: string; scheduledAt: Date },
    limit: number = 5,
    status?: BookingStatus | BookingStatus[],
  ): Promise<CursorPaginationResponse> {
    const safeLimit = Math.min(limit, 5)
    const filters = []

    filters.push(eq(booking.userId, userId))

    if (cursor) {
      filters.push(
        or(
          lt(booking.scheduledAt, cursor.scheduledAt),
          and(
            eq(booking.scheduledAt, cursor.scheduledAt),
            lt(booking.id, cursor.id),
          ),
        ),
      )
    }

    if (status) {
      if (Array.isArray(status)) {
        filters.push(or(...status.map((s) => eq(booking.status, s))))
      } else {
        filters.push(eq(booking.status, status))
      }
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined

    const results = await db.query.booking.findMany({
      where: whereClause,
      with: {
        barbershop: {
          columns: {
            id: true, name: true, slug: true, image: true,
            address: true, city: true, zipCode: true,
            state: true, phone: true, email: true,
          },
        },
        user: {
          columns: { id: true, email: true, name: true, image: true },
        },
        service: {
          columns: { id: true, name: true, priceInCents: true, durationMinutes: true },
        },
      },
      orderBy: [desc(booking.scheduledAt), desc(booking.id)],
      limit: safeLimit + 1,
    })

    const hasMore = results.length > safeLimit
    const bookings = hasMore ? results.slice(0, safeLimit) : results
    const nextCursor = hasMore
      ? { scheduledAt: bookings[bookings.length - 1].scheduledAt, id: bookings[bookings.length - 1].id }
      : null

    return { bookings, meta: { nextCursor, hasMore, total: bookings.length } }
  }

  // ─── atualizado: aceita string | string[] ─────────────────────
  async findByDateAndBarbershop(barbershopId: string | string[], date: Date) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return await db.query.booking.findMany({
      where: and(
        this.barbershopFilter(barbershopId),
        eq(booking.status, "confirmed"),
        gte(booking.scheduledAt, startOfDay),
        lte(booking.scheduledAt, endOfDay),
      ),
      with: {
        user: { columns: { id: true, name: true } },
        service: { columns: { id: true, name: true, priceInCents: true } },
        barbershop: { columns: { id: true, name: true } },
      },
    })
  }

  // ─── sem alteração ────────────────────────────────────────────
  async findByBarbershopWithPagination(
    barbershopId: string,
    page: number = 1,
    limit: number = 10,
    status?: BookingStatus | BookingStatus[],
  ) {
    const safeLimit = Math.min(limit, 10)
    const offset = (page - 1) * safeLimit
    const filters = [eq(booking.barbershopId, barbershopId)]

    if (status) {
      if (Array.isArray(status)) {
        const statusFilters = status.map((s) => eq(booking.status, s))
        if (statusFilters.length > 0) filters.push(or(...statusFilters)!)
      } else {
        filters.push(eq(booking.status, status))
      }
    }

    const whereClause = and(...filters)

    const [results, [{ total }]] = await Promise.all([
      db.query.booking.findMany({
        where: whereClause,
        with: {
          user: { columns: { id: true, name: true, email: true, image: true } },
          barbershop: { columns: { id: true, name: true, slug: true } },
          service: { columns: { id: true, name: true, priceInCents: true, durationMinutes: true } },
        },
        orderBy: [desc(booking.scheduledAt), desc(booking.id)],
        limit: safeLimit,
        offset,
      }),
      db.select({ total: sql<number>`count(*)::int` }).from(booking).where(whereClause),
    ])

    const totalPages = Math.ceil(total / safeLimit)

    return {
      bookings: results,
      meta: {
        page, limit: safeLimit, total, totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    }
  }

  // ─── sem alteração ────────────────────────────────────────────
  async findRecommendedServices(userId: string, limit: number = 3) {
    const result = await db
      .select({ serviceId: booking.serviceId, count: sql<number>`count(*)` })
      .from(booking)
      .where(and(eq(booking.userId, userId), eq(booking.status, "completed")))
      .groupBy(booking.serviceId)
      .orderBy(desc(sql`count(*)`))
      .limit(limit)

    if (!result.length) return []
    const serviceIds = result.map((r) => r.serviceId)
    return await db.query.barbershopService.findMany({
      where: (service, { inArray }) => inArray(service.id, serviceIds),
    })
  }

  // ─── atualizado: aceita string | string[] ─────────────────────
  async getRevenue(barbershopId: string | string[], from: Date, to?: Date) {
    const filters = [
      this.barbershopFilter(barbershopId),
      gte(booking.scheduledAt, from),
      or(eq(booking.status, "confirmed"), eq(booking.status, "completed")),
    ]
    if (to) filters.push(lt(booking.scheduledAt, to))

    const results = await db.query.booking.findMany({
      where: and(...filters),
      with: { service: { columns: { priceInCents: true } } },
    })
    return results.reduce((sum, b) => sum + (b.service?.priceInCents ?? 0), 0)
  }

  async countByBarbershop(barbershopId: string | string[], from?: Date, to?: Date) {
    const filters = [this.barbershopFilter(barbershopId)]
    if (from) filters.push(gte(booking.scheduledAt, from))
    if (to) filters.push(lt(booking.scheduledAt, to))

    const [{ total }] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(booking)
      .where(and(...filters))
    return total
  }

  // ─── novos métodos de relatório ───────────────────────────────
  async countUniqueClients(barbershopId: string | string[]) {
    const [{ total }] = await db
      .select({ total: sql<number>`count(distinct ${booking.userId})::int` })
      .from(booking)
      .where(this.barbershopFilter(barbershopId))
    return total
  }

  async getCancellationRate(barbershopId: string | string[]) {
    const [result] = await db
      .select({
        total: sql<number>`count(*)::int`,
        cancelled: sql<number>`count(case when ${booking.status} = 'cancelled' then 1 end)::int`,
      })
      .from(booking)
      .where(this.barbershopFilter(barbershopId))
    return result
  }

  async getTopServices(barbershopId: string | string[], limit = 5) {
    return await db
      .select({
        serviceId: booking.serviceId,
        name: barbershopService.name,
        count: sql<number>`count(*)::int`,
        revenue: sql<number>`sum(${barbershopService.priceInCents})::int`,
      })
      .from(booking)
      .leftJoin(barbershopService, eq(booking.serviceId, barbershopService.id))
      .where(
        and(
          this.barbershopFilter(barbershopId),
          or(eq(booking.status, "confirmed"), eq(booking.status, "completed")),
        ),
      )
      .groupBy(booking.serviceId, barbershopService.name)
      .orderBy(desc(sql`count(*)`))
      .limit(limit)
  }

  async getBookingsByDayOfWeek(barbershopId: string | string[]) {
    return await db
      .select({
        dayOfWeek: sql<number>`extract(dow from ${booking.scheduledAt})::int`,
        count: sql<number>`count(*)::int`,
      })
      .from(booking)
      .where(this.barbershopFilter(barbershopId))
      .groupBy(sql`extract(dow from ${booking.scheduledAt})`)
      .orderBy(sql`extract(dow from ${booking.scheduledAt})`)
  }

  async getRevenueByMonth(barbershopId: string | string[], months = 6) {
    const from = new Date()
    from.setMonth(from.getMonth() - months)
    from.setDate(1)
    from.setHours(0, 0, 0, 0)

    return await db
      .select({
        month: sql<string>`to_char(${booking.scheduledAt}, 'YYYY-MM')`,
        revenue: sql<number>`sum(${barbershopService.priceInCents})::int`,
        count: sql<number>`count(*)::int`,
      })
      .from(booking)
      .leftJoin(barbershopService, eq(booking.serviceId, barbershopService.id))
      .where(
        and(
          this.barbershopFilter(barbershopId),
          gte(booking.scheduledAt, from),
          or(eq(booking.status, "confirmed"), eq(booking.status, "completed")),
        ),
      )
      .groupBy(sql`to_char(${booking.scheduledAt}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${booking.scheduledAt}, 'YYYY-MM')`)
  }

  // ─── sem alteração ────────────────────────────────────────────
  async updateStatus(id: string, status: BookingStatus) {
    return await db
      .update(booking)
      .set({
        status,
        updatedAt: new Date(),
        ...(status === "cancelled" ? { cancelledAt: new Date() } : undefined),
      })
      .where(eq(booking.id, id))
      .returning()
  }

  async findById(id: string) {
    return await db.query.booking.findFirst({
      where: eq(booking.id, id),
      with: {
        user: { columns: { id: true, name: true, email: true, image: true } },
        barbershop: {
          columns: {
            id: true, name: true, slug: true, image: true,
            address: true, city: true, zipCode: true,
            state: true, phone: true, email: true,
          },
        },
        service: {
          columns: { id: true, name: true, priceInCents: true, durationMinutes: true },
        },
      },
    })
  }

  async create(data: typeof booking.$inferInsert) {
    return await db.insert(booking).values(data).returning()
  }

  async cancel(id: string) {
    return await this.updateStatus(id, "cancelled")
  }

  async complete(id: string) {
    return await this.updateStatus(id, "completed")
  }
}

export const bookingRepo = new BookingRepository()