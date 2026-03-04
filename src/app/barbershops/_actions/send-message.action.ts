"use server"

import { conversationRepo } from "@/src/repositories/conversation.repository"
import { ActionResponse } from "../../_common/http/response/action.response"
import { messageRepo } from "@/src/repositories/message.repository"
import { emitToRoom } from "../../_lib/socket"
import { runBarbershopBot } from "../../_lib/barbershop-bot.lib"

interface SendMessageParams {
  conversationId: string
  content: string
  senderUserId: string
}

export async function sendMessageAction({
  conversationId,
  content,
  senderUserId,
}: SendMessageParams) {
  try {
    const conv = await conversationRepo.findById(conversationId)
    if (!conv) {
      return ActionResponse.fail({
        error: "NOT_FOUND",
        message: "Conversa não encontrada",
        statusCode: 404,
      })
    }

    const userMessage = await messageRepo.create({
      conversationId,
      content,
      senderUserId,
      senderType: "user",
    })

    await conversationRepo.incrementUnread(conversationId, "barbershop")

    emitToRoom(conversationId, "new_message", {
      ...userMessage,
      senderType: "user",
    })

    emitToRoom(`barbershop:${conv.barbershopId}`, "conversation_updated", {
      conversationId,
      lastMessage: content,
      updatedAt: new Date(),
    })

    if (!conv.botEnabled) {
      return ActionResponse.success({
        message: "Mensagem enviada",
        statusCode: 200,
        data: null,
      })
    }

    const history = conv.messages.map((m) => ({
      role: m.senderType === "user" ? "user" : ("assistant" as "user" | "assistant"),
      content: m.content,
    }))

    const { reply, requiresHuman } = await runBarbershopBot({
      userMessage: content,
      barbershopId: conv.barbershopId,
      conversationHistory: history,
    })

    const botMessage = await messageRepo.create({
      conversationId,
      content: reply,
      senderType: "bot",
    })

    await conversationRepo.incrementUnread(conversationId, "user")

    // CORREÇÃO: typo "new_messsage" → "new_message"
    emitToRoom(conversationId, "new_message", {
      ...botMessage,
      senderType: "bot",
    })

    if (requiresHuman) {
      await conversationRepo.update(conversationId, {
        status: "human_required",
      })

      emitToRoom(`barbershop:${conv.barbershopId}`, "human_required", {
        conversationId,
        userId: conv.userId,
        userName: conv.user.name,
      })
    }

    return ActionResponse.success({
      message: "Mensagem enviada",
      statusCode: 200,
      data: null,
    })
  } catch (error) {
    console.error("[sendMessageAction] ", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao enviar mensagem",
      statusCode: 500,
    })
  }
}