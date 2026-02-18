import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ProfileBarbershop } from "./profile-barbershop"
import { twMerge } from "tailwind-merge"
import { type BookingWithRelations } from "@/src/repositories/booking.repository"

interface BookingItemProps {
  booking: BookingWithRelations
}

export function BookingItem({ booking }: BookingItemProps) {
  const bookingStatusMap = {
    confirmed: {
      label: "Confirmado",
      background: "bg-primary",
      border: "border-r-primary",
    },
    completed: {
      label: "Concluído",
      background: "bg-emerald-400",
      border: "border-r-emerald-400",
    },
    cancelled: {
      label: "Cancelado",
      background: "bg-red-400",
      border: "border-r-red-400",
    },
  }[booking.status]

  return (
    <Card
      className={twMerge("border-r-indigo-500 p-0", bookingStatusMap.border)}
    >
      <CardContent className="flex justify-between p-0">
        <div className="flex flex-col gap-2 p-6">
          <Badge className={twMerge("w-fit", bookingStatusMap.background)}>
            {bookingStatusMap.label}
          </Badge>
          <div className="space-y-1.5">
            <h3 className="font-semibold">{booking.service.name}</h3>
            <div className="flex items-center gap-2">
              <ProfileBarbershop
                image={booking.barbershop.image}
                name={booking.barbershop.name}
              />
              <p className="text-sm">{booking.barbershop.name}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center border-l-2 border-gray-400/10 p-6">
          <p className="text-sm capitalize">
            {format(booking.scheduledAt, "MMMM", { locale: ptBR })}
          </p>
          <p className="text-2xl">
            {format(booking.scheduledAt, "dd", { locale: ptBR })}
          </p>
          <p className="text-sm">
            {format(booking.scheduledAt, "HH:mm", { locale: ptBR })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
