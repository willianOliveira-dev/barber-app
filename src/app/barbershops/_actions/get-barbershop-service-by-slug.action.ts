"use server"

import { barbershopServiceRepo } from "@/src/repositories/barbershop-service.repository"
import { ActionResponse } from "../../_common/http/response/action.response"

export async function getBarbershopServiceBySlug(slug: string) {
  try {
    const service = await barbershopServiceRepo.findBySlug(slug)

    if (!service || !service.isActive) {
      return ActionResponse.fail({
        error: "NOT_FOUND",
        message: "Serviço não encontrado ou inativo",
        statusCode: 404,
      })
    }

    return ActionResponse.success({
      message: "Serviço encontrado com sucesso",
      statusCode: 200,
      data: service,
    })
  } catch (error) {
    console.error("[getBarbershopServiceBySlug] Error: ", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao buscar detalhes do serviço",
      statusCode: 500,
    })
  }
}
