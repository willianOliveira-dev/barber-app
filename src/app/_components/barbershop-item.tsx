"use client"

import Image from "next/image"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Star, MapPin, Calendar, ArrowRight, Scissors } from "lucide-react"
import Link from "next/link"

interface BarbershopItemProps {
  barbershop: any
}

export function BarbershopItem({ barbershop }: BarbershopItemProps) {
  return (
    <Card className="group bg-card hover:shadow-primary/15 relative h-100 w-full overflow-hidden rounded-2xl border-0 shadow-lg transition-all duration-500 hover:shadow-2xl">
      <div className="absolute inset-0 h-full w-full">
        <Image
          quality={85}
          alt={barbershop.name}
          src={barbershop.image || "/images/default.png"}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          fill
        />

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-95" />
      </div>

      <Badge
        className="absolute top-4 right-4 z-10 flex items-center gap-1.5 border-0 bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-md"
        variant="secondary"
      >
        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
        <span className="text-sm font-bold text-gray-900">
          {barbershop.averageRating?.toFixed(1) ?? "0.0"}
        </span>
        <span className="text-xs text-gray-500">
          ({barbershop.totalReviews ?? 0})
        </span>
      </Badge>

      <div className="bg-primary/90 absolute top-4 left-4 z-10 rounded-xl p-2 shadow-lg backdrop-blur-md">
        <Scissors className="text-primary-foreground h-5 w-5" />
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-10 flex flex-col gap-4 p-5">
        <div className="space-y-2">
          <h2 className="group-hover:text-primary/90 text-xl leading-tight font-bold text-white drop-shadow-lg transition-colors">
            {barbershop.name}
          </h2>

          {barbershop.address && (
            <div className="flex items-center gap-1.5 text-gray-300">
              <MapPin className="text-primary h-4 w-4 shrink-0" />
              <p className="line-clamp-1 text-sm">
                {barbershop.address}, {barbershop.city}
              </p>
            </div>
          )}
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">
          {barbershop.description}
        </p>

        <Button
          asChild
          variant="secondary"
          size="lg"
          className="group/btn hover:bg-primary/90 hover:shadow-primary/30 h-12 w-full rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <Link
            href={`/barbershops/${barbershop.slug}`}
            className="flex items-center justify-center gap-2"
          >
            <Calendar className="h-5 w-5" />
            <span>Reservar</span>
            <ArrowRight className="h-5 w-5 -translate-x-2 opacity-0 transition-all duration-300 group-hover/btn:translate-x-0 group-hover/btn:opacity-100" />
          </Link>
        </Button>
      </div>

      <div className="from-primary via-primary/60 absolute right-0 bottom-0 left-0 h-1 origin-left scale-x-0 bg-linear-to-r to-transparent transition-transform duration-500 group-hover:scale-x-100" />
    </Card>
  )
}
