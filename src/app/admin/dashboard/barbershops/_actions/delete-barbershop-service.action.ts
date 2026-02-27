"use server"

import { ActionResponse } from "@/src/app/_common/http/response/action.response"
import { authOptions } from "@/src/app/_lib/auth.lib"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { type BarbershopService } from "@/src/db/types"
import { barbershopServiceRepo } from "@/src/repositories/barbershop-service.repository"
import { notFound } from "next/navigation"

export async function deleteBarbershopServiceAction(serviceId: string) {
  let service: BarbershopService | null

  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      console.error("[deleteServiceAction] Usuário não autenticado")
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    if (session.user.role !== "barber") {
      console.error("[deleteServiceAction] Usuário não é barbeiro")
      return ActionResponse.fail({
        error: "USER_FORBIDDEN",
        message: "Você não tem permissão para deletar um serviço",
        statusCode: 403,
      })
    }
    
    const hasBooking = await barbershopServiceRepo.hasBooking(serviceId)

    if (hasBooking) {
      console.error("[deleteServiceAction] Serviço possui agendamentos")
      return ActionResponse.fail({
        error: "SERVICE_HAS_BOOKINGS",
        message:
          "Não é possível excluir: este serviço possui agendamentos vinculados.",
        statusCode: 400,
      })
    }

    service = await barbershopServiceRepo.delete(serviceId)
  } catch (error) {
    console.error("[deleteServiceAction]", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao remover serviço",
      statusCode: 500,
    })
  }

  if (!service) {
    console.error("[deleteServiceAction] Serviço não encontrado")
    notFound()
  }

  revalidatePath("/admin/barbershops/*/services")

  return ActionResponse.success({
    message: "Serviço removido com sucesso",
    statusCode: 200,
    data: null,
  })
}
