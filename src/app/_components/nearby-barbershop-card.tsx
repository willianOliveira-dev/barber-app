"use client"

import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { NavigationIcon, PhoneIcon } from "lucide-react"
import { distanceFormat } from "../_utils/distance.util"
import type { NearbyBarbershop } from "@/src/db/types"
import Image from "next/image"
import Link from "next/link"

interface NearbyBarbershopCardProps {
  barbershop: NearbyBarbershop
  isSelected?: boolean
  onClick?: (barbershop: NearbyBarbershop) => void
}

export function NearbyBarbershopCard({
  barbershop,
  isSelected = false,
  onClick,
}: NearbyBarbershopCardProps) {
  const { name, address, city, state, zipCode, phone, image, distance } =
    barbershop

  return (
    <Card
      onClick={() => onClick?.(barbershop)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.(barbershop)}
      aria-pressed={isSelected}
      className={`group border-border bg-card w-full overflow-hidden border pt-0 transition-colors ${
        isSelected ? "border-primary/40" : "hover:border-primary/20"
      }`}
    >
      <CardHeader className="relative h-37.5 w-full p-0">
        {image ? (
          <Image
            quality={75}
            alt={name}
            src={image}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        <Badge
          className="absolute top-2 left-2 flex items-center gap-1 border border-white/10 bg-black/50 px-2 py-0.5 backdrop-blur-sm"
          variant="secondary"
        >
          <NavigationIcon className="fill-primary text-primary h-3 w-3" />
          <span className="text-xs font-semibold text-white">
            {distanceFormat.formatDistance(distance)}
          </span>
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 p-3">
        <h2 className="text-foreground truncate text-sm font-semibold">
          {name}
        </h2>
        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
          {address}, {city}, {state}
          {zipCode ? ` — ${zipCode}` : ""}
        </p>
        {phone && (
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <PhoneIcon className="h-3 w-3 shrink-0" />
            {phone}
          </p>
        )}
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="hover:border-primary/30 hover:text-primary mt-1 w-full rounded-lg text-xs"
        >
          <Link href={`/barbershops/${barbershop.slug}`}>Reservar</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
