"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/src/app/_lib/auth.lib"
import { ActionResponse } from "@/src/app/_common/http/response/action.response"
import { bookingRepo } from "@/src/repositories/booking.repository"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { BookingStatus } from "@/src/db/types/booking.type"
import { revalidatePath } from "next/cache"

interface UpdateBookingStatusParams {
  bookingId: string
  status: BookingStatus
}

export async function updateBookingStatusAction({
  bookingId,
  status,
}: UpdateBookingStatusParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    const bookingData = await bookingRepo.findById(bookingId)
    if (!bookingData) {
      return ActionResponse.fail({
        error: "NOT_FOUND",
        message: "Agendamento não encontrado",
        statusCode: 404,
      })
    }

    const barbershop = await barbershopRepo.findByOwnerId(session.user.id)
    if (!barbershop || barbershop.id !== bookingData.barbershopId) {
      return ActionResponse.fail({
        error: "FORBIDDEN",
        message: "Sem permissão para alterar este agendamento",
        statusCode: 403,
      })
    }

    if (bookingData.status === "cancelled") {
      return ActionResponse.fail({
        error: "CONFLICT",
        message: "Agendamento já cancelado",
        statusCode: 409,
      })
    }

    const [updated] = await bookingRepo.updateStatus(bookingId, status)

    revalidatePath("/admin/dashboard/bookings")

    return ActionResponse.success({
      message: "Status atualizado com sucesso",
      statusCode: 200,
      data: updated,
    })
  } catch (error) {
    console.error("[updateBookingStatusAction]", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao atualizar agendamento",
      statusCode: 500,
    })
  }
}
