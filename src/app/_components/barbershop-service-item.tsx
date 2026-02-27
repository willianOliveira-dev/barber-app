"use client"
import { Card, CardContent, CardHeader } from "./ui/card"
import { BookingSheet } from "./booking-sheet"
import { BarbershopService } from "@/src/db/types"
import { priceFormatter } from "../_utils/price-formatter.util"
import { useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { LogIn } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BarbershopServicesItemProps {
  service: BarbershopService
  barbershopSlug: string
  barbershopName: string
  barbershopIsOpen: boolean
}

export function BarbershopServiceItem({
  service,
  barbershopSlug,
  barbershopName,
  barbershopIsOpen,
}: BarbershopServicesItemProps) {
  const { status } = useSession()

  return (
    <Card className="border-border bg-card hover:border-primary/20 flex cursor-pointer flex-row items-center gap-4 overflow-hidden border p-4 transition-colors">
      <CardHeader className="relative size-22 shrink-0 overflow-hidden rounded-xl p-0">
        {service.image ? (
          <Image
            quality={75}
            alt={service.name}
            src={service.image}
            className="object-cover"
            loading="eager"
            fill
          />
        ) : (
          <Image
            src="/default.png"
            alt="Sem imagem"
            fill
            className="object-cover"
            loading="eager"
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
            {priceFormatter.formatToPrice(service.priceInCents)}
          </span>

          <div className="flex w-full shrink-0 flex-col items-stretch gap-3">
            {status === "unauthenticated" ? (
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="gap-1.5 rounded-lg"
              >
                <Link href="/login">
                  <LogIn className="h-3.5 w-3.5" />
                  Entre para reservar
                </Link>
              </Button>
            ) : (
              <BookingSheet
                barbershopIsOpen={barbershopIsOpen}
                barbershopName={barbershopName}
                service={service}
              />
            )}
            <Button asChild size="sm" className="gap-1.5 rounded-lg">
              <Link
                href={`/barbershops/${barbershopSlug}/services/${service.slug}`}
              >
                Ver detalhes
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
