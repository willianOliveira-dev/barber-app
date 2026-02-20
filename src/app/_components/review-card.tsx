"use client"

import { useState } from "react"
import { unlikeReviewAction } from "../barbershops/_actions/unlike-review.action"
import { likeReviewAction } from "../barbershops/_actions/like-review.action"
import { toast } from "sonner"
import { ThumbsUp, Scissors, MessageSquareQuote } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { cn } from "../_lib/utils.lib"
import { RatingStar } from "./rating-star"
import { type ReviewWithRelations } from "@/src/db/types/review.type"
import { RiStarSmileFill } from "react-icons/ri"

interface ReviewCardProps {
  review: ReviewWithRelations
  onUpdate: () => void
}

export function ReviewCard({ review, onUpdate }: ReviewCardProps) {
  const [isLiking, setIsLiking] = useState(false)
  const [localLikeCount, setLocalLikeCount] = useState(review.likeCount)
  const [localIsLiked, setLocalIsLiked] = useState(review.isLikedByUser)

  const handleLike = async () => {
    setIsLiking(true)
    if (localIsLiked) {
      const result = await unlikeReviewAction(review.id)
      if (result.success) {
        setLocalLikeCount((prev: number) => prev - 1)
        setLocalIsLiked(false)
      } else {
        toast.error(result.message)
      }
    } else {
      const result = await likeReviewAction(review.id)
      if (result.success) {
        setLocalLikeCount((prev: number) => prev + 1)
        setLocalIsLiked(true)
      } else {
        toast.error(result.message)
      }
    }
    setIsLiking(false)
  }

  return (
    <div className="border-border bg-card hover:border-primary/10 rounded-2xl border p-4 transition-colors">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="ring-primary/20 ring-offset-card h-10 w-10 shrink-0 ring-2 ring-offset-1">
              {review.user.image ? (
                <AvatarImage src={review.user.image} alt={review.user.name} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {review.user.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-col gap-0.5">
              <p className="text-foreground text-sm leading-tight font-semibold">
                {review.user.name}
              </p>
              <div className="flex items-center gap-2">
                <RatingStar rating={review.rating} />
                <span className="text-muted-foreground text-[10px]">
                  {format(new Date(review.createdAt), "dd MMM yyyy", {
                    locale: ptBR,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="border-primary/20 bg-primary/5 flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1">
            <span className="text-primary text-xs font-bold">
              {review.rating}
            </span>
            <RiStarSmileFill size={16} className="text-primary" />
          </div>
        </div>

        {review.booking?.service && (
          <div className="border-border bg-background/50 text-muted-foreground flex items-center gap-1.5 self-start rounded-full border px-2.5 py-1 text-xs">
            <Scissors className="text-primary h-3 w-3" />
            {review.booking.service.name}
          </div>
        )}

        {review.comment && (
          <p className="text-muted-foreground text-sm leading-relaxed">
            {review.comment}
          </p>
        )}

        {review.response && (
          <div className="border-border bg-background/50 rounded-xl border p-3">
            <div className="mb-2 flex items-center gap-2">
              <MessageSquareQuote className="text-primary h-3.5 w-3.5" />
              <p className="text-foreground text-xs font-semibold">
                Resposta da barbearia
              </p>
              {review.respondedAt && (
                <span className="text-muted-foreground text-[10px]">
                  ·{" "}
                  {format(new Date(review.respondedAt), "dd MMM yyyy", {
                    locale: ptBR,
                  })}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {review.response}
            </p>
          </div>
        )}

        <div className="flex items-center justify-end">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              localIsLiked
                ? "border-primary/20 bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:border-primary/20 hover:text-primary",
            )}
          >
            <ThumbsUp
              className={cn("h-3.5 w-3.5", isLiking && "animate-pulse")}
            />
            {localLikeCount > 0 && <span>{localLikeCount}</span>}
            <span>{localIsLiked ? "Curtido" : "Útil"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
