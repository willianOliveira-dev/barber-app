import { Users, TrendingUp, UserPlus, Repeat } from "lucide-react"

const stats = [
  {
    label: "Total de clientes",
    value: "1.204",
    change: "+54 este mês",
    icon: Users,
    up: true,
  },
  {
    label: "Novos clientes",
    value: "54",
    change: "+22% vs anterior",
    icon: UserPlus,
    up: true,
  },
  {
    label: "Recorrentes",
    value: "780",
    change: "65% do total",
    icon: Repeat,
    up: true,
  },
  {
    label: "Ticket médio",
    value: "R$ 54,60",
    change: "+3%",
    icon: TrendingUp,
    up: true,
  },
]

const topClients = [
  {
    name: "Lucas Mendes",
    bookings: 12,
    spent: "R$ 780,00",
    barbershop: "Razor Centro",
  },
  {
    name: "Pedro Alves",
    bookings: 9,
    spent: "R$ 585,00",
    barbershop: "Razor Pinheiros",
  },
  {
    name: "João Silva",
    bookings: 8,
    spent: "R$ 520,00",
    barbershop: "Razor Sul",
  },
  {
    name: "Mateus Costa",
    bookings: 7,
    spent: "R$ 455,00",
    barbershop: "Razor Centro",
  },
  {
    name: "Rafael Lima",
    bookings: 6,
    spent: "R$ 390,00",
    barbershop: "Razor Pinheiros",
  },
]

const flowData = [
  { day: "Seg", visits: 28 },
  { day: "Ter", visits: 35 },
  { day: "Qua", visits: 42 },
  { day: "Qui", visits: 38 },
  { day: "Sex", visits: 55 },
  { day: "Sáb", visits: 72 },
  { day: "Dom", visits: 20 },
]
const maxVisits = Math.max(...flowData.map((d) => d.visits))

export default function AdminCustomersReportPage() {
  return (
    <div className="mx-auto max-w-screen-2xl">
      <section className="border-border border-b px-5 py-8 lg:px-8 xl:px-12">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
              Relatórios
            </p>
            <h1 className="text-2xl leading-tight font-bold lg:text-3xl">
              Fluxo de <span className="text-primary">Clientes</span>
            </h1>
            <p className="text-muted-foreground text-xs">Fevereiro 2026</p>
          </div>
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
            <Users className="text-primary h-5 w-5" />
          </div>
        </div>
      </section>

      <div className="space-y-8 px-5 py-8 lg:px-8 xl:px-12">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(({ label, value, change, icon: Icon }) => (
            <div
              key={label}
              className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5"
            >
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <Icon className="text-primary h-4 w-4" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-bold">{value}</p>
                <p className="text-muted-foreground text-xs">{label}</p>
                <p className="text-primary/70 mt-1 text-[10px]">{change}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly flow chart */}
          <div className="border-border bg-card overflow-hidden rounded-2xl border">
            <div className="border-border border-b px-5 py-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase">
                Fluxo <span className="text-primary">semanal</span>
              </h2>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Visitas por dia da semana
              </p>
            </div>
            <div className="p-5">
              <div className="flex h-40 items-end gap-2">
                {flowData.map(({ day, visits }) => (
                  <div
                    key={day}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className="bg-primary/20 hover:bg-primary/40 w-full rounded-t-md transition-all"
                        style={{ height: `${(visits / maxVisits) * 100}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground text-[10px]">
                      {day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top clients */}
          <div className="border-border bg-card overflow-hidden rounded-2xl border">
            <div className="border-border border-b px-5 py-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase">
                Top <span className="text-primary">clientes</span>
              </h2>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Mais agendamentos no mês
              </p>
            </div>
            <div className="divide-border divide-y">
              {topClients.map((client, i) => (
                <div
                  key={client.name}
                  className="flex items-center gap-4 px-5 py-3.5"
                >
                  <span className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {client.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {client.barbershop}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-primary text-sm font-bold">
                      {client.spent}
                    </p>
                    <p className="text-muted-foreground text-[10px]">
                      {client.bookings} visitas
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
