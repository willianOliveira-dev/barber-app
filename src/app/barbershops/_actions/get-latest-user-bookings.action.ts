"use server"

import { bookingRepo } from "@/src/repositories/booking.repository"
import { ActionResponse } from "../../_common/http/response/action.response"
import { getServerSession } from "next-auth"
import { authOptions } from "../../_lib/auth.lib"

interface GetLatestUserBookingsParams {
  userId: string
}

export async function getLatestUserBookings({
  userId,
}: GetLatestUserBookingsParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Você precisa estar logado para ver seus agendamentos",
        statusCode: 401,
      })
    }

    if (session.user.id !== userId) {
      return ActionResponse.fail({
        error: "USER_FORBIDDEN",
        message: "Você não tem permissão para acessar estes dados",
        statusCode: 403,
      })
    }

    const bookings = await bookingRepo.findLatestByUser(userId)

    return ActionResponse.success({
      message: "Últimos agendamentos recuperados com sucesso",
      statusCode: 200,
      data: bookings,
    })
  } catch (error) {
    console.error("[getLatestUserBookings] Error: ", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao buscar histórico de agendamentos",
      statusCode: 500,
    })
  }
}
