"use client"

import Image from "next/image"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import {
  Flame,
  Award,
  MapPin,
  ArrowRight,
  Star,
  CalendarCheck,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { BarbershopSummary, PopularBarbershop } from "@/src/db/types"

interface FeaturedBarbershopCardProps {
  barbershop: PopularBarbershop | BarbershopSummary
  variant?: "popular" | "recommended"
}

export function FeaturedBarbershopCard({
  barbershop,
  variant = "recommended",
}: FeaturedBarbershopCardProps) {
  const isPopular = variant === "popular" && "totalBookings" in barbershop

  return (
    <Card className="group bg-card hover:shadow-primary/15 relative h-100 w-full overflow-hidden rounded-2xl border-0 shadow-lg transition-all duration-500 hover:shadow-2xl">
      <div className="absolute inset-0 h-full w-full">
        <Image
          src={barbershop.image || "/images/default.png"}
          alt={barbershop.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          quality={90}
        />

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent opacity-90" />
      </div>

      <div className="absolute top-4 right-4 z-10">
        {isPopular ? (
          <Badge className="border-0 bg-orange-500/90 text-white shadow-lg backdrop-blur-md hover:bg-orange-600">
            <Flame className="mr-1 h-3 w-3 fill-white" />
            <span className="font-bold">Em Alta</span>
          </Badge>
        ) : (
          <Badge className="border-0 bg-yellow-500/90 text-black shadow-lg backdrop-blur-md hover:bg-yellow-400">
            <Award className="mr-1 h-3 w-3 fill-black" />
            <span className="font-bold">Top Escolha</span>
          </Badge>
        )}
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-10 flex translate-y-2 flex-col gap-4 p-6 transition-transform duration-300 group-hover:translate-y-0">
        <div className="space-y-2">
          <h2 className="text-2xl leading-tight font-bold text-white drop-shadow-md">
            {barbershop.name}
          </h2>
          <div className="flex items-center gap-1.5 text-sm text-gray-300">
            <MapPin className="text-primary h-3.5 w-3.5" />
            <span className="line-clamp-1">
              {barbershop.address}, {barbershop.city}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 p-3 backdrop-blur-md">
          {isPopular ? (
            <>
              <div className="rounded-full bg-orange-500/20 p-2">
                <CalendarCheck className="h-5 w-5 text-orange-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase">
                  Agendamentos
                </span>
                <span className="text-lg font-bold text-white">
                  {barbershop.totalBookings}+
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-full bg-yellow-500/20 p-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase">
                  Avaliação
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-white">
                    {barbershop.averageRating?.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-400">
                    ({barbershop.totalReviews} opiniões)
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

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
