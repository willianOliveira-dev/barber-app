import { Card, CardContent, CardHeader } from "./ui/card"
import { BookingSheet } from "./booking-sheet"
import { BarbershopService } from "@/src/db/types"
import Image from "next/image"
import { priceFormat } from "../_utils/price-format.util"

interface BarbershopServicesItemProps {
  service: BarbershopService
  barbershopName: string
}

export function BarbershopServiceItem({
  service,
  barbershopName,
}: BarbershopServicesItemProps) {
  return (
    <Card className="flex flex-row items-center justify-center gap-4 p-5">
      <CardHeader className="relative size-35 overflow-hidden rounded-lg p-0">
        {service.image ? (
          <Image
            quality={75}
            alt={service.name}
            src={service.image}
            className="rounded-lg object-cover"
            fill
          />
        ) : (
          <Image
            src="/default.png"
            alt="Sem imagem"
            fill
            className="object-cover"
          />
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 p-0">
        <h2 className="truncate font-semibold">{service.name}</h2>
        <p className="line-clamp-2 text-xs">{service.description}</p>
        <div className="flex flex-col gap-2">
          <p className="text-primary font-semibold">
            {priceFormat.formatToPrice(service.priceInCents)}
          </p>
          <BookingSheet barbershopName={barbershopName} service={service} />
        </div>
      </CardContent>
    </Card>
  )
}
