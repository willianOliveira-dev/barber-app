"use server"
import { revalidatePath } from "next/cache"
import { ActionResponse } from "../../_common/http/response/action.response"
import { reviewRepo } from "@/src/repositories/review.repository"
import { authOptions } from "../../_lib/auth.lib"
import { getServerSession } from "next-auth"

export async function respondToReviewAction(
  reviewId: string,
  response: string,
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      console.error("[RespondToReviewAction] Error: Usuário não autenticado")
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    const review = await reviewRepo.findById(reviewId)

    if (!review) {
      console.error("[RespondToReviewAction] Error: Avaliação não encontrada")
      return ActionResponse.fail({
        error: "REVIEW_NOT_FOUND",
        message: "Avaliação não encontrada",
        statusCode: 404,
      })
    }

    if (review.barbershop.ownerId !== session.user.id) {
      console.error(
        "[RespondToReviewAction] Error: Usuário não é o dono da barbearia",
      )
      return ActionResponse.fail({
        error: "USER_FORBIDDEN",
        message: "Apenas o dono da barbearia pode responder",
        statusCode: 403,
      })
    }

    await reviewRepo.respondToReview(reviewId, response)

    revalidatePath(`/barbershops/${review.barbershop.slug}`)

    return ActionResponse.success({
      message: "Resposta enviada com sucesso",
      statusCode: 200,
      data: null,
    })
  } catch (error) {
    console.error("[RespondToReviewAction] Error:", error)
    return ActionResponse.fail({
      error: "INTERNAL_SERVER_ERROR",
      message: "Erro ao responder avaliação",
      statusCode: 500,
    })
  }
}
