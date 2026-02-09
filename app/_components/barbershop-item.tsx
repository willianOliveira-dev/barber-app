import Image from "next/image"
import { Card, CardContent, CardHeader } from "./ui/card"
import { InferSelectModel } from "drizzle-orm"
import { barbershops } from "@/src/db/schemas"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { StarIcon } from "lucide-react"

interface BarberShopItemProps {
  barbershop: InferSelectModel<typeof barbershops>
}

export function BarberShopItem({ barbershop }: BarberShopItemProps) {
  return (
    <Card className="min-w-52.5 overflow-hidden pt-0">
      <CardHeader className="relative h-37.5 w-full">
        <Image
          quality={75}
          alt={barbershop.name}
          src={barbershop.imageUrl!}
          className="rounded-lg object-cover"
          fill
        />
        <Badge
          className="absolute top-2 left-2 space-x-1"
          variant={"secondary"}
        >
          <StarIcon className="fill-primary text-primary" />
          <p className="text-xs font-semibold">5,0</p>
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2">
        <h2 className="truncate font-semibold">{barbershop.name}</h2>
        <p className="truncate text-xs">{barbershop.description}</p>
        <Button variant="secondary" className="mt-3 w-full">
          Reservar
        </Button>
      </CardContent>
    </Card>
  )
}
