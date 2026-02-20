"use server"

import { reviewRepo } from "@/src/repositories/review.repository"
import { getServerSession } from "next-auth"
import { authOptions } from "../../_lib/auth.lib"
import { ActionResponse } from "../../_common/http/response/action.response"
import { ReviewRating, ReviewSortBy } from "@/src/db/types/review.type"

interface GetReviewsParams {
  barbershopId: string
  rating?: ReviewRating | ReviewRating[]
  sortBy?: ReviewSortBy
  cursor?: {
    id: string
    createdAt: string
  }
  limit?: number
}

export async function getReviewsAction(params: GetReviewsParams) {
  try {
    const session = await getServerSession(authOptions)

    const cursor = params.cursor
      ? {
          id: params.cursor.id,
          createdAt: new Date(params.cursor.createdAt),
        }
      : undefined

    const result = await reviewRepo.findWithCursorPagination({
      ...params,
      cursor,
      userId: session?.user?.id,
    })

    const serializedResult = {
      reviews: result.reviews.map((review) => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
        respondedAt: review.respondedAt?.toISOString() || null,
      })),
      meta: {
        ...result.meta,
        nextCursor: result.meta.nextCursor
          ? {
              id: result.meta.nextCursor.id,
              createdAt: result.meta.nextCursor.createdAt.toISOString(),
            }
          : null,
      },
    }

    return ActionResponse.success({
      data: serializedResult,
      message: "Operação realizada com sucesso",
      statusCode: 200,
    })
  } catch (err) {
    console.error(err)
    console.error("[GetReviewsAction]: Error:", err)
    return ActionResponse.fail({
      error: "INTERNAL_SERVER_ERROR",
      message: "Erro interno ao obter avaliações",
      statusCode: 500,
    })
  }
}
