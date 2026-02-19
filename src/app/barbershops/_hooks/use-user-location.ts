"use client"

import { useState, useEffect, useCallback } from "react"
import type { UserLocationState } from "@/src/db/types"

interface UseUserLocationOptions {
  watch?: boolean
  geolocationOptions?: PositionOptions
}

interface UseUserLocationReturn extends UserLocationState {
  refetch: () => void
}

const DEFAULT_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 60_000,
}

export function useUserLocation(
  options: UseUserLocationOptions = {},
): UseUserLocationReturn {
  const { watch = false, geolocationOptions = DEFAULT_OPTIONS } = options

  const [state, setState] = useState<UserLocationState>({
    coordinates: null,
    loading: true,
    error: null,
  })

  const onSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      coordinates: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      loading: false,
      error: null,
    })
  }, [])

  const onError = useCallback((err: GeolocationPositionError) => {
    const messages: Record<number, string> = {
      1: "Location access denied. Please enable location permissions.",
      2: "Location unavailable. Check your device settings.",
      3: "Location request timed out. Please try again.",
    }
    setState({
      coordinates: null,
      loading: false,
      error: messages[err.code] ?? "An unknown location error occurred.",
    })
  }, [])

  const fetchLocation = useCallback(() => {
    if (!navigator?.geolocation) {
      setState({
        coordinates: null,
        loading: false,
        error: "Geolocation is not supported by your browser.",
      })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    if (watch) {
      const watchId = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        geolocationOptions,
      )
      return () => navigator.geolocation.clearWatch(watchId)
    } else {
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        onError,
        geolocationOptions,
      )
    }
  }, [watch, geolocationOptions, onSuccess, onError])

  useEffect(() => {
    const cleanup = fetchLocation()
    return cleanup
  }, [fetchLocation])

  return { ...state, refetch: fetchLocation }
}
