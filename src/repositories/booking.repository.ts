import { and, desc, eq, lt, or, sql } from "drizzle-orm"
import { booking } from "../db/schemas"
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
  async findLatestByUser(userId: string): Promise<BookingWithRelations[]> {
    return db.query.booking.findMany({
      limit: 3,
      with: {
        barbershop: {
          columns: {
            id: true,
            name: true,
            slug: true,
            image: true,
            address: true,
            city: true,
            zipCode: true,
            state: true,
            phone: true,
            email: true,
          },
        },
        user: {
          columns: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
        service: {
          columns: {
            id: true,
            name: true,
            priceInCents: true,
            durationMinutes: true,
          },
        },
      },
      where: and(eq(booking.userId, userId), eq(booking.status, "completed")),
      orderBy: desc(booking.scheduledAt),
    })
  }

  async findWithCursorPagination(
    userId: string,
    cursor?: {
      id: string
      scheduledAt: Date
    },
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
            id: true,
            name: true,
            slug: true,
            image: true,
            address: true,
            city: true,
            zipCode: true,
            state: true,
            phone: true,
            email: true,
          },
        },
        user: {
          columns: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
        service: {
          columns: {
            id: true,
            name: true,
            priceInCents: true,
            durationMinutes: true,
          },
        },
      },
      orderBy: [desc(booking.scheduledAt), desc(booking.id)],
      limit: safeLimit + 1,
    })

    const hasMore = results.length > safeLimit
    const bookings = hasMore ? results.slice(0, safeLimit) : results

    const nextCursor = hasMore
      ? {
          scheduledAt: bookings[bookings.length - 1].scheduledAt,
          id: bookings[bookings.length - 1].id,
        }
      : null
    return {
      bookings,
      meta: {
        nextCursor,
        hasMore,
        total: bookings.length,
      },
    }
  }

  // async rebookFromLatest(userId: string, newScheduledAt: Date) {
  //   const latest = await this.findLatestByUser(userId)

  //   if (!latest) {
  //     return null
  //   }

  //   const endTime = new Date(
  //     newScheduledAt.getTime() + latest.service.durationMinutes * 60000,
  //   )

  //   const [newBooking] = await db
  //     .insert(booking)
  //     .values({
  //       userId,

  //       serviceId: latest.service.id,

  //       barbershopId: latest.barbershop.id,

  //       scheduledAt: newScheduledAt,

  //       endTime,

  //       status: "confirmed",
  //     })
  //     .returning()

  //   return newBooking
  // }

  async findRecommendedServices(userId: string, limit: number = 3) {
    const result = await db
      .select({
        serviceId: booking.serviceId,
        count: sql<number>`count(*)`,
      })
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
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        barbershop: {
          columns: {
            id: true,
            name: true,
            slug: true,
            image: true,
            address: true,
            city: true,
            zipCode: true,
            state: true,
            phone: true,
            email: true,
          },
        },
        service: {
          columns: {
            id: true,
            name: true,
            priceInCents: true,
            durationMinutes: true,
          },
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
