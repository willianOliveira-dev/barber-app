"use client"
import { useState, useEffect, useCallback } from "react"

interface UseUserLocationOptions {
  watch?: boolean
  geolocationOptions?: PositionOptions
}

export interface UserLocationState {
  coordinates: { lat: number; lng: number } | null
  loading: boolean
  error: string | null
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
      1: "Acesso à localização negado. Por favor, ative as permissões.",
      2: "Localização indisponível. Verifique as configurações do dispositivo.",
      3: "Tempo limite esgotado. Por favor, tente novamente.",
    }
    setState({
      coordinates: null,
      loading: false,
      error:
        messages[err.code] ??
        "Ocorreu um erro desconhecido ao obter a localização.",
    })
  }, [])

  const fetchLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator?.geolocation) {
      setState({
        coordinates: null,
        loading: false,
        error: "Geolocalização não é suportada pelo seu navegador.",
      })
      return
    }

    setState((prev: UserLocationState) => ({ ...prev, loading: true, error: null }))

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
    return () => {
      if (typeof cleanup === "function") cleanup()
    }
  }, [fetchLocation])

  return { ...state, refetch: fetchLocation }
}
