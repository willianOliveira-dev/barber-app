"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../../_lib/auth.lib"
import { ActionResponse } from "../../_common/http/response/action.response"
import { conversationRepo } from "@/src/repositories/conversation.repository"

interface StartConversationParams {
  userId: string
  barbershopId: string
}

export async function startConversationAction({
  userId,
  barbershopId,
}: StartConversationParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      console.error("[CreateReviewAction] Error: Usuário não autenticado")
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICADED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    const existingConversation = await conversationRepo.findByUserAndBarbershop(
      userId,
      barbershopId,
    )

    if (!existingConversation) {
      await conversationRepo.create({
        userId,
        barbershopId,
        status: "bot_handling",
        botEnabled: true,
      })
    }

    const conv = await conversationRepo.findByUserAndBarbershop(
      userId,
      barbershopId,
    )

    return ActionResponse.success({
      message: existingConversation
        ? "Conversa já iniciada"
        : "Conversa iniciada com sucesso",
      statusCode: existingConversation ? 200 : 201,
      data: conv,
    })
  } catch (error) {
    console.error("[startConversationAction]", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao iniciar conversa",
      statusCode: 500,
    })
  }
}
