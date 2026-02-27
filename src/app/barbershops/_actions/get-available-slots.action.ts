"use server"

import {
  barbershopRepo,
  DayOfWeekEnum,
} from "@/src/repositories/barbershop.repository"
import { bookingRepo } from "@/src/repositories/booking.repository"
import { ActionResponse } from "../../_common/http/response/action.response"

export interface SlotOutput {
  startTime: Date
  endTime: Date
  isAvailable: boolean
}

interface GetAvailableSlotsInput {
  barbershopId: string
  serviceId: string
  date: Date
}

function generateSlots(
  openingTime: string,
  closingTime: string,
  durationMinutes: number,
  date: Date,
  existingBookings: { scheduledAt: Date; endTime: Date }[],
): SlotOutput[] {
  const [openHour, openMinute] = openingTime.split(":").map(Number)
  const [closeHour, closeMinute] = closingTime.split(":").map(Number)

  const closingDate = new Date(date)
  closingDate.setHours(closeHour, closeMinute, 0, 0)

  let current = new Date(date)
  current.setHours(openHour, openMinute, 0, 0)

  const durationMs = durationMinutes * 60 * 1000
  const now = new Date()
  const slots: SlotOutput[] = []

  while (current.getTime() + durationMs <= closingDate.getTime()) {
    const startTime = new Date(current)
    const endTime = new Date(current.getTime() + durationMs)

    const isPast = startTime <= now

    const hasConflict = existingBookings.some(
      (booking) => startTime < booking.endTime && endTime > booking.scheduledAt,
    )

    slots.push({
      startTime,
      endTime,
      isAvailable: !isPast && !hasConflict,
    })

    current = new Date(current.getTime() + 30 * 60 * 1000)
  }

  return slots
}

export async function getAvailableSlotsAction(input: GetAvailableSlotsInput) {
  try {
    const { barbershopId, serviceId, date } = input

    const service = await barbershopRepo.findServiceById(serviceId)
    if (!service) {
      return ActionResponse.fail({
        error: "NOT_FOUND",
        message: "Serviço não encontrado",
        statusCode: 404,
      })
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

    const hours = await barbershopRepo.findHoursByBarbershopAndDay(
      barbershopId,
      dayOfWeek,
    )

    if (!hours || !hours.isOpen) {
      return ActionResponse.success({
        message: "Barbearia fechada neste dia",
        statusCode: 200,
        data: { slots: [] },
      })
    }

    const existingBookings = await bookingRepo.findByDateAndBarbershop(
      barbershopId,
      date,
    )

    const slots = generateSlots(
      hours.openingTime,
      hours.closingTime,
      service.durationMinutes,
      date,
      existingBookings,
    )

    return ActionResponse.success({
      message: "Horários buscados com sucesso",
      statusCode: 200,
      data: { slots },
    })
  } catch (error) {
    console.error("[getAvailableSlotsAction] Error: ", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao buscar horários disponíveis",
      statusCode: 500,
    })
  }
}
