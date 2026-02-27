import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, ClockIcon, RotateCcw } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { priceFormatter } from "../_utils/price-formatter.util"
import { type BookingWithRelations } from "@/src/db/types/booking.type"
import Link from "next/link"

interface RebookItemProps {
  booking: BookingWithRelations
  className?: string
}

export function RebookItem({ booking, className }: RebookItemProps) {
  return (
    <Card
      className={twMerge(
        "hover:border-primary/10 w-full overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-2 backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-lg",
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-start justify-center gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar className="ring-primary/20 ring-offset-card size-11 shrink-0 rounded-xl ring-2 ring-offset-1">
              {booking.barbershop.image ? (
                <AvatarImage
                  src={booking.barbershop.image}
                  alt={booking.barbershop.name}
                />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {booking.barbershop.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-col gap-0.5">
              <h3 className="text-foreground truncate text-sm leading-tight font-semibold">
                {booking.barbershop.name}
              </h3>
              <p className="text-muted-foreground truncate text-xs">
                {booking.service.name}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <div className="text-muted-foreground flex items-center gap-1">
                  <CalendarIcon size={12} className="text-primary shrink-0" />
                  <span className="text-xs">
                    {format(new Date(booking.scheduledAt), "dd MMM yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center gap-1">
                  <ClockIcon size={12} className="text-primary shrink-0" />
                  <span className="text-xs">
                    {format(new Date(booking.scheduledAt), "HH:mm")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-2">
            <span className="text-primary text-sm font-bold whitespace-nowrap">
              {priceFormatter.formatToPrice(booking.service.priceInCents)}
            </span>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 gap-1.5 rounded-full px-3 text-xs font-semibold whitespace-nowrap"
              asChild
            >
              <Link href={`/barbershops/${booking.barbershop.slug}`}>
                <RotateCcw size={12} />
                Agendar novamente
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
