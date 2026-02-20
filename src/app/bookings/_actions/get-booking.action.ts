"use server"
import {
  bookingRepo,
  type BookingStatus,
} from "@/src/repositories/booking.repository"
import { getServerSession } from "next-auth"
import { authOptions } from "../../_lib/auth.lib"
import { ActionResponse } from "../../_common/http/response/action.response"

interface GetBookingActionParams {
  cursor?: {
    id: string
    scheduledAt: Date
  }
  limit?: number
  status?: BookingStatus | BookingStatus[]
}

export async function getBookingsAction(params: GetBookingActionParams) {
  try {
    const { limit = 10, status } = params
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      console.error("[GetBookingsAction] Error: Usuário não autenticado")
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICADED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }
    const cursor = params.cursor
      ? {
          id: params.cursor.id,
          scheduledAt: new Date(params.cursor.scheduledAt),
        }
      : undefined

    const userId = session.user.id

    const result = await bookingRepo.findWithCursorPagination(
      userId,
      cursor,
      limit,
      status,
    )
    return ActionResponse.success({
      data: result,
      message: "Operação realizada com sucesso",
      statusCode: 200,
    })
  } catch (err) {
    console.error("[getBookingsAction] Error:", err)
    return ActionResponse.fail({
      error: "INTERNAL_SERVER_ERROR",
      message: "Erro interno do servidor",
      statusCode: 500,
    })
  }
}
