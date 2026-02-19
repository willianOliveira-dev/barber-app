"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "./ui/card"
import { BookingSheet } from "./booking-sheet"
import { ServiceDetailsDialog } from "./service-details-dialog"
import { BarbershopService } from "@/src/db/types"
import Image from "next/image"
import { priceFormat } from "../_utils/price-format.util"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "./ui/button"
import { LogIn } from "lucide-react"

interface BarbershopServicesItemProps {
  service: BarbershopService
  barbershopName: string
}

export function BarbershopServiceItem({
  service,
  barbershopName,
}: BarbershopServicesItemProps) {
  const { status } = useSession()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Card
        className="border-border bg-card hover:border-primary/20 flex cursor-pointer flex-row items-center gap-4 overflow-hidden border p-4 transition-colors"
        onClick={() => setDialogOpen(true)}
      >
        <CardHeader className="relative size-22 shrink-0 overflow-hidden rounded-xl p-0">
          {service.image ? (
            <Image
              quality={75}
              alt={service.name}
              src={service.image}
              className="object-cover"
              fill
            />
          ) : (
            <Image
              src="/default.png"
              alt="Sem imagem"
              fill
              className="object-cover"
            />
          )}
        </CardHeader>

        <CardContent className="flex min-w-0 flex-1 flex-col gap-2 p-0">
          <div>
            <h2 className="text-foreground truncate text-sm font-semibold">
              {service.name}
            </h2>
            <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2">
            <span className="text-primary text-sm font-bold whitespace-nowrap">
              {priceFormat.formatToPrice(service.priceInCents)}
            </span>

            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
              {status === "unauthenticated" ? (
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 rounded-lg text-xs"
                >
                  <Link href="/login">
                    <LogIn className="h-3.5 w-3.5" />
                    Reservar
                  </Link>
                </Button>
              ) : (
                <BookingSheet
                  barbershopName={barbershopName}
                  service={service}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ServiceDetailsDialog
        service={service}
        barbershopName={barbershopName}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
