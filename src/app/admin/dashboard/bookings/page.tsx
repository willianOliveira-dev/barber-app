import { CalendarCheck, CheckCircle2, XCircle, Clock } from "lucide-react"
import { AdminBookingActions } from "../_components/admin-booking-actions"

const bookings = [
  {
    id: "1",
    client: "Lucas Mendes",
    service: "Corte + Barba",
    barbershop: "Razor Centro",
    date: "22 fev 2026",
    time: "14:30",
    price: "R$ 65,00",
    status: "pending",
  },
  {
    id: "2",
    client: "Pedro Alves",
    service: "Corte Social",
    barbershop: "Razor Pinheiros",
    date: "22 fev 2026",
    time: "15:00",
    price: "R$ 45,00",
    status: "confirmed",
  },
  {
    id: "3",
    client: "Mateus Costa",
    service: "Barba",
    barbershop: "Razor Centro",
    date: "22 fev 2026",
    time: "15:30",
    price: "R$ 35,00",
    status: "cancelled",
  },
  {
    id: "4",
    client: "João Silva",
    service: "Corte Degradê",
    barbershop: "Razor Sul",
    date: "23 fev 2026",
    time: "10:00",
    price: "R$ 55,00",
    status: "pending",
  },
  {
    id: "5",
    client: "Rafael Lima",
    service: "Corte + Barba",
    barbershop: "Razor Pinheiros",
    date: "23 fev 2026",
    time: "11:00",
    price: "R$ 65,00",
    status: "confirmed",
  },
]

const statusConfig = {
  confirmed: {
    label: "Confirmado",
    className: "bg-green-400/10 text-green-400 border-green-400/20",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pendente",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: Clock,
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
}

export default function AdminBookingsPage() {
  return (
    <div className="mx-auto max-w-screen-2xl">
      <section className="border-border border-b px-5 py-8 lg:px-8 xl:px-12">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
              Gerenciar
            </p>
            <h1 className="text-2xl leading-tight font-bold lg:text-3xl">
              Agenda<span className="text-primary">mentos</span>
            </h1>
            <p className="text-muted-foreground text-xs">
              Confirme ou cancele agendamentos pendentes
            </p>
          </div>
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
            <CalendarCheck className="text-primary h-5 w-5" />
          </div>
        </div>
      </section>

      <section className="px-5 py-8 lg:px-8 xl:px-12">
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(statusConfig).map(
            ([key, { label, className, icon: Icon }]) => {
              const count = bookings.filter((b) => b.status === key).length
              return (
                <div
                  key={key}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${className}`}
                >
                  <Icon className="h-3 w-3" />
                  {label}: {count}
                </div>
              )
            },
          )}
        </div>

        <div className="border-border bg-card overflow-hidden rounded-2xl border">
          <div className="divide-border divide-y">
            {bookings.map((booking) => {
              const status =
                statusConfig[booking.status as keyof typeof statusConfig]
              const StatusIcon = status.icon
              return (
                <div
                  key={booking.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                      <CalendarCheck className="text-primary h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-foreground text-sm font-semibold">
                          {booking.client}
                        </p>
                        <span
                          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status.className}`}
                        >
                          <StatusIcon className="h-2.5 w-2.5" />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-muted-foreground truncate text-xs">
                        {booking.service} · {booking.barbershop}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {booking.date} às {booking.time} · {booking.price}
                      </p>
                    </div>
                  </div>
                  <AdminBookingActions
                    bookingId={booking.id}
                    status={booking.status}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
