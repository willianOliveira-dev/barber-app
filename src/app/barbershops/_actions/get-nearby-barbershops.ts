"use server"
import type { NearbyBarbershop } from "@/src/db/types"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"

interface ActionResult {
  data: NearbyBarbershop[] | null
  error: string | null
}

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
): Promise<ActionResult> {
  if (!isValidCoordinate(lat, lng)) {
    return { data: null, error: "Invalid coordinates provided." }
  }

  try {
    const barbershops = await barbershopRepo.findNearbyBarbershops(
      lat,
      lng,
      radiusKm,
    )
    console.log("Resultado do Banco:", barbershops.length, "itens encontrados")
    return { data: barbershops, error: null }
  } catch (err) {
    console.error("[getNearbyBarbershops] Error:", err)
    return {
      data: null,
      error: "Failed to fetch nearby barbershops. Please try again.",
    }
  }
}
