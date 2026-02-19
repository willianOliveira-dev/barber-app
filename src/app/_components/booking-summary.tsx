import { format } from "date-fns"
import { priceFormat } from "../_utils/price-format.util"
import { Card, CardContent } from "./ui/card"
import { ptBR } from "date-fns/locale"

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
  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-semibold">{serviceName}</h3>
            <p className="font-semibold">
              {priceFormat.formatToPrice(servicePrice)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-gray-400">Data</p>
            <p className="text-gray-400">
              {format(date, "dd 'de' MMMM", {
                locale: ptBR,
              })}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-gray-400">Horário</p>
            <p className="text-gray-400">
              {format(scheduledTime, "HH:mm", {
                locale: ptBR,
              })}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-gray-400">Barbearia</p>
            <p className="line-clamp-1 text-gray-400">{barbershopName}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
