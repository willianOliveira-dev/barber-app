"use server"

import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { ActionResponse } from "../../_common/http/response/action.response"

interface GetBarbershopsWithPaginationParams {
  limit?: number
}

export async function getRecommendedBarbershops({
  limit = 8,
}: GetBarbershopsWithPaginationParams) {
  try {
    const result = await barbershopRepo.findRecommended(limit)

    return ActionResponse.success({
      message: "Barbearias recomendadas buscadas com sucesso",
      statusCode: 200,
      data: result,
    })
  } catch (error) {
    console.error("[getRecommendedBarbershops] Error: ", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao buscar barbearias recomendadas",
      statusCode: 500,
    })
  }
}
