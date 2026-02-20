"use server"

import { ReviewRating } from "@/src/db/types/review.type"
import { getServerSession } from "next-auth"
import { authOptions } from "../../_lib/auth.lib"
import { ActionResponse } from "../../_common/http/response/action.response"
import { reviewRepo } from "@/src/repositories/review.repository"
import { revalidatePath } from "next/cache"

interface UpdateReviewInput {
  reviewId: string
  rating: ReviewRating
  comment?: string
}

export async function updateReviewAction(input: UpdateReviewInput) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      console.error("[UpdateReviewAction] Error: Usuário não autenticado")
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    const review = await reviewRepo.findById(input.reviewId)

    if (!review) {
      console.error("[UpdateReviewAction] Error: Avaliação não encontrada")
      return ActionResponse.fail({
        error: "REVIEW_NOT_FOUND",
        message: "Avaliação não encontrada",
        statusCode: 404,
      })
    }

    if (review.userId !== session.user.id) {
      console.error("[UpdateReviewAction] Error: Usuário não autorizado")
      return ActionResponse.fail({
        error: "USER_FORBIDDEN",
        message: "Você não tem permissão para editar esta avaliação",
        statusCode: 403,
      })
    }

    const [updatedReview] = await reviewRepo.update(input.reviewId, {
      rating: input.rating,
      comment: input.comment || null,
    })

    revalidatePath(`/barbershops/${review.barbershop.slug}`)

    return ActionResponse.success({
      data: updatedReview,
      message: "Avaliação atualizada com sucesso",
      statusCode: 200,
    })
  } catch (error) {
    console.error("[UpdateReviewAction] Error:", error)
    return ActionResponse.fail({
      error: "INTERNAL_SERVER_ERROR",
      message: "Erro interno ao atualizar avaliação",
      statusCode: 500,
    })
  }
}
