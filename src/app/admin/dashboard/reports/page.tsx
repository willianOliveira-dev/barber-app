import {
  TrendingUp,
  Users,
  CalendarCheck,
  Star,
  DollarSign,
  XCircle,
  MessageSquare,
  BarChart3,
} from "lucide-react"
import { getAdminReportsAction } from "./_actions/get-admin-reports.action"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { priceFormatter } from "@/src/app/_utils/price-formatter.util"

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  highlight = false,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  highlight?: boolean
}) {
  return (
    <div
      className={`border-border bg-card flex flex-col gap-3 rounded-2xl border p-5 ${highlight ? "border-primary/30 bg-primary/5" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
          <Icon className="text-primary h-4 w-4" />
        </div>
      </div>
      <div>
        <p className="text-foreground text-2xl font-bold">{value}</p>
        <p className="text-muted-foreground text-xs font-medium">{label}</p>
        {sub && <p className="text-primary/70 mt-1 text-[10px]">{sub}</p>}
      </div>
    </div>
  )
}

export default async function AdminReportsPage() {
  const response = await getAdminReportsAction()

  if (!response.success || !("data" in response)) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground text-sm">
          Erro ao carregar relatórios
        </p>
      </div>
    )
  }

  const { overview, topServices, bookingsByDay, revenueByMonth } = response.data

  const maxDayCount = Math.max(...bookingsByDay.map((d) => d.count), 1)
  const maxRevenue = Math.max(...revenueByMonth.map((m) => m.revenue), 1)

  return (
    <div className="mx-auto max-w-screen-2xl">
      <section className="border-border border-b px-5 py-8 lg:px-8 xl:px-12">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
              Análise
            </p>
            <h1 className="text-2xl leading-tight font-bold lg:text-3xl">
              Relatório<span className="text-primary">s</span>
            </h1>
            <p className="text-muted-foreground text-xs">
              Métricas e desempenho da barbearia
            </p>
          </div>
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
            <BarChart3 className="text-primary h-5 w-5" />
          </div>
        </div>
      </section>

      <div className="space-y-8 px-5 py-8 lg:px-8 xl:px-12">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Clientes únicos"
            value={overview.totalClients.toString()}
            sub="Total acumulado"
            icon={Users}
          />
          <StatCard
            label="Agendamentos"
            value={overview.totalBookings.toString()}
            sub="Total acumulado"
            icon={CalendarCheck}
          />
          <StatCard
            label="Receita este mês"
            value={priceFormatter.format(overview.revenueThisMonth)}
            sub={`${overview.revenueGrowth >= 0 ? "+" : ""}${overview.revenueGrowth}% vs mês anterior`}
            icon={DollarSign}
            highlight
          />
          <StatCard
            label="Avaliação média"
            value={`${overview.averageRating.toFixed(1)} ★`}
            sub={`${overview.totalReviews} avaliações`}
            icon={Star}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Taxa de cancelamento"
            value={`${overview.cancellationRatePct}%`}
            sub="Do total de agendamentos"
            icon={XCircle}
          />
          <StatCard
            label="Taxa de resposta"
            value={`${overview.responseRate}%`}
            sub="Avaliações respondidas"
            icon={MessageSquare}
          />
          <StatCard
            label="Receita mês anterior"
            value={priceFormatter.format(overview.revenueLastMonth)}
            sub="Mês passado"
            icon={TrendingUp}
          />
          <StatCard
            label="Total de reviews"
            value={overview.totalReviews.toString()}
            sub="Avaliações recebidas"
            icon={Star}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="border-border bg-card rounded-2xl border p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <TrendingUp className="text-primary h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-wide uppercase">
                  Receita <span className="text-primary">mensal</span>
                </h2>
                <p className="text-muted-foreground text-xs">Últimos 6 meses</p>
              </div>
            </div>

            <div className="flex items-end gap-2">
              {revenueByMonth.map((m) => {
                const height = Math.max((m.revenue / maxRevenue) * 120, 6)
                const label = format(new Date(`${m.month}-01`), "MMM", {
                  locale: ptBR,
                })
                return (
                  <div
                    key={m.month}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <span className="text-muted-foreground text-[9px]">
                      {priceFormatter.format(m.revenue)}
                    </span>
                    <div
                      className="bg-primary/40 hover:bg-primary w-full rounded-t-sm transition-colors"
                      style={{ height: `${height}px` }}
                    />
                    <span className="text-muted-foreground text-[10px] capitalize">
                      {label}
                    </span>
                    <span className="text-muted-foreground text-[9px]">
                      {m.count} agend.
                    </span>
                  </div>
                )
              })}
              {revenueByMonth.length === 0 && (
                <p className="text-muted-foreground w-full py-8 text-center text-xs">
                  Sem dados disponíveis
                </p>
              )}
            </div>
          </div>

          <div className="border-border bg-card rounded-2xl border p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <CalendarCheck className="text-primary h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-wide uppercase">
                  Dias <span className="text-primary">mais movimentados</span>
                </h2>
                <p className="text-muted-foreground text-xs">
                  Agendamentos por dia da semana
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {DAY_LABELS.map((label, i) => {
                const dayData = bookingsByDay.find((d) => d.dayOfWeek === i)
                const count = dayData?.count ?? 0
                const pct = Math.round((count / maxDayCount) * 100)
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-muted-foreground w-7 text-right text-xs">
                      {label}
                    </span>
                    <div className="bg-muted flex-1 overflow-hidden rounded-full">
                      <div
                        className="bg-primary/50 h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground w-6 text-right text-xs">
                      {count}
                    </span>
                  </div>
                )
              })}
              {bookingsByDay.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-xs">
                  Sem dados disponíveis
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-border bg-card rounded-2xl border p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <BarChart3 className="text-primary h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide uppercase">
                Serviços <span className="text-primary">mais procurados</span>
              </h2>
              <p className="text-muted-foreground text-xs">
                Por número de agendamentos
              </p>
            </div>
          </div>

          {topServices.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-xs">
              Sem dados disponíveis
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {topServices.map((service, i) => {
                const maxCount = topServices[0].count
                const pct = Math.round((service.count / maxCount) * 100)
                return (
                  <div
                    key={service.serviceId}
                    className="flex items-center gap-4"
                  >
                    <span className="text-primary w-4 text-xs font-bold">
                      #{i + 1}
                    </span>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground text-sm font-medium">
                          {service.name ?? "Serviço removido"}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground text-xs">
                            {service.count} agend.
                          </span>
                          <span className="text-primary text-xs font-semibold">
                            {priceFormatter.format(service.revenue ?? 0)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-muted overflow-hidden rounded-full">
                        <div
                          className="bg-primary/50 h-1.5 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
