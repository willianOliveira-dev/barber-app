
"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/src/app/_lib/auth.lib" 
import { ActionResponse } from "@/src/app/_common/http/response/action.response" 
import { bookingRepo } from "@/src/repositories/booking.repository"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { BookingStatus } from "@/src/db/types/booking.type"

interface GetAdminBookingsParams {
  status?: BookingStatus | BookingStatus[]
  page?: number
  limit?: number
}

export async function getAdminBookingsAction(params?: GetAdminBookingsParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    const barbershop = await barbershopRepo.findByOwnerId(session.user.id)
    if (!barbershop) {
      return ActionResponse.fail({
        error: "NOT_FOUND",
        message: "Barbearia não encontrada",
        statusCode: 404,
      })
    }

    const result = await bookingRepo.findByBarbershopWithPagination(
      barbershop.id,
      params?.page ?? 1,
      params?.limit ?? 10,
      params?.status,
    )

    return ActionResponse.success({
      message: "Agendamentos buscados com sucesso",
      statusCode: 200,
      data: result,
    })
  } catch (error) {
    console.error("[getAdminBookingsAction]", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao buscar agendamentos",
      statusCode: 500,
    })
  }
}