"use client"

import { useState } from "react"
import { Loader2, AlertCircle, MessageSquare } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/src/app/_components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { useReviews } from "../barbershops/_hooks/use-reviews.hook"
import { ReviewRating, ReviewSortBy } from "@/src/db/types/review.type"
import { ReviewCard } from "./review-card"
import { RiStarSmileFill } from "react-icons/ri"

interface ReviewListProps {
  barbershopId: string
}

type ReviewRatingProps = "1" | "2" | "3" | "4" | "5"

const ratingTabs: {
  value: ReviewRatingProps | "all"
  label: React.ReactNode
}[] = [
  { value: "all", label: "Todas" },
  {
    value: "5",
    label: (
      <span className="flex items-center gap-1">
        5
        <RiStarSmileFill
          className={
            "text-primary inline-block h-2 w-2 rotate-45 rounded-[2px]"
          }
        />
      </span>
    ),
  },
  {
    value: "4",
    label: (
      <span className="flex items-center gap-1">
        4{" "}
        <RiStarSmileFill
          className={
            "text-primary/90 inline-block h-2 w-2 rotate-45 rounded-[2px]"
          }
        />
      </span>
    ),
  },
  {
    value: "3",
    label: (
      <span className="flex items-center gap-1">
        3{" "}
        <RiStarSmileFill
          className={
            "text-primary/70 inline-block h-2 w-2 rotate-45 rounded-[2px]"
          }
        />
      </span>
    ),
  },
  {
    value: "2",
    label: (
      <span className="flex items-center gap-1">
        2{" "}
        <RiStarSmileFill
          className={
            "text-primary/50 inline-block h-2 w-2 rotate-45 rounded-[2px]"
          }
        />
      </span>
    ),
  },
  {
    value: "1",
    label: (
      <span className="flex items-center gap-1">
        1{" "}
        <RiStarSmileFill
          className={
            "text-primary/30 inline-block h-2 w-2 rotate-45 rounded-[2px]"
          }
        />
      </span>
    ),
  },
]

export function ReviewList({ barbershopId }: ReviewListProps) {
  const [selectedRating, setSelectedRating] = useState<
    ReviewRatingProps | "all"
  >("all")
  const [sortBy, setSortBy] = useState<ReviewSortBy>("recent")

  const reviews = useReviews({
    barbershopId,
    rating:
      selectedRating === "all"
        ? undefined
        : (Number(selectedRating) as ReviewRating),
    sortBy,
  })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={selectedRating}
          onValueChange={(v) =>
            setSelectedRating(v as ReviewRatingProps | "all")
          }
        >
          <TabsList className="border-border bg-card no-scrollbar flex w-full justify-start overflow-x-auto rounded-xl border p-1">
            {ratingTabs.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="data-[state=active]:bg-primary shrink-0 ..."
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as ReviewSortBy)}
        >
          <SelectTrigger className="border-border h-9 w-44 rounded-xl text-xs">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent className="border-border bg-card rounded-xl">
            <SelectItem value="recent" className="text-xs">
              Mais recentes
            </SelectItem>
            <SelectItem value="oldest" className="text-xs">
              Mais antigas
            </SelectItem>
            <SelectItem value="highest" className="text-xs">
              Maior nota
            </SelectItem>
            <SelectItem value="lowest" className="text-xs">
              Menor nota
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {reviews.error && (
        <div className="border-destructive/20 bg-destructive/5 flex items-center gap-3 rounded-2xl border px-4 py-3">
          <AlertCircle className="text-destructive h-4 w-4 shrink-0" />
          <p className="text-destructive text-xs">{reviews.error}</p>
        </div>
      )}

      {reviews.data.length === 0 && !reviews.isLoading && (
        <div className="border-border bg-card flex flex-col items-center gap-3 rounded-2xl border py-12 text-center">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
            <MessageSquare className="text-primary h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-foreground text-sm font-semibold">
              Nenhuma avaliação encontrada
            </p>
            <p className="text-muted-foreground text-xs">
              {selectedRating !== "all"
                ? "Tente filtrar por outra nota."
                : "Esta barbearia ainda não tem avaliações."}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {reviews.isLoading && reviews.data.length === 0
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border-border bg-card h-28 animate-pulse rounded-2xl border"
              />
            ))
          : reviews.data.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onUpdate={reviews.refresh}
              />
            ))}
      </div>

      {reviews.hasMore && (
        <button
          onClick={reviews.loadMore}
          disabled={reviews.isLoading}
          className="border-border text-muted-foreground hover:border-primary/30 hover:text-primary flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs font-medium transition-colors disabled:opacity-50"
        >
          {reviews.isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Carregando...
            </>
          ) : (
            "Carregar mais avaliações"
          )}
        </button>
      )}
    </div>
  )
}
