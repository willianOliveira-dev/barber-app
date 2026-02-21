"use client"

import { useState, useEffect, useCallback } from "react"
import { getBookingsAction } from "../_actions/get-booking.action"
import { CursorPaginationResponse } from "@/src/repositories/booking.repository"
import { BookingStatus } from "@/src/db/types/booking.type"

interface UseBookingsParams {
  status?: BookingStatus | BookingStatus[]
  limit?: number
  autoLoad?: boolean
}

export function useBookings({
  status,
  limit = 10,
  autoLoad = true,
}: UseBookingsParams = {}) {
  const [data, setData] = useState<CursorPaginationResponse["bookings"]>([])
  const [cursor, setCursor] = useState<{
    id: string
    scheduledAt: Date
  } | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadBookings = useCallback(
    async (reset = false) => {
      setIsLoading(true)
      setError(null)

      const result = await getBookingsAction({
        cursor: reset ? undefined : (cursor ?? undefined),
        limit,
        status,
      })

      if (!result.success) {
        setError(result.message ?? "Erro desconhecido")
        return
      }

      if (reset) {
        setData(result.data!.bookings)
      } else {
        setData((prev) => [...prev, ...result.data!.bookings])
      }

      setCursor(result.data!.meta.nextCursor)
      setHasMore(result.data!.meta.hasMore)

      setIsLoading(false)
    },
    [cursor, limit, status],
  )

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      loadBookings(false)
    }
  }, [hasMore, isLoading, loadBookings])

  const refresh = useCallback(() => {
    setCursor(null)
    setData([])
    loadBookings(true)
  }, [loadBookings])

  useEffect(() => {
    if (autoLoad) {
      setData([])
      setCursor(null)
      loadBookings(true)
    }
  }, [status, autoLoad])

  return {
    data,
    hasMore,
    isLoading,
    error,
    loadMore,
    refresh,
  }
}
