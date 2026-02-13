import { db } from "../db/connection"
import { and, eq, gte, lt, lte, or } from "drizzle-orm"
import { availableTimeSlot } from "../db/schemas"

export class TimeSlotRepository {
  async findSlotsByDate(barbershopId: string, serviceId: string, date: Date) {
    // Define início do dia (00:00:00)
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    // Define fim do dia (23:59:59)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return await db.query.availableTimeSlot.findMany({
      where: and(
        eq(availableTimeSlot.barbershopId, barbershopId),
        eq(availableTimeSlot.serviceId, serviceId),
        gte(availableTimeSlot.startTime, startOfDay),
        lte(availableTimeSlot.startTime, endOfDay),
      ),
      orderBy: (slots, { asc }) => [asc(slots.startTime)],
    })
  }

  async findAvailableSlots(
    barbershopId: string,
    serviceId: string,
    date: Date,
  ) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return await db.query.availableTimeSlot.findMany({
      where: and(
        eq(availableTimeSlot.barbershopId, barbershopId),
        eq(availableTimeSlot.serviceId, serviceId),
        eq(availableTimeSlot.isAvailable, true),
        gte(availableTimeSlot.startTime, startOfDay),
        lte(availableTimeSlot.startTime, endOfDay),
      ),
      orderBy: (slots, { asc }) => [asc(slots.startTime)],
    })
  }

  async findSlotsByTimeRange(
    barbershopId: string,
    serviceId: string,
    startTime: Date,
    endTime: Date,
  ) {
    return await db.query.availableTimeSlot.findMany({
      where: and(
        eq(availableTimeSlot.barbershopId, barbershopId),
        eq(availableTimeSlot.serviceId, serviceId),
        eq(availableTimeSlot.isAvailable, false),
        or(
          and(
            gte(availableTimeSlot.startTime, startTime),
            lt(availableTimeSlot.startTime, endTime),
          ),
          and(
            lt(availableTimeSlot.startTime, startTime),
            gte(
              availableTimeSlot.startTime,
              new Date(startTime.getTime() - 75 * 60 * 1000),
            ),
          ),
        ),
      ),
    })
  }

  async createSlot(data: typeof availableTimeSlot.$inferInsert) {
    return await db.insert(availableTimeSlot).values(data).returning()
  }

  async updateSlot(
    id: string,
    data: Partial<typeof availableTimeSlot.$inferInsert>,
  ) {
    return await db
      .update(availableTimeSlot)
      .set(data)
      .where(eq(availableTimeSlot.id, id))
      .returning()
  }

  async markSlotAsBooked(id: string, bookingId: string) {
    return await db
      .update(availableTimeSlot)
      .set({ isAvailable: false, bookingId })
      .where(eq(availableTimeSlot.id, id))
      .returning()
  }

  async releaseSlot(id: string) {
    return await db
      .update(availableTimeSlot)
      .set({ isAvailable: true, bookingId: null })
      .where(eq(availableTimeSlot.id, id))
      .returning()
  }
}

export const timeSlotRepo = new TimeSlotRepository()
