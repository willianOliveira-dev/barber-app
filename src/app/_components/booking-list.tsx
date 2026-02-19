import { Loader2 } from "lucide-react"
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
    return <p className="text-red-500">{error}</p>
  }

  if (data.length === 0 && !isLoading) {
    return (
      <p className="text-muted-foreground text-center">
        Nenhum agendamento encontrado
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold text-gray-400 uppercase">
        Foram encontrados {data.length} agendamentos.
      </h2>
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBookingItem key={i} />
          ))
        : data.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}

      {hasMore && (
        <Button
          onClick={loadMore}
          disabled={isLoading}
          variant="outline"
          className="w-full"
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
