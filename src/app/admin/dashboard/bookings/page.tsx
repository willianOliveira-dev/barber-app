import { CalendarCheck, CheckCircle2, XCircle } from "lucide-react"
import { AdminBookingActions } from "../_components/admin-booking-actions" 
import { getAdminBookingsAction } from "./_actions/get-admin-bookings.action" 
import { AppPagination } from "@/src/app/_components/pagination" 
import { format } from "date-fns"
import { BookingWithRelations } from "@/src/db/types/booking.type"
import { ptBR } from "date-fns/locale"

interface AdminBookingsPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    status?: string
  }>
}

const statusConfig = {
  confirmed: {
    label: "Confirmado",
    className: "bg-green-400/10 text-green-400 border-green-400/20",
    icon: CheckCircle2,
  },
  completed: {
    label: "Concluído",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
}

export default async function AdminBookingsPage({
  searchParams,
}: AdminBookingsPageProps) {
  const { page = "1", limit = "10" } = await searchParams

  const response = await getAdminBookingsAction({
    page: Number(page),
    limit: Number(limit),
  })

  const bookings =
    response.success && "data" in response ? response.data.bookings : []
  const meta =
    response.success && "data" in response ? response.data.meta : null

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
              {meta?.total ?? 0} agendamentos encontrados
            </p>
          </div>
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
            <CalendarCheck className="text-primary h-5 w-5" />
          </div>
        </div>
      </section>

      <section className="px-5 py-8 lg:px-8 xl:px-12">
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(statusConfig).map(([key, { label, className, icon: Icon }]) => {
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
          })}
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <CalendarCheck className="text-muted-foreground h-8 w-8" />
            <p className="text-muted-foreground text-sm">
              Nenhum agendamento encontrado
            </p>
          </div>
        ) : (
          <div className="border-border bg-card overflow-hidden rounded-2xl border">
            <div className="divide-border divide-y">
              {bookings.map((b) => {
                const status = statusConfig[b.status as keyof typeof statusConfig]
                const StatusIcon = status.icon
                return (
                  <div
                    key={b.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                        <CalendarCheck className="text-primary h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-foreground text-sm font-semibold">
                            {b.user.name ?? "Cliente"}
                          </p>
                          <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status.className}`}>
                            <StatusIcon className="h-2.5 w-2.5" />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-muted-foreground truncate text-xs">
                          {b.service.name} · {b.barbershop.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {format(new Date(b.scheduledAt), "dd MMM yyyy", { locale: ptBR })} às{" "}
                          {format(new Date(b.scheduledAt), "HH:mm")} ·{" "}
                          R$ {(b.service.priceInCents / 100).toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                    </div>
                    <AdminBookingActions bookingId={b.id} status={b.status} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="border-border mt-6 border-t pt-6">
            <AppPagination meta={meta} />
          </div>
        )}
      </section>
    </div>
  )
}