"use server"

import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { ActionResponse } from "../../_common/http/response/action.response"

interface GetBarbershopsWithPaginationParams {
  search?: string
  categorySlug?: string
  page?: number
  limit?: number
}

export async function getBarbershopsWithPagination({
  search,
  categorySlug,
  page = 1,
  limit = 12,
}: GetBarbershopsWithPaginationParams) {
  try {
    const result = await barbershopRepo.findBarbershopsBySearch(
      search,
      categorySlug,
      page,
      limit,
    )

    return ActionResponse.success({
      message: "Barbearias buscadas com sucesso",
      statusCode: 200,
      data: result,
    })
  } catch (error) {
    console.error("[getBarbershopsWithPagination] Error: ", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao buscar barbearias",
      statusCode: 500,
    })
  }
}
