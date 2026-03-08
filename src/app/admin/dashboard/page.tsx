import {
  Scissors,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  MessageSquare,
  Plus,
  CheckCircle2,
  XCircle,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { getAdminDashboardAction } from "./_actions/get-admin-dashboard.action"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { BookingWithRelations } from "@/src/db/types/booking.type"
import { priceFormatter } from "../../_utils/price-formatter.util"

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

const quickActions = [
  {
    label: "Nova barbearia",
    href: "/admin/dashboard/barbershops/new",
    icon: Plus,
    description: "Cadastrar nova unidade",
  },
  {
    label: "Ver agendamentos",
    href: "/admin/dashboard/bookings",
    icon: CalendarCheck,
    description: "Confirmar ou cancelar",
  },
  {
    label: "Comentários pendentes",
    href: "/admin/dashboard/reviews",
    icon: MessageSquare,
    description: "Responder avaliações",
  },
  {
    label: "Relatórios",
    href: "/admin/dashboard/reports",
    icon: BarChart3,
    description: "Métricas e desempenho",
  },
]

export default async function AdminDashboard() {
  const response = await getAdminDashboardAction()

  if (!response.success || !("data" in response)) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground text-sm">
          Erro ao carregar dashboard
        </p>
      </div>
    )
  }

  const { stats, todayBookings, last7Days, barbershops } = response.data

  const maxRevenue = Math.max(...last7Days, 1)

  const statsCards = [
    {
      label: "Agendamentos",
      value: stats.totalBookings.toString(),
      change: `${stats.weekChange >= 0 ? "+" : ""}${stats.weekChange}% esta semana`,
      icon: CalendarCheck,
      href: "/admin/dashboard/bookings",
    },
    {
      label: "Barbearias",
      value: barbershops.length.toString(),
      change: `${barbershops.map((b) => b.name).join(", ")}`,
      icon: Scissors,
      href: "/admin/dashboard/barbershops",
    },
  ]

  return (
    <div className="mx-auto max-w-screen-2xl">
      <section className="border-border border-b px-5 py-8 lg:px-8 xl:px-12">
        <div className="space-y-1">
          <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
            Painel administrativo
          </p>
          <h1 className="text-2xl leading-tight font-bold lg:text-3xl">
            Visão <span className="text-primary">Geral</span>
          </h1>
          <p className="text-muted-foreground text-xs">
            Resumo de atividade e métricas do sistema
          </p>
        </div>
      </section>

      <div className="space-y-8 px-5 py-8 lg:px-8 xl:px-12">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statsCards.map(({ label, value, change, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="group border-border bg-card hover:border-primary/20 flex flex-col gap-4 rounded-2xl border p-5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
                  <Icon className="text-primary h-4 w-4" />
                </div>
                <ArrowRight className="text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div>
                <p className="text-foreground truncate text-2xl font-bold lg:text-3xl">
                  {value}
                </p>
                <p className="text-muted-foreground text-xs font-medium">
                  {label}
                </p>
                <p className="text-primary/70 mt-1 text-[10px]">{change}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <CalendarCheck className="text-primary h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-wide uppercase">
                    Agendamentos <span className="text-primary">de Hoje</span>
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
              </div>
              <Link
                href="/admin/dashboard/bookings"
                className="text-primary flex items-center gap-1 text-xs hover:underline"
              >
                Ver todos <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="border-border bg-card overflow-hidden rounded-2xl border">
              {todayBookings.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <p className="text-muted-foreground text-sm">
                    Nenhum agendamento hoje
                  </p>
                </div>
              ) : (
                <div className="divide-border divide-y">
                  {(todayBookings as BookingWithRelations[]).map((b) => {
                    const status =
                      statusConfig[b.status as keyof typeof statusConfig]
                    const StatusIcon = status?.icon ?? CheckCircle2
                    return (
                      <div
                        key={b.id}
                        className="flex items-center justify-between gap-4 px-5 py-3.5"
                      >
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <p className="text-foreground truncate text-sm font-medium">
                            {b.user?.name ?? "Cliente"}
                          </p>
                          <p className="text-muted-foreground truncate text-xs">
                            {b.service?.name}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-muted-foreground text-xs">
                            {format(new Date(b.scheduledAt), "HH:mm")}
                          </span>
                          {status && (
                            <span
                              className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.className}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <TrendingUp className="text-primary h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-wide uppercase">
                  Ações <span className="text-primary">Rápidas</span>
                </h2>
                <p className="text-muted-foreground text-xs">
                  Atalhos frequentes
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {quickActions.map(({ label, href, icon: Icon, description }) => (
                <Link
                  key={label}
                  href={href}
                  className="group border-border bg-card hover:border-primary/20 flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                      <Icon className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-medium">
                        {label}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="text-muted-foreground h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>

            <Link
              href="/admin/dashboard/reports"
              className="border-primary/20 bg-primary/5 hover:bg-primary/10 mt-2 flex flex-col gap-3 rounded-2xl border p-5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <p className="text-primary text-xs font-semibold tracking-widest uppercase">
                  Receita hoje
                </p>
                <ArrowRight className="text-primary h-3.5 w-3.5" />
              </div>
              <p className="text-foreground text-3xl font-bold">
                {priceFormatter.format(stats.revenueToday)}
              </p>
              <p className="text-muted-foreground text-xs">
                {stats.revenueChange >= 0 ? "+" : ""}
                {stats.revenueChange}% em relação a ontem
              </p>
              <div className="flex items-end gap-1">
                {last7Days.map((revenue, i) => (
                  <div
                    key={i}
                    className="bg-primary/30 flex-1 rounded-sm transition-all"
                    style={{
                      height: `${Math.max((revenue / maxRevenue) * 32, 4)}px`,
                    }}
                  />
                ))}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
