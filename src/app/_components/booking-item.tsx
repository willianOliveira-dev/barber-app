import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ProfileBarbershop } from "./profile-barbershop"
import { twMerge } from "tailwind-merge"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"

import Image from "next/image"
import { BookingSummary } from "./booking-summary"
import { Copy } from "./copy"
import { MailIcon, Smartphone } from "lucide-react"
import { Button } from "./ui/button"
import { CancelBookingDialog } from "./cancel-booking-dialog"
import { type BookingWithRelations } from "@/src/db/types/booking.type"

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
    <Sheet>
      <SheetTrigger asChild>
        <Card
          className={twMerge(
            `group border-border/40 from-background to-muted/40 relative cursor-pointer overflow-hidden border bg-linear-to-br p-0 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`,
            bookingStatusMap.border,
          )}
        >
          <CardContent className="flex justify-between p-0">
            <div className="flex flex-col gap-5 p-6">
              <Badge
                className={twMerge(
                  `w-fit px-3 py-1 font-semibold text-white shadow-sm`,
                  bookingStatusMap.background,
                )}
              >
                {bookingStatusMap.label}
              </Badge>

              <div className="space-y-3">
                <h3 className="group-hover:text-primary text-lg font-bold tracking-tight transition-colors">
                  {booking.service.name}
                </h3>

                <div className="flex items-center gap-3">
                  <ProfileBarbershop
                    image={booking.barbershop.image}
                    name={booking.barbershop.name}
                  />

                  <p className="text-muted-foreground text-sm font-medium">
                    {booking.barbershop.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-border/50 bg-muted/20 flex flex-col items-center justify-center border-l px-7 py-6">
              <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                {format(booking.scheduledAt, "MMM", { locale: ptBR })}
              </p>

              <p className="text-primary text-3xl font-bold tracking-tight">
                {format(booking.scheduledAt, "dd", { locale: ptBR })}
              </p>

              <p className="text-muted-foreground text-sm font-medium">
                {format(booking.scheduledAt, "HH:mm", { locale: ptBR })}
              </p>
            </div>
          </CardContent>

          <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
            <div className="from-primary/10 to-primary/10 absolute inset-0 bg-linear-to-r via-transparent" />
          </div>
        </Card>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll [&::-webkit-scrollbar]:hidden">
        <SheetHeader>
          <SheetTitle>Informações da reserva</SheetTitle>
        </SheetHeader>
        <div className="bg-border h-px" />
        <div className="space-y-6 p-5">
          <div className="relative flex h-45 w-full items-end overflow-hidden rounded-2xl">
            <Image
              alt="Mapa de Barbearia"
              src="/images/map.png"
              loading="eager"
              fill
              className="object-cover"
            ></Image>
            <Card className="z-10 mx-5 mb-3 w-full overflow-hidden border-none p-2 shadow-md transition-all hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-2">
                <ProfileBarbershop
                  name={booking.barbershop.name}
                  image={booking.barbershop.image}
                />
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <h3 className="text-primary truncate leading-tight font-bold tracking-tight">
                    {booking.barbershop.name}
                  </h3>

                  <div className="text-muted-foreground flex flex-col text-xs">
                    <p className="text-foreground/80 truncate font-medium">
                      {booking.barbershop.address}
                    </p>
                    <p className="flex items-center gap-1">
                      {booking.barbershop.city} • {booking.barbershop.state}
                    </p>
                    <p className="mt-1 text-[13.3px] font-light opacity-70">
                      CEP: {booking.barbershop.zipCode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-3">
            <Badge className={twMerge("w-fit", bookingStatusMap.background)}>
              {bookingStatusMap.label}
            </Badge>
            <BookingSummary
              barbershopName={booking.barbershop.name}
              serviceName={booking.service.name}
              date={booking.scheduledAt}
              scheduledTime={booking.scheduledAt}
              servicePrice={booking.service.priceInCents}
            />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase">
              Contato
            </h2>
            <div className="flex flex-col gap-2">
              {booking.barbershop?.phone ? (
                <div className="flex items-center justify-between gap-4">
                  <p className="flex items-center gap-1 text-xs">
                    <span>
                      <Smartphone size={16} />
                    </span>
                    {booking.barbershop.phone}
                  </p>
                  <Copy message={booking.barbershop.phone} />
                </div>
              ) : (
                <p className="text-xs">Sem telefone</p>
              )}
              {booking.barbershop.email ? (
                <div className="flex items-center justify-between gap-4">
                  <p className="flex items-center gap-1 text-xs">
                    <span>
                      <MailIcon size={16} />
                    </span>
                    {booking.barbershop.email}
                  </p>
                  <Copy message={booking.barbershop.email} />
                </div>
              ) : (
                <p className="text-xs">Sem email</p>
              )}
            </div>
          </div>
        </div>
        <SheetFooter>
          <div className="flex flex-col items-center gap-3">
            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                Voltar
              </Button>
            </SheetClose>
            {booking.status === "confirmed" && <CancelBookingDialog />}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
