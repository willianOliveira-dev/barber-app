"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/src/app/_lib/auth.lib"
import { ActionResponse } from "@/src/app/_common/http/response/action.response"
import { reviewRepo } from "@/src/repositories/review.repository"

interface ReplyReviewParams {
  reviewId: string
  response: string
}

export async function replyReviewAction({
  reviewId,
  response,
}: ReplyReviewParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    const reviewData = await reviewRepo.findById(reviewId)
    if (!reviewData) {
      return ActionResponse.fail({
        error: "NOT_FOUND",
        message: "Avaliação não encontrada",
        statusCode: 404,
      })
    }

    if (reviewData.barbershop.ownerId !== session.user.id) {
      return ActionResponse.fail({
        error: "FORBIDDEN",
        message: "Sem permissão para responder esta avaliação",
        statusCode: 403,
      })
    }

    const [updated] = await reviewRepo.respondToReview(reviewId, response)

    return ActionResponse.success({
      message: "Resposta enviada com sucesso",
      statusCode: 200,
      data: updated,
    })
  } catch (error) {
    console.error("[replyReviewAction]", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao responder avaliação",
      statusCode: 500,
    })
  }
}
