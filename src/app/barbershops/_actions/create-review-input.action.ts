"use server"

import { ReviewRating } from "@/src/db/types/review.type"
import { getServerSession } from "next-auth"
import { authOptions } from "../../_lib/auth.lib"
import { ActionResponse } from "../../_common/http/response/action.response"
import { bookingRepo } from "@/src/repositories/booking.repository"
import { reviewRepo } from "@/src/repositories/review.repository"
import { revalidatePath } from "next/cache"

interface CreateReviewInput {
  bookingId: string
  rating: ReviewRating
  comment?: string
}

export async function createReviewAction(input: CreateReviewInput) {
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

    const booking = await bookingRepo.findById(input.bookingId)

    if (!booking) {
      console.error("[CreateReviewAction] Error: Agendamento não encontrado")
      return ActionResponse.fail({
        error: "BOOKING_NOT_FOUND",
        message: "Agendamento não encontrado",
        statusCode: 404,
      })
    }

    if (booking.userId !== session.user.id) {
      console.error("[CreateReviewAction] Error: Usuário não autorizado")
      return ActionResponse.fail({
        error: "USER_FORBIDDEN",
        message: "Usuário não autorizado",
        statusCode: 403,
      })
    }

    if (booking.status !== "completed") {
      console.error("[CreateReviewAction] Error: Agendamento não concluído")
      return ActionResponse.fail({
        error: "USER_BAD_REQUEST",
        message: "Você só pode avaliar agendamentos concluídos",
        statusCode: 400,
      })
    }

    const existingReview = await reviewRepo.findByBookingId(input.bookingId)

    if (existingReview) {
      console.error(
        "[CreateReviewAction] Error: Usuário já avaliou este agendamento",
      )
      return ActionResponse.fail({
        error: "REVIEW_BAD_REQUEST",
        message: "Você já avaliou este agendamento",
        statusCode: 400,
      })
    }

    const [review] = await reviewRepo.create({
      userId: session.user.id,
      barbershopId: booking.barbershopId,
      bookingId: input.bookingId,
      rating: input.rating,
      comment: input.comment || null,
    })

    revalidatePath(`/barbershops/${booking.barbershop.slug}`)
    revalidatePath("/bookings")

    return ActionResponse.success({
      data: review,
      message: "Avaliação criada com sucesso",
      statusCode: 201,
    })
  } catch (error) {
    console.error("[CreateReviewAction] Error:", error)
    return ActionResponse.fail({
      error: "INTERNAL_SERVER_ERROR",
      message: "Erro interno do servidor",
      statusCode: 500,
    })
  }
}
