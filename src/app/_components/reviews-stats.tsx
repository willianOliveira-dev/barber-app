"use client"

import { useEffect, useState } from "react"
import { getReviewStatsAction } from "../barbershops/_actions/get-review-stats.action"
import { RatingStar } from "./rating-star"
import { GetStatsByBarbershop, ReviewRating } from "@/src/db/types/review.type"
import { RiStarSmileFill } from "react-icons/ri"
import { Progress } from "./ui/progress"

interface ReviewStatsProps {
  barbershopId: string
}

export function ReviewStats({ barbershopId }: ReviewStatsProps) {
  const [stats, setStats] = useState<GetStatsByBarbershop | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const result = await getReviewStatsAction(barbershopId)
      if (result.success) setStats(result.data)
      setIsLoading(false)
    }
    loadStats()
  }, [barbershopId])

  if (isLoading) {
    return (
      <div className="border-border bg-card flex items-center gap-3 rounded-2xl border p-5">
        <div className="bg-border h-12 w-12 animate-pulse rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="bg-border h-3 w-24 animate-pulse rounded-full" />
          <div className="bg-border h-3 w-16 animate-pulse rounded-full" />
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border">
      <div className="border-border border-b px-5 py-4">
        <h3 className="text-sm font-semibold tracking-wide uppercase">
          Avalia<span className="text-primary">ções</span>
        </h3>
      </div>

      <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center">
        <div className="flex flex-col items-center justify-center gap-2 sm:w-36 sm:shrink-0">
          <p className="text-foreground text-6xl leading-none font-bold">
            {stats.averageRating.toFixed(1)}
          </p>
          <RatingStar rating={stats.averageRating} size="lg" />
          <p className="text-muted-foreground text-xs">
            {stats.totalReviews} avaliações
          </p>
        </div>

        <div className="bg-border hidden h-24 w-px sm:block" />

        <div className="flex flex-1 flex-col gap-2.5">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution[rating as ReviewRating] || 0
            const percentage =
              stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0

            return (
              <div
                key={rating}
                className="flex w-1/2 items-center gap-3 sm:w-full"
              >
                <div className="flex w-10 shrink-0 items-center justify-end gap-1">
                  <span className="text-foreground text-xs font-medium">
                    {rating}
                  </span>
                  <RiStarSmileFill size={16} className="text-primary" />
                </div>

                <Progress value={percentage} />

                <span className="text-muted-foreground w-8 shrink-0 text-right text-xs">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
