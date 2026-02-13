import { timeSlotRepo } from "../repositories/available-time-slot.repository"
import {
  barbershopRepo,
  DayOfWeekEnum,
} from "../repositories/barbershop.repository"
import { timeSlotService } from "../services/available-time-slot.service"

type GetAvailableSlotsInput = {
  barbershopId: string
  serviceId: string
  date: Date
}

type GetAvailableSlotsOutput = {
  slots: Array<{
    id?: string
    startTime: Date
    endTime: Date
    isAvailable: boolean
  }>
}

export class GetAvailableSlotsUseCase {
  async execute({
    barbershopId,
    serviceId,
    date,
  }: GetAvailableSlotsInput): Promise<GetAvailableSlotsOutput> {
    // 1. Busca o serviço
    const service = await barbershopRepo.findServiceById(serviceId)
    if (!service) {
      throw new Error("Serviço não encontrado")
    }

    const dayOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][date.getDay()] as DayOfWeekEnum

    const barbershopHours = await barbershopRepo.findHoursByBarbershopAndDay(
      barbershopId,
      dayOfWeek,
    )

    if (!barbershopHours || !barbershopHours.isOpen) {
      return { slots: [] }
    }

    const theoreticalSlots = timeSlotService.generateAvailableSlots(
      barbershopHours,
      service,
      date,
    )

    const existingSlots = await timeSlotRepo.findAvailableSlots(
      barbershopId,
      serviceId,
      date,
    )

    const existingSlotsMap = new Map(
      existingSlots.map((slot) => [slot.startTime.getTime(), slot]),
    )

    const slots = theoreticalSlots.map((theoreticalSlot) => {
      const existingSlot = existingSlotsMap.get(
        theoreticalSlot.startTime.getTime(),
      )

      return {
        id: existingSlot?.id,
        startTime: theoreticalSlot.startTime,
        endTime: timeSlotService.calculateEndTime(
          theoreticalSlot.startTime,
          service.durationMinutes,
        ),
        isAvailable: existingSlot?.isAvailable ?? true,
      }
    })

    return { slots }
  }
}

export const getAvailableSlotsUseCase = new GetAvailableSlotsUseCase()
