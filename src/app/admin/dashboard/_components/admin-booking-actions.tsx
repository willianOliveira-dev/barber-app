"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { updateBookingStatusAction } from "../bookings/_actions/update-booking-status.actiont" 
import { Button } from "@/src/app/_components/ui/button"

interface AdminBookingActionsProps {
  bookingId: string
  status: string
}

export function AdminBookingActions({ bookingId, status }: AdminBookingActionsProps) {
  const [loading, setLoading] = useState<"completed" | "cancelled" | null>(null)
  const [currentStatus, setCurrentStatus] = useState(status)

  const handleUpdate = async (newStatus: "completed" | "cancelled") => {
    setLoading(newStatus)

    const result = await updateBookingStatusAction({
      bookingId,
      status: newStatus,
    })

    if (!result.success) {
      toast.error(result.message ?? "Erro ao atualizar agendamento")
      setLoading(null)
      return
    }

    toast.success(
      newStatus === "completed" ? "Agendamento concluído" : "Agendamento cancelado",
    )
    setCurrentStatus(newStatus)
    setLoading(null)
  }

  if (currentStatus === "cancelled" || currentStatus === "completed") {
    return null
  }

  return (
    <div className="flex shrink-0 gap-2">
      <Button
        onClick={() => handleUpdate("completed")}
        disabled={!!loading}
        className="flex items-center gap-1.5 rounded-lg bg-green-400/10 px-3 py-1.5 text-xs font-medium text-green-400 transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {loading === "completed" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5" />
        )}
        Concluir
      </Button>
      <Button
        onClick={() => handleUpdate("cancelled")}
        disabled={!!loading}
        className="flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {loading === "cancelled" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <XCircle className="h-3.5 w-3.5" />
        )}
        Cancelar
      </Button>
    </div>
  )
}