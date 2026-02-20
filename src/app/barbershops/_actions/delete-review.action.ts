"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../../_lib/auth.lib"
import { ActionResponse } from "../../_common/http/response/action.response"
import { reviewRepo } from "@/src/repositories/review.repository"
import { revalidatePath } from "next/cache"

export async function deleteReviewAction(reviewId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      console.error("[DeleteReviewAction] Error: Usuário não autenticado")
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    const review = await reviewRepo.findById(reviewId)

    if (!review) {
      console.error("[DeleteReviewAction] Error: Avaliação não encontrada")
      return ActionResponse.fail({
        error: "REVIEW_NOT_FOUND",
        message: "Avaliação não encontrada",
        statusCode: 404,
      })
    }

    if (review.userId !== session.user.id) {
      console.error("[DeleteReviewAction] Error: Usuário não autorizado")
      return ActionResponse.fail({
        error: "USER_FORBIDDEN",
        message: "Você não tem permissão para excluir esta avaliação",
        statusCode: 403,
      })
    }

    await reviewRepo.delete(reviewId)

    revalidatePath(`/barbershops/${review.barbershop.slug}`)
    revalidatePath("/bookings")

    return ActionResponse.success({
      message: "Avaliação excluída com sucesso",
      statusCode: 200,
      data: null,
    })
      
  } catch (error) {
    console.error("[DeleteReviewAction] Error:", error)
    return ActionResponse.fail({
      error: "INTERNAL_SERVER_ERROR",
      message: "Erro interno ao excluir avaliação",
      statusCode: 500,
    })
  }
}
