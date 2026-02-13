import type {
  BarbershopService,
  BarbershopHour,
  AvailableTimeSlot,
} from "../db/types"
import { timeSlotRepo } from "../repositories/available-time-slot.repository"
import { barbershopRepo } from "../repositories/barbershop.repository"

export class TimeSlotService {
  generateAvailableSlots(
    barbershopHours: BarbershopHour,
    service: BarbershopService,
    date: Date,
  ) {
    const slots: Omit<AvailableTimeSlot, "id">[] = []

    const serviceDurationMinutes = service.durationMinutes * 60 * 1000

    const [openHour, openMinute] = barbershopHours.openingTime
      .split(":")
      .map(Number)
    const [closeHour, closeMinute] = barbershopHours.closingTime
      .split(":")
      .map(Number)

    let currentTime = new Date(date)
    currentTime.setHours(openHour, openMinute, 0, 0)

    const closingTime = new Date(date)
    closingTime.setHours(closeHour, closeMinute, 0, 0)

    while (
      currentTime.getTime() + serviceDurationMinutes <=
      closingTime.getTime()
    ) {
      slots.push({
        barbershopId: service.barbershopId,
        bookingId: null,
        isAvailable: true,
        serviceId: service.id,
        startTime: new Date(currentTime),
      })

      currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000)
    }

    return slots
  }

  async checkSlotAvailability(
    barbershopId: string,
    serviceId: string,
    startTime: Date,
  ) {
    const service = await barbershopRepo.findServiceById(serviceId)

    if (!service) {
      throw new Error("Service não encontrado")
    }

    const endTime = new Date(
      startTime.getTime() + service.durationMinutes * 60 * 1000,
    )

    const conflictingBookings = await timeSlotRepo.findSlotsByTimeRange(
      barbershopId,
      serviceId,
      startTime,
      endTime,
    )

    return conflictingBookings.length === 0
  }

  calculateEndTime(startTime: Date, durationMinutes: number): Date {
    return new Date(startTime.getTime() + durationMinutes * 60 * 1000)
  }

  isWithinBusinessHours(time: Date, barbershopHours: BarbershopHour): boolean {
    const [openHour, openMin] = barbershopHours.openingTime
      .split(":")
      .map(Number)
    const [closeHour, closeMin] = barbershopHours.closingTime
      .split(":")
      .map(Number)

    const timeInMinutes = time.getHours() * 60 + time.getMinutes()
    const openInMinutes = openHour * 60 + openMin
    const closeInMinutes = closeHour * 60 + closeMin

    return timeInMinutes >= openInMinutes && timeInMinutes < closeInMinutes
  }
}
export const timeSlotService = new TimeSlotService()
