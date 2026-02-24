import {
  Scissors,
  CalendarCheck,
  Users,
  TrendingUp,
  ArrowRight,
  MessageSquare,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import Link from "next/link"

const stats = [
  {
    label: "Barbearias",
    value: "12",
    change: "+2 este mês",
    icon: Scissors,
    href: "/admin/dashboard/barbershops",
  },
  {
    label: "Agendamentos",
    value: "348",
    change: "+18% esta semana",
    icon: CalendarCheck,
    href: "/admin/dashboard/bookings",
  },
  {
    label: "Clientes",
    value: "1.204",
    change: "+54 novos",
    icon: Users,
    href: "/admin/dashboard/customers",
  },
  {
    label: "Receita",
    value: "R$ 28.4k",
    change: "+12% vs mês anterior",
    icon: TrendingUp,
    href: "/admin/dashboard/reports/payments",
  },
]

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
]

const recentBookings = [
  {
    id: "1",
    client: "Lucas Mendes",
    service: "Corte + Barba",
    barbershop: "Razor Centro",
    time: "14:30",
    status: "confirmed",
  },
  {
    id: "2",
    client: "Pedro Alves",
    service: "Corte Social",
    barbershop: "Razor Pinheiros",
    time: "15:00",
    status: "pending",
  },
  {
    id: "3",
    client: "Mateus Costa",
    service: "Barba",
    barbershop: "Razor Centro",
    time: "15:30",
    status: "cancelled",
  },
  {
    id: "4",
    client: "João Silva",
    service: "Corte Degradê",
    barbershop: "Razor Sul",
    time: "16:00",
    status: "confirmed",
  },
  {
    id: "5",
    client: "Rafael Lima",
    service: "Corte + Barba",
    barbershop: "Razor Pinheiros",
    time: "16:30",
    status: "pending",
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

export default async function AdminDashboard() {
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
          {stats.map(({ label, value, change, icon: Icon, href }) => (
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
                <p className="text-foreground text-2xl font-bold lg:text-3xl">
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
                    Agendamentos <span className="text-primary">Recentes</span>
                  </h2>
                  <p className="text-muted-foreground text-xs">Hoje</p>
                </div>
              </div>
              <Link
                href="/admin/bookings"
                className="text-primary flex items-center gap-1 text-xs hover:underline"
              >
                Ver todos <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="border-border bg-card overflow-hidden rounded-2xl border">
              <div className="divide-border divide-y">
                {recentBookings.map((booking) => {
                  const status =
                    statusConfig[booking.status as keyof typeof statusConfig]
                  const StatusIcon = status.icon
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between gap-4 px-5 py-3.5"
                    >
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <p className="text-foreground truncate text-sm font-medium">
                          {booking.client}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {booking.service} · {booking.barbershop}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-muted-foreground text-xs">
                          {booking.time}
                        </span>
                        <span
                          className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.className}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
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
              href="/admin/reports/payments"
              className="border-primary/20 bg-primary/5 hover:bg-primary/10 mt-2 flex flex-col gap-3 rounded-2xl border p-5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <p className="text-primary text-xs font-semibold tracking-widest uppercase">
                  Receita hoje
                </p>
                <ArrowRight className="text-primary h-3.5 w-3.5" />
              </div>
              <p className="text-foreground text-3xl font-bold">R$ 1.240</p>
              <p className="text-muted-foreground text-xs">
                +8% em relação a ontem
              </p>
              <div className="flex gap-1">
                {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                  <div
                    key={i}
                    className="bg-primary/30 flex-1 rounded-sm"
                    style={{ height: `${h * 0.4}px` }}
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
