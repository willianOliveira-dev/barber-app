"use server"

import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { ActionResponse } from "../../_common/http/response/action.response"

function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    isFinite(lat) &&
    isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  )
}

export async function getNearbyBarbershops(
  lat: number,
  lng: number,
  radiusKm = 100,
) {
  if (!isValidCoordinate(lat, lng)) {
    return ActionResponse.fail({
      error: "INVALID_COORDINATES",
      message: "Coordenadas inválidas",
      statusCode: 400,
    })
  }
  try {
    const barbershops = await barbershopRepo.findNearbyBarbershops(
      lat,
      lng,
      radiusKm,
    )
    return ActionResponse.success({
      data: barbershops,
      message: "Operação realizada com sucesso",
      statusCode: 200,
    })
  } catch (err) {
    console.error("[getNearbyBarbershops] Error:", err)
    return ActionResponse.fail({
      error: "INTERNAL_SERVER_ERROR",
      message: "Erro interno do servidor",
      statusCode: 500,
    })
  }
}
