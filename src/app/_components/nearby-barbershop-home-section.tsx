"use client"

import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import { getNearbyBarbershops } from "../barbershops/_actions/get-nearby-barbershops"
import { NearbyBarbershopCard } from "./nearby-barbershop-card"
import type { NearbyBarbershop } from "@/src/db/types"

export function NearbyBarbershopsHomeSection() {
  const [barbershops, setBarbershops] = useState<NearbyBarbershop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [denied, setDenied] = useState(false)

  useEffect(() => {
    if (!navigator?.geolocation) {
      setIsLoading(false)
      setDenied(true)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const result = await getNearbyBarbershops(latitude, longitude)
        if (result.success && "data" in result) setBarbershops(result.data)
        setIsLoading(false)
      },
      () => {
        setIsLoading(false)
        setDenied(true)
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    )
  }, [])

  if (denied) return null
  if (!isLoading && barbershops.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <MapPin className="text-primary h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase">
              Perto de <span className="text-primary">Você</span>
            </h3>
            <p className="text-muted-foreground text-xs">
              Barbearias na sua região
            </p>
          </div>
        </div>
      </div>

      <div className="scroll-container scroll-snap scroll-fade -mx-5 flex gap-4 overflow-x-auto px-5 pb-4 lg:hidden">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="scroll-item border-border bg-card h-95 w-[calc(100vw-2.5rem)] shrink-0 animate-pulse rounded-2xl border"
              />
            ))
          : barbershops.slice(0, 4).map((barbershop) => (
              <div
                key={barbershop.id}
                className="scroll-item w-[calc(100vw-2.5rem)] shrink-0"
              >
                <NearbyBarbershopCard barbershop={barbershop} />
              </div>
            ))}
      </div>

      <div className="hidden gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border-border bg-card h-95 animate-pulse rounded-2xl border"
              />
            ))
          : barbershops
              .slice(0, 4)
              .map((barbershop) => (
                <NearbyBarbershopCard
                  key={barbershop.id}
                  barbershop={barbershop}
                />
              ))}
      </div>
    </section>
  )
}
