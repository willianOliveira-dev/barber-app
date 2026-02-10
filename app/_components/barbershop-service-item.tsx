import { barbershopServices } from "@/src/db/schemas"
import { InferSelectModel } from "drizzle-orm"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import Link from "next/link"
import Image from "next/image"

interface BarbershopServicesItemProps {
  service: InferSelectModel<typeof barbershopServices>
}

export function BarbershopServiceItem({
  service,
}: BarbershopServicesItemProps) {
  return (
    <Card className="flex flex-row items-center justify-center gap-4 p-5">
      <CardHeader className="relative size-35 overflow-hidden rounded-lg p-0">
        {service.imageUrl ? (
          <Image
            quality={75}
            alt={service.name}
            src={service.imageUrl}
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
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(service.priceInCents / 100)}
          </p>
          <Button asChild variant="secondary">
            <Link href={`/barbershops/${service.slug}`}>Reservar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
