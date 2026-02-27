"use server"

import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { ActionResponse } from "../../_common/http/response/action.response"

interface GetBarbershopsWithPaginationParams {
  limit?: number
}

export async function getPopularBarbershops({
  limit = 4,
}: GetBarbershopsWithPaginationParams) {
  try {
    const result = await barbershopRepo.findPopular(limit)

    return ActionResponse.success({
      message: "Barbearias populares buscadas com sucesso",
      statusCode: 200,
      data: result,
    })
  } catch (error) {
    console.error("[getPopularBarbershops] Error: ", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao buscar barbearias populares",
      statusCode: 500,
    })
  }
}
