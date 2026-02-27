"use client"

import { ReviewRating, ReviewSortBy } from "@/src/db/types/review.type"
import { useState, useEffect, useCallback } from "react"
import { getReviewsAction } from "../_actions/get-reviews.action"

interface UseReviewsParams {
  barbershopId: string
  rating?: ReviewRating | ReviewRating[]
  sortBy?: ReviewSortBy
  limit?: number
  autoLoad?: boolean
}

export function useReviews({
  barbershopId,
  rating,
  sortBy = "recent",
  limit = 10,
  autoLoad = true,
}: UseReviewsParams) {
  const [data, setData] = useState<any[]>([])
  const [cursor, setCursor] = useState<{
    id: string
    createdAt: string
  } | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadReviews = useCallback(
    async (reset = false) => {
      setIsLoading(true)
      setError(null)

      const result = await getReviewsAction({
        barbershopId,
        rating,
        sortBy,
        cursor: reset ? undefined : (cursor ?? undefined),
        limit,
      })

      if (!result.success || !("data" in result) || !result.data) {
        setError(result.message ?? "Erro desconhecido")
        return
      }

      if (reset) {
        setData(result.data.reviews)
      } else {
        setData((prev) => [...prev, ...result.data.reviews])
      }

      setCursor(result.data.meta.nextCursor)
      setHasMore(result.data.meta.hasMore)

      setIsLoading(false)
    },
    [barbershopId, rating, sortBy, cursor, limit],
  )

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      loadReviews(false)
    }
  }, [hasMore, isLoading, loadReviews])

  const refresh = useCallback(() => {
    setCursor(null)
    setData([])
    loadReviews(true)
  }, [loadReviews])

  useEffect(() => {
    if (autoLoad) {
      setData([])
      setCursor(null)
      loadReviews(true)
    }
  }, [barbershopId, rating, sortBy, autoLoad])

  return {
    data,
    hasMore,
    isLoading,
    error,
    loadMore,
    refresh,
  }
}
