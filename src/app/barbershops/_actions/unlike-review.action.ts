"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../../_lib/auth.lib"
import { ActionResponse } from "../../_common/http/response/action.response"
import { reviewRepo } from "@/src/repositories/review.repository"
import { revalidatePath } from "next/cache"

export async function unlikeReviewAction(reviewId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      console.error("[UnlikeReviewAction] Error: Usuário não autenticado")
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    await reviewRepo.unlikeReview(reviewId, session.user.id)
    const review = await reviewRepo.findById(reviewId)

    if (!review) {
      console.error("[UnlikeReviewAction] Error: Avaliação não encontrada")
      return ActionResponse.fail({
        error: "REVIEW_NOT_FOUND",
        message: "Avaliação não encontrada",
        statusCode: 404,
      })
    }

    revalidatePath(`/barbershops/${review.barbershop.slug}`)
    
    return ActionResponse.success({
      message: "Curtida removida com sucesso",
      statusCode: 200,
      data: null,
    })
  } catch (error) {
    console.error("[UnlikeReviewAction] Error:", error)
    return ActionResponse.fail({
      error: "INTERNAL_SERVER_ERROR",
      message: "Erro interno ao remover curtida",
      statusCode: 500,
    })
  }
}
