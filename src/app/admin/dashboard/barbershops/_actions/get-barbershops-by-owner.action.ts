"use server"

import { ActionResponse } from "@/src/app/_common/http/response/action.response"
import { authOptions } from "@/src/app/_lib/auth.lib"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { getServerSession } from "next-auth"

interface GetBarbershopsByOwnerParams {
  page: number
  limit: number
}

export async function getBarbershopsByOwner({
  page,
  limit,
}: GetBarbershopsByOwnerParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      console.error("[getBarbershopsByOwner] Usuário não autenticado")
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    if (session.user.role !== "barber") {
      console.error("[getBarbershopsByOwner] Usuário não é barbeiro")
      return ActionResponse.fail({
        error: "USER_FORBIDDEN",
        message: "Você não tem permisão para buscar barbearias",
        statusCode: 403,
      })
    }

    const result = await barbershopRepo.findBarbershopsByOwner(
      session.user.id,
      page,
      limit,
    )

    return ActionResponse.success({
      message: "Barbearias buscadas com sucesso",
      statusCode: 200,
      data: result,
    })
  } catch (error) {
    console.error("[getBarbershopsByOwner]", error)
    return ActionResponse.fail({
      error: "INTERNAL_SERVER_ERROR",
      message: "Erro ao buscar barbearias",
      statusCode: 500,
    })
  }
}
