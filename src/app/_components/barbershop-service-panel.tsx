"use client"

import Link from "next/link"
import { LogIn, CalendarCheck, Clock, Tag } from "lucide-react"
import { Button } from "@/src/app/_components/ui/button"
import { BookingSheet } from "@/src/app/_components/booking-sheet"
import { BarbershopService } from "@/src/db/types"
import { priceFormat } from "@/src/app/_utils/price-format.util"
import { formatDuration } from "../_utils/format-duration.util"

interface ServiceBookingPanelProps {
  service: BarbershopService
  barbershopName: string
  isAuthenticated: boolean
}

export function ServiceBookingPanel({
  service,
  barbershopName,
  isAuthenticated,
}: ServiceBookingPanelProps) {
  const durationLabel = formatDuration(service.durationMinutes)

  return (
    <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
          <CalendarCheck className="text-primary h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-wide uppercase">
            Agendar <span className="text-primary">serviço</span>
          </h3>
          <p className="text-muted-foreground text-xs">Escolha seu horário</p>
        </div>
      </div>

      <div className="bg-border h-px" />

      <div className="border-primary/20 bg-primary/5 flex items-center justify-between rounded-xl border px-4 py-3">
        <span className="text-muted-foreground text-xs">Valor do serviço</span>
        <span className="text-primary text-xl font-bold">
          {priceFormat.formatToPrice(service.priceInCents)}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="border-border bg-background/50 flex items-center gap-2 rounded-lg border px-3 py-2.5">
          <Tag className="text-primary h-3.5 w-3.5 shrink-0" />
          <div className="flex flex-1 items-center justify-between gap-2">
            <span className="text-muted-foreground text-xs">Barbearia</span>
            <span className="text-foreground max-w-75 truncate text-xs font-medium">
              {barbershopName}
            </span>
          </div>
        </div>
        <div className="border-border bg-background/50 flex items-center gap-2 rounded-lg border px-3 py-2.5">
          <Clock className="text-primary h-3.5 w-3.5 shrink-0" />
          <div className="flex flex-1 items-center justify-between gap-2">
            <span className="text-muted-foreground text-xs">Duração</span>
            <span className="text-foreground text-xs font-medium">
              {durationLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-border h-px" />

      {isAuthenticated ? (
        <BookingSheet barbershopName={barbershopName} service={service} />
      ) : (
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full gap-2 rounded-xl">
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              Entre para reservar
            </Link>
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            Faça login para agendar este serviço
          </p>
        </div>
      )}
    </div>
  )
}
