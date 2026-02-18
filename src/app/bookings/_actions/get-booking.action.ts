"use server"
import { user } from "@/src/db/schemas"
import {
  bookingRepo,
  type BookingStatus,
} from "@/src/repositories/booking.repository"
import { getServerSession } from "next-auth"
import { authOptions } from "../../_lib/auth.lib"

interface GetBookingActionParams {
  cursor?: {
    id: string
    createdAt: Date
  }
  limit?: number
  status?: BookingStatus | BookingStatus[]
}

export async function getBookingsAction(params: GetBookingActionParams) {
  try {
    const { limit = 10, status } = params
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return {
        success: false,
        message: "Não autorizado",
      }
    }
    const cursor = params.cursor
      ? {
          id: params.cursor.id,
          createdAt: new Date(params.cursor.createdAt),
        }
      : undefined

    const userId = session.user.id

    const result = await bookingRepo.findWithCursorPagination(
      userId,
      cursor,
      limit,
      status,
    )

    return {
      success: true,
      data: result,
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: "Erro ao buscar agendamentos",
    }
  }
}
