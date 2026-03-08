"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/src/app/_lib/auth.lib"
import { ActionResponse } from "@/src/app/_common/http/response/action.response"
import { reviewRepo } from "@/src/repositories/review.repository"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"

export async function getAdminReviewsAction() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    const barbershop = await barbershopRepo.findByOwnerId(session.user.id)

    if (!barbershop) {
      return ActionResponse.fail({
        error: "NOT_FOUND",
        message: "Barbearia não encontrada",
        statusCode: 404,
      })
    }

    const result = await reviewRepo.findWithCursorPagination({
      barbershopId: barbershop.id,
      sortBy: "recent",
      limit: 5,
    })

    return ActionResponse.success({
      message: "Reviews buscadas com sucesso",
      statusCode: 200,
      data: result,
    })
  } catch (error) {
    console.error("[getAdminReviewsAction]", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao buscar reviews",
      statusCode: 500,
    })
  }
}
