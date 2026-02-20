import Image from "next/image"
import { Card, CardContent, CardHeader } from "./ui/card"
import { InferSelectModel } from "drizzle-orm"
import { barbershop } from "@/src/db/schemas"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { StarIcon } from "lucide-react"
import Link from "next/link"
import { getReviewStatsAction } from "../barbershops/_actions/get-review-stats.action"

interface BarbershopItemProps {
  barbershop: InferSelectModel<typeof barbershop>
}

export async function BarbershopItem({ barbershop }: BarbershopItemProps) {
  const reviewStats = await getReviewStatsAction(barbershop.id)
  return (
    <Card className="group border-border bg-card hover:border-primary/20 w-full overflow-hidden border pt-0 transition-colors">
      <CardHeader className="relative h-37.5 w-full p-0">
        {barbershop.image ? (
          <Image
            quality={75}
            alt={barbershop.name}
            src={barbershop.image}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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

        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

        <Badge
          className="absolute bottom-2 left-2 flex items-center gap-1 border border-white/10 bg-black/50 px-2 py-0.5 backdrop-blur-sm"
          variant="secondary"
        >
          <StarIcon className="fill-primary text-primary h-3 w-3" />
          <span className="text-xs font-semibold text-white">
            {reviewStats.data?.averageRating.toFixed(1)} (
            {reviewStats.data?.totalReviews})
          </span>
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 p-3">
        <h2 className="text-foreground truncate text-sm font-semibold">
          {barbershop.name}
        </h2>
        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
          {barbershop.description}
        </p>
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="hover:border-primary/30 hover:text-primary mt-1 w-full rounded-lg text-xs"
        >
          <Link href={`/barbershops/${barbershop.slug}`}>Reservar</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
