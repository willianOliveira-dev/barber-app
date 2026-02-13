"use server"

import {
  GetAvailableSlotsInput,
  getAvailableSlotsUseCase,
} from "@/src/use-cases/get-available-slots.use-case"

export type GetAvailableStotsActionParams = GetAvailableSlotsInput

export async function getAvailableSlotsAction({
  barbershopId,
  serviceId,
  date,
}: GetAvailableStotsActionParams) {
  return await getAvailableSlotsUseCase.execute({
    barbershopId,
    serviceId,
    date,
  })
}
