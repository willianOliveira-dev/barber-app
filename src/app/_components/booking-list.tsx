import { Loader2, CalendarX, AlertCircle } from "lucide-react"
import { useBookings } from "../bookings/_hooks/use-bookings"
import { BookingItem } from "./booking-item"
import { Button } from "./ui/button"
import { SkeletonBookingItem } from "./skeleton-booking-item"

export function BookingList({
  bookings,
}: {
  bookings: ReturnType<typeof useBookings>
}) {
  const { data, hasMore, isLoading, error, loadMore } = bookings

  if (error) {
    return (
      <div className="border-destructive/20 bg-destructive/5 flex flex-col items-center gap-3 rounded-2xl border px-6 py-10 text-center">
        <div className="bg-destructive/10 flex h-10 w-10 items-center justify-center rounded-xl">
          <AlertCircle className="text-destructive h-5 w-5" />
        </div>
        <p className="text-destructive text-sm font-medium">{error}</p>
      </div>
    )
  }

  if (data.length === 0 && !isLoading) {
    return (
      <div className="border-border bg-card flex flex-col items-center gap-3 rounded-2xl border px-6 py-14 text-center">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
          <CalendarX className="text-primary h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-foreground text-sm font-semibold">
            Nenhum agendamento encontrado
          </p>
          <p className="text-muted-foreground text-xs">
            Quando você agendar um serviço, ele aparecerá aqui.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="bg-border h-px flex-1" />
          <span className="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
            {data.length} agendamento{data.length !== 1 ? "s" : ""}
          </span>
          <div className="bg-border h-px flex-1" />
        </div>
      )}

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBookingItem key={i} />
            ))
          : data.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
      </div>

      {hasMore && (
        <Button
          onClick={loadMore}
          disabled={isLoading}
          variant="outline"
          className="border-border text-muted-foreground hover:border-primary/30 hover:text-primary w-full rounded-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando...
            </>
          ) : (
            "Carregar mais"
          )}
        </Button>
      )}
    </div>
  )
}
