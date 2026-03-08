"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/src/app/_lib/auth.lib"
import { ActionResponse } from "@/src/app/_common/http/response/action.response"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { bookingRepo } from "@/src/repositories/booking.repository"
import { reviewRepo } from "@/src/repositories/review.repository"

export async function getAdminReportsAction() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    const { barbershops } = await barbershopRepo.findBarbershopsByOwner(session.user.id, 1, 50)
    const barbershopIds = barbershops.map((b) => b.id)

    if (barbershopIds.length === 0) {
      return ActionResponse.fail({
        error: "NOT_FOUND",
        message: "Nenhuma barbearia encontrada",
        statusCode: 404,
      })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59)

    const [
      totalClients,
      cancellationRate,
      revenueThisMonth,
      revenueLastMonth,
      topServices,
      bookingsByDay,
      revenueByMonth,
      reviewStats,
      totalBookings,
    ] = await Promise.all([
      bookingRepo.countUniqueClients(barbershopIds),
      bookingRepo.getCancellationRate(barbershopIds),
      bookingRepo.getRevenue(barbershopIds, startOfMonth),
      bookingRepo.getRevenue(barbershopIds, startOfLastMonth, endOfLastMonth),
      bookingRepo.getTopServices(barbershopIds),
      bookingRepo.getBookingsByDayOfWeek(barbershopIds),
      bookingRepo.getRevenueByMonth(barbershopIds, 6),
      reviewRepo.getAverageRating(barbershopIds),
      bookingRepo.countByBarbershop(barbershopIds),
    ])

    const revenueGrowth =
      revenueLastMonth > 0
        ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)
        : 0

    const cancellationRatePct =
      cancellationRate.total > 0
        ? Math.round((cancellationRate.cancelled / cancellationRate.total) * 100)
        : 0

    const responseRate =
      reviewStats.total > 0
        ? Math.round((reviewStats.responded / reviewStats.total) * 100)
        : 0

    return ActionResponse.success({
      message: "Relatórios carregados com sucesso",
      statusCode: 200,
      data: {
        barbershops: barbershops.map((b) => ({ id: b.id, name: b.name })),
        overview: {
          totalClients,
          totalBookings,
          revenueThisMonth,
          revenueLastMonth,
          revenueGrowth,
          cancellationRatePct,
          averageRating: reviewStats.average ?? 0,
          totalReviews: reviewStats.total,
          responseRate,
        },
        topServices,
        bookingsByDay,
        revenueByMonth,
      },
    })
  } catch (error) {
    console.error("[getAdminReportsAction]", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao carregar relatórios",
      statusCode: 500,
    })
  }
}