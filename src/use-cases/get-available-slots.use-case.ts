import { timeSlotRepo } from "../repositories/available-time-slot.repository"
import {
  barbershopRepo,
  DayOfWeekEnum,
} from "../repositories/barbershop.repository"
import { timeSlotService } from "../services/available-time-slot.service"

export interface GetAvailableSlotsInput {
  barbershopId: string
  serviceId: string
  date: Date
}

export interface GetAvailableSlotsOutput {
  slots: {
    id?: string
    startTime: Date
    endTime: Date
    isAvailable: boolean
  }[]
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

    // 2. Busca os horários de funcionamento do dia
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

    // 3. MUDANÇA: Busca TODOS os slots do dia (não apenas disponíveis)
    const existingSlots = await timeSlotRepo.findSlotsByDate(
      barbershopId,
      serviceId,
      date,
    )

    if (existingSlots.length === 0) {
      return { slots: [] }
    }
    // 4. Gera os slots teóricos possíveis
    const theoreticalSlots = timeSlotService.generateAvailableSlots(
      barbershopHours,
      service,
      date,
    )

    // 5. Cria um mapa dos slots existentes
    const existingSlotsMap = new Map(
      existingSlots.map((slot) => [slot.startTime.getTime(), slot]),
    )

    // 6. Mescla slots teóricos com dados reais do banco
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
        // Se existe no banco, usa o status real; senão, considera disponível
        isAvailable: existingSlot?.isAvailable ?? true,
      }
    })

    return { slots }
  }
}

export const getAvailableSlotsUseCase = new GetAvailableSlotsUseCase()
