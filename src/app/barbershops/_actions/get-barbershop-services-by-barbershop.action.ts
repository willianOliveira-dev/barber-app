"use server"

import { ActionResponse } from "@/src/app/_common/http/response/action.response"
import { authOptions } from "@/src/app/_lib/auth.lib"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { getServerSession } from "next-auth"

interface GetBarbershopServicesByBarbershopParams {
  barbershopId: string
  page: number
  limit: number
}

export async function getBarbershopServicesByBarbershop({
  barbershopId,
  limit,
  page,
}: GetBarbershopServicesByBarbershopParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      console.error(
        "[getBarbershopServicesByBarbershop] Usuário não autenticado",
      )
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    if (session.user.role !== "barber") {
      console.error(
        "[getBarbershopServicesByBarbershop] Usuário não é barbeiro",
      )
      return ActionResponse.fail({
        error: "USER_FORBIDDEN",
        message: "Você não tem permissão para criar uma barbearia",
        statusCode: 403,
      })
    }

    const result = await barbershopRepo.findServicesByBarbershop(
      barbershopId,
      page,
      limit,
    )
    
    return ActionResponse.success({
      message: "Serviços buscados com sucesso",
      statusCode: 200,
      data: result,
    })
      
  } catch (error) {
    console.error("[getBarbershopServicesByBarbershop] Error: ", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao buscar serviços",
      statusCode: 500,
    })
  }
}
