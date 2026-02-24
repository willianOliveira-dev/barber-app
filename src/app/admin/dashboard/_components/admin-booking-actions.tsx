"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

interface AdminBookingActionsProps {
  bookingId: string
  status: string
}

export function AdminBookingActions({
  bookingId,
  status,
}: AdminBookingActionsProps) {
  const [current, setCurrent] = useState(status)
  const [loading, setLoading] = useState<"confirm" | "cancel" | null>(null)

  const handleConfirm = async () => {
    setLoading("confirm")
    // await confirmBookingAction(bookingId)
    setCurrent("confirmed")
    setLoading(null)
  }

  const handleCancel = async () => {
    setLoading("cancel")
    // await cancelBookingAction(bookingId)
    setCurrent("cancelled")
    setLoading(null)
  }

  if (current === "confirmed") {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-medium text-green-400">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Confirmado
      </div>
    )
  }

  if (current === "cancelled") {
    return (
      <div className="border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium">
        <XCircle className="h-3.5 w-3.5" />
        Cancelado
      </div>
    )
  }

  return (
    <div className="flex shrink-0 gap-2">
      <button
        onClick={handleCancel}
        disabled={!!loading}
        className="border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:text-white disabled:opacity-50"
      >
        {loading === "cancel" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <XCircle className="h-3.5 w-3.5" />
        )}
        Cancelar
      </button>
      <button
        onClick={handleConfirm}
        disabled={!!loading}
        className="flex items-center gap-1.5 rounded-lg border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-medium text-green-400 transition-colors hover:bg-green-400 hover:text-white disabled:opacity-50"
      >
        {loading === "confirm" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5" />
        )}
        Confirmar
      </button>
    </div>
  )
}
