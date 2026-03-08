"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/src/app/_lib/auth.lib"
import { ActionResponse } from "@/src/app/_common/http/response/action.response"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { bookingRepo } from "@/src/repositories/booking.repository"

export async function getAdminDashboardAction() {
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

    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())

    const startOfLastWeek = new Date(startOfWeek)
    startOfLastWeek.setDate(startOfWeek.getDate() - 7)

    const [
      todayBookings,
      totalBookings,
      bookingsThisWeek,
      bookingsLastWeek,
      revenueToday,
      revenueYesterday,
      last7Days,
    ] = await Promise.all([
      bookingRepo.findByDateAndBarbershop(barbershopIds, new Date()),
      bookingRepo.countByBarbershop(barbershopIds),
      bookingRepo.countByBarbershop(barbershopIds, startOfWeek),
      bookingRepo.countByBarbershop(barbershopIds, startOfLastWeek, startOfWeek),
      bookingRepo.getRevenue(barbershopIds, today, tomorrow),
      bookingRepo.getRevenue(barbershopIds, yesterday, today),
      Promise.all(
        Array.from({ length: 7 }, (_, i) => {
          const day = new Date(today)
          day.setDate(today.getDate() - (6 - i))
          const nextDay = new Date(day)
          nextDay.setDate(day.getDate() + 1)
          return bookingRepo.getRevenue(barbershopIds, day, nextDay)
        }),
      ),
    ])

    const weekChange =
      bookingsLastWeek > 0
        ? Math.round(((bookingsThisWeek - bookingsLastWeek) / bookingsLastWeek) * 100)
        : 0

    const revenueChange =
      revenueYesterday > 0
        ? Math.round(((revenueToday - revenueYesterday) / revenueYesterday) * 100)
        : 0

    return ActionResponse.success({
      message: "Dashboard carregado com sucesso",
      statusCode: 200,
      data: {
        barbershops: barbershops.map((b) => ({ id: b.id, name: b.name })),
        stats: {
          totalBookings,
          bookingsThisWeek,
          weekChange,
          revenueToday,
          revenueYesterday,
          revenueChange,
        },
        todayBookings,
        last7Days,
      },
    })
  } catch (error) {
    console.error("[getAdminDashboardAction]", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao carregar dashboard",
      statusCode: 500,
    })
  }
}