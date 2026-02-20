"use server"

import {
  GetAvailableSlotsInput,
  getAvailableSlotsUseCase,
} from "@/src/use-cases/get-available-slots.use-case"
import { ActionResponse } from "../../_common/http/response/action.response"

export type GetAvailableStotsActionParams = GetAvailableSlotsInput

export async function getAvailableSlotsAction({
  barbershopId,
  serviceId,
  date,
}: GetAvailableStotsActionParams) {
  try {
    const data = await getAvailableSlotsUseCase.execute({
      barbershopId,
      serviceId,
      date,
    })

    return ActionResponse.success({
      data,
      message: "Operação realizada com sucesso",
      statusCode: 200,
    })
  } catch (error) {
    console.error("[getAvailableSlotsAction] Error:", error)
    return ActionResponse.fail({
      error: "INTERNAL_SERVER_ERROR",
      message: "Erro interno do servidor",
      statusCode: 500,
    })
  }
}
