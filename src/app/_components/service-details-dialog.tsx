"use client"

import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Clock, LogIn, Star, Tag } from "lucide-react"

import { Dialog, DialogContent, DialogTitle } from "./ui/dialog"
import { Button } from "@/src/app/_components/ui/button"
import { Badge } from "@/src/app/_components/ui/badge"
import { BookingSheet } from "@/src/app/_components/booking-sheet"
import { BarbershopService } from "@/src/db/types"
import { priceFormat } from "../_utils/price-format.util"

interface ServiceDetailsDialogProps {
  service: BarbershopService
  barbershopName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ServiceDetailsDialog({
  service,
  barbershopName,
  open,
  onOpenChange,
}: ServiceDetailsDialogProps) {
  const { status } = useSession()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card gap-0 overflow-hidden rounded-2xl border p-0 sm:max-w-md">
        <DialogTitle className="sr-only">{service.name}</DialogTitle>

        <div className="relative h-50 w-full overflow-hidden sm:h-55">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.name}
              fill
              quality={85}
              className="object-cover"
            />
          ) : (
            <Image
              src="/default.png"
              alt="Sem imagem"
              fill
              className="object-cover"
            />
          )}

          <div className="from-card via-card/20 absolute inset-0 bg-linear-to-t to-transparent" />

          <div className="absolute bottom-3 left-4">
            <Badge
              variant="secondary"
              className="border-border flex items-center gap-1.5 border px-2.5 py-1 text-xs font-semibold"
            >
              <Star className="fill-primary text-primary h-3 w-3" />
              Serviço Premium
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-5 pb-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-foreground text-xl leading-tight font-bold">
              {service.name}
            </h2>
            <span className="text-primary shrink-0 text-xl font-bold">
              {priceFormat.formatToPrice(service.priceInCents)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="border-border bg-background/50 text-muted-foreground flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs">
              <Tag className="text-primary h-3 w-3" />
              {barbershopName}
            </div>
            {service.durationMinutes && (
              <div className="border-border bg-background/50 text-muted-foreground flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs">
                <Clock className="text-primary h-3 w-3" />
                {service.durationMinutes} min
              </div>
            )}
          </div>

          <div className="bg-border h-px w-full" />

          <div className="space-y-1.5">
            <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.16em] uppercase">
              Descrição
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {service.description ?? "Sem descrição disponível."}
            </p>
          </div>

          {status === "unauthenticated" ? (
            <Button asChild className="w-full gap-2 rounded-xl">
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                Entre para reservar
              </Link>
            </Button>
          ) : (
            <BookingSheet barbershopName={barbershopName} service={service} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
