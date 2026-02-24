import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const stats = [
  { label: "Receita total", value: "R$ 28.400", change: "+12%", up: true },
  { label: "Ticket médio", value: "R$ 54,60", change: "+3%", up: true },
  { label: "Agendamentos pagos", value: "520", change: "+18%", up: true },
  { label: "Cancelamentos", value: "R$ 1.240", change: "-5%", up: false },
]

const transactions = [
  {
    id: "1",
    client: "Lucas Mendes",
    service: "Corte + Barba",
    barbershop: "Razor Centro",
    date: "22 fev 2026",
    value: "R$ 65,00",
    status: "paid",
  },
  {
    id: "2",
    client: "Pedro Alves",
    service: "Corte Social",
    barbershop: "Razor Pinheiros",
    date: "22 fev 2026",
    value: "R$ 45,00",
    status: "paid",
  },
  {
    id: "3",
    client: "Mateus Costa",
    service: "Barba",
    barbershop: "Razor Centro",
    date: "21 fev 2026",
    value: "R$ 35,00",
    status: "refunded",
  },
  {
    id: "4",
    client: "João Silva",
    service: "Corte Degradê",
    barbershop: "Razor Sul",
    date: "21 fev 2026",
    value: "R$ 55,00",
    status: "paid",
  },
  {
    id: "5",
    client: "Rafael Lima",
    service: "Corte + Barba",
    barbershop: "Razor Pinheiros",
    date: "20 fev 2026",
    value: "R$ 65,00",
    status: "paid",
  },
]

const statusConfig = {
  paid: {
    label: "Pago",
    className: "bg-green-400/10 text-green-400 border-green-400/20",
  },
  refunded: {
    label: "Estornado",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  pending: {
    label: "Pendente",
    className: "bg-primary/10 text-primary border-primary/20",
  },
}

// Mini bar chart data (monthly)
const chartData = [
  { month: "Set", value: 18400 },
  { month: "Out", value: 22100 },
  { month: "Nov", value: 19800 },
  { month: "Dez", value: 26500 },
  { month: "Jan", value: 24200 },
  { month: "Fev", value: 28400 },
]
const maxValue = Math.max(...chartData.map((d) => d.value))

export default function AdminPaymentsPage() {
  return (
    <div className="mx-auto max-w-screen-2xl">
      <section className="border-border border-b px-5 py-8 lg:px-8 xl:px-12">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
              Relatórios
            </p>
            <h1 className="text-2xl leading-tight font-bold lg:text-3xl">
              Paga<span className="text-primary">mentos</span>
            </h1>
            <p className="text-muted-foreground text-xs">Fevereiro 2026</p>
          </div>
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
            <BarChart3 className="text-primary h-5 w-5" />
          </div>
        </div>
      </section>

      <div className="space-y-8 px-5 py-8 lg:px-8 xl:px-12">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(({ label, value, change, up }) => (
            <div
              key={label}
              className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5"
            >
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <DollarSign className="text-primary h-4 w-4" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-bold">{value}</p>
                <p className="text-muted-foreground text-xs">{label}</p>
                <div
                  className={`mt-1 flex items-center gap-1 text-[10px] font-medium ${up ? "text-green-400" : "text-destructive"}`}
                >
                  {up ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {change} vs mês anterior
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="border-border bg-card overflow-hidden rounded-2xl border">
          <div className="border-border border-b px-5 py-4">
            <h2 className="text-sm font-semibold tracking-wide uppercase">
              Receita <span className="text-primary">mensal</span>
            </h2>
          </div>
          <div className="p-5">
            <div className="flex h-40 items-end gap-3">
              {chartData.map(({ month, value }) => (
                <div
                  key={month}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="bg-primary/20 hover:bg-primary/40 w-full rounded-t-md transition-all"
                      style={{ height: `${(value / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground text-[10px]">
                    {month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <ArrowRight className="text-primary h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold tracking-wide uppercase">
              Últimas <span className="text-primary">transações</span>
            </h2>
          </div>

          <div className="border-border bg-card overflow-hidden rounded-2xl border">
            <div className="divide-border divide-y">
              {transactions.map((t) => {
                const s = statusConfig[t.status as keyof typeof statusConfig]
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-4 px-5 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-sm font-medium">
                        {t.client}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {t.service} · {t.barbershop} · {t.date}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-foreground text-sm font-bold">
                        {t.value}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${s.className}`}
                      >
                        {s.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
