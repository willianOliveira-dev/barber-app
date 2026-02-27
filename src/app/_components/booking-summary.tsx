import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, ClockIcon, Scissors, Tag } from "lucide-react"
import { priceFormatter } from "../_utils/price-formatter.util"
import { Card, CardContent } from "./ui/card"

interface BookingSummaryProps {
  serviceName: string
  date: Date
  scheduledTime: Date
  barbershopName: string
  servicePrice: number
}

export function BookingSummary({
  barbershopName,
  date,
  scheduledTime,
  servicePrice,
  serviceName,
}: BookingSummaryProps) {
  const rows = [
    {
      icon: CalendarIcon,
      label: "Data",
      value: format(date, "dd 'de' MMMM", { locale: ptBR }),
    },
    {
      icon: ClockIcon,
      label: "Horário",
      value: format(scheduledTime, "HH:mm", { locale: ptBR }),
    },
    {
      icon: Tag,
      label: "Barbearia",
      value: barbershopName,
    },
  ]

  return (
    <Card className="border-border bg-card w-full overflow-hidden border">
      <CardContent className="p-0">
        <div className="border-border flex items-center justify-between gap-4 border-b px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="bg-primary/10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
              <Scissors className="text-primary h-3.5 w-3.5" />
            </div>
            <h3 className="text-foreground truncate text-sm font-semibold">
              {serviceName}
            </h3>
          </div>
          <span className="text-primary shrink-0 text-sm font-bold">
            {priceFormatter.formatToPrice(servicePrice)}
          </span>
        </div>

        <div className="divide-border flex flex-col divide-y">
          {rows.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="text-muted-foreground flex items-center gap-2">
                <Icon className="text-primary h-3.5 w-3.5" />
                <span className="text-xs">{label}</span>
              </div>
              <span className="text-foreground line-clamp-1 text-xs font-medium">
                {value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
