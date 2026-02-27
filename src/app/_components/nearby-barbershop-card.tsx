"use client"

import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Navigation, Phone, MapPin, ArrowRight, Route } from "lucide-react"
import { distanceFormat } from "../_utils/distance-formatter.util"
import type { NearbyBarbershop } from "@/src/db/types"
import Image from "next/image"
import Link from "next/link"

interface NearbyBarbershopCardProps {
  barbershop: NearbyBarbershop
}

export function NearbyBarbershopCard({
  barbershop,
}: NearbyBarbershopCardProps) {
  const { name, phone, image, distance, slug } = barbershop

  return (
    <Card
      role="button"
      tabIndex={0}
      className="group hover:shadow-primary/15 relative h-95 w-full overflow-hidden rounded-2xl border-0 shadow-lg transition-all duration-500 hover:shadow-2xl"
    >
      <div className="absolute inset-0 h-full w-full">
        <Image
          quality={85}
          alt={name}
          src={image || "/images/default.png"}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          fill
        />

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent opacity-95" />
      </div>

      <Badge
        className="bg-primary/95 absolute top-4 left-4 z-10 flex items-center gap-1.5 border-0 px-3 py-1.5 shadow-lg backdrop-blur-md"
        variant="secondary"
      >
        <Route className="text-primary-foreground h-3.5 w-3.5" />
        <span className="text-primary-foreground text-sm font-bold">
          {distanceFormat.formatDistance(distance)}
        </span>
        <span className="text-primary-foreground/80 text-xs">de você</span>
      </Badge>

      <div className="absolute top-4 right-4 z-10 rounded-xl bg-white/95 p-2 shadow-lg backdrop-blur-md">
        <Navigation className="text-primary h-5 w-5" />
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-10 flex flex-col gap-4 p-5">
        <h2 className="group-hover:text-primary/90 text-xl leading-tight font-bold text-white drop-shadow-lg transition-colors">
          {name}
        </h2>

        <div className="space-y-2">
          <div className="flex items-start gap-2 text-gray-300">
            <MapPin className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-sm leading-relaxed">
              {`${barbershop.address}${barbershop.streetNumber ? `, ${barbershop.streetNumber}` : ""}`}
              {barbershop.neighborhood && ` - ${barbershop.neighborhood}`}
              {barbershop.complement && ` (${barbershop.complement})`}
              <br />
              {`${barbershop.city} - ${barbershop.state}`}
            </p>
          </div>

          {phone && (
            <div className="flex items-center gap-2 text-gray-300">
              <Phone className="text-primary h-4 w-4 shrink-0" />
              <p className="text-sm">{phone}</p>
            </div>
          )}
        </div>

        <Button
          asChild
          variant="default"
          size="lg"
          className="group/btn bg-primary hover:bg-primary/90 hover:shadow-primary/30 h-12 w-full rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <Link
            href={`/barbershops/${slug}`}
            className="flex items-center justify-center gap-2"
          >
            <Navigation className="h-5 w-5" />
            <span>Ver no Mapa</span>
            <ArrowRight className="h-5 w-5 -translate-x-2 opacity-0 transition-all duration-300 group-hover/btn:translate-x-0 group-hover/btn:opacity-100" />
          </Link>
        </Button>
      </div>

      <div className="from-primary via-primary/60 absolute right-0 bottom-0 left-0 h-1 origin-left scale-x-0 bg-linear-to-r to-transparent transition-transform duration-500 group-hover:scale-x-100" />
    </Card>
  )
}
