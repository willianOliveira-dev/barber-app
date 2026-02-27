"use server"

import { ActionResponse } from "@/src/app/_common/http/response/action.response"
import { authOptions } from "@/src/app/_lib/auth.lib"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { type Barbershop } from "@/src/db/types"

export async function deleteBarbershopAction(barbershopId: string) {
  let barbershop: Barbershop | null
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      console.error("[deleteBarbershopAction] Usuário não autenticado")
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    if (session.user.role !== "barber") {
      console.error("[deleteBarbershopAction] Usuário não é barbeiro")
      return ActionResponse.fail({
        error: "USER_FORBIDDEN",
        message: "Você não tem permissão para deletar uma barbearia",
        statusCode: 403,
      })
    }

    const hasBooking = await barbershopRepo.hasBooking(barbershopId)

    if (hasBooking) {
      console.error("[deleteBarbershopAction] Barbearia possui agendamentos")
      return ActionResponse.fail({
        error: "SERVICE_HAS_BOOKINGS",
        message:
          "Não é possível excluir: esta barbearia possui agendamentos vinculados.",
        statusCode: 400,
      })
    }

    barbershop = await barbershopRepo.delete(barbershopId)
  } catch (error) {
    console.error("[deleteBarbershopAction]", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao remover serviço",
      statusCode: 500,
    })
  }

  if (!barbershop) {
    console.error("[deleteBarbershopAction] Barbearia não encontrada")
    notFound()
  }
  revalidatePath("/")
  revalidatePath("/barbershops")
  revalidatePath("/admin/dashboard/barbershops")

  return ActionResponse.success({
    message: "Barbearia removido com sucesso",
    statusCode: 204,
    data: null,
  })
}
