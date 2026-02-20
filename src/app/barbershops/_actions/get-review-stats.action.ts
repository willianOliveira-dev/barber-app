"use server"
import { reviewRepo } from "@/src/repositories/review.repository"
import { ActionResponse } from "../../_common/http/response/action.response"

export async function getReviewStatsAction(barbershopId: string) {
  try {
    const stats = await reviewRepo.getStatsByBarbershop(barbershopId)
    return ActionResponse.success({
      data: stats,
      message: "Operação realizada com sucesso",
      statusCode: 200,
    })
  } catch (error) {
    console.error("[GetReviewStatsAction] Error:", error)
    return ActionResponse.fail({
      error: "INTERNAL_SERVER_ERROR",
      message: "Erro interno ao obter estatísticas de avaliação",
      statusCode: 500,
    })
  }
}
