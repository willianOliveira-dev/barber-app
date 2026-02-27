"use server"

import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { notFound } from "next/navigation"
import { ActionResponse } from "../../_common/http/response/action.response"
import { BarbershopDetails } from "@/src/db/types"

export async function getBarbershopBySlug(slug: string) {
  let barbershop: BarbershopDetails | null

  try {
    barbershop = await barbershopRepo.findBySlug(slug)
  } catch (error) {
    console.error("[getBarbershopBySlug] Error: ", error)
    notFound()
  }

  if (!barbershop || !barbershop.isActive) {
    notFound()
  }

  return ActionResponse.success({
    message: "Barbearia encontrada com sucesso",
    statusCode: 200,
    data: barbershop,
  })
}
