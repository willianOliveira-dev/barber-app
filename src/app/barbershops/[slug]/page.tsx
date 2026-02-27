import { BarbershopServiceItem } from "@/src/app/_components/barbershop-service-item"
import { Copy } from "@/src/app/_components/copy"
import { Footer } from "@/src/app/_components/footer"
import { Menu } from "@/src/app/_components/menu"
import { Button } from "@/src/app/_components/ui/button"
import {
  ArrowLeft,
  StarIcon,
  MapPinHouse,
  Smartphone,
  MailIcon,
  Scissors,
  Info,
  Phone,
  Clock,
  Megaphone,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ReviewStats } from "../../_components/reviews-stats"
import { ReviewList } from "../../_components/review-list"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getBarbershopBySlug } from "../_actions/get-barbershop-by-slug.action"
import { twMerge } from "tailwind-merge"
import { getCategories } from "../_actions/get-categories.action"

interface BarbershopPageProps {
  params: Promise<{ slug: string }>
}

export default async function BarbershopDetailPage({
  params,
}: BarbershopPageProps) {
  const { slug } = await params
  const [barbershopResponse, categoriesResponse] = await Promise.all([
    getBarbershopBySlug(slug),
    getCategories(),
  ])

  const barbershop = barbershopResponse.data

  const categories =
    categoriesResponse.success && "data" in categoriesResponse
      ? categoriesResponse.data
      : []

  const dayMap: Record<string, string> = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  }

  return (
    <>
      <main className="flex flex-1 flex-col gap-0">
        <section className="relative h-62.5 w-full overflow-hidden lg:h-95">
          <Image
            src={barbershop.image || "/images/default.png"}
            alt={barbershop.name}
            fill
            className="object-cover"
            priority
          />
          <div className="from-background via-background/30 absolute inset-0 bg-linear-to-t to-transparent" />

          <div className="absolute top-4 right-4 left-4 z-20 flex items-center justify-between">
            <Button
              asChild
              size="icon"
              variant="secondary"
              className="border-border bg-card/80 hover:border-primary/30 rounded-xl border backdrop-blur-sm"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="block sm:hidden">
              <Menu categories={categories} />
            </div>
          </div>

          <div className="absolute right-0 bottom-0 left-0 z-10 p-5 lg:p-8">
            <div className="container mx-auto">
              <h1 className="text-foreground text-2xl leading-tight font-bold lg:text-4xl">
                {barbershop.name}
              </h1>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-1.5">
                  <MapPinHouse className="text-primary h-4 w-4 shrink-0" />
                  <span className="text-muted-foreground text-xs lg:text-sm">
                    {`${barbershop.address}${barbershop.streetNumber ? `, ${barbershop.streetNumber}` : ""}`}
                    {barbershop.neighborhood && ` - ${barbershop.neighborhood}`}
                    {barbershop.complement && ` (${barbershop.complement})`}
                  </span>
                </div>

                <div className="bg-border hidden h-1 w-1 rounded-full sm:block" />

                <span className="text-muted-foreground text-xs lg:text-sm">
                  {barbershop.city} — {barbershop.state}
                </span>

                <span className="border-primary/20 bg-primary/10 text-primary flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  <StarIcon className="fill-primary h-3 w-3" />
                  {barbershop.averageRating.toFixed(1)} ·{" "}
                  {barbershop.totalReviews} avaliações
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto flex flex-col gap-8 px-5 py-8 lg:flex-row lg:items-start lg:gap-12 lg:px-8 xl:px-12">
          <div className="flex flex-col gap-8 lg:flex-1">
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <Info className="text-primary h-4 w-4" />
                </div>
                <h2 className="text-sm font-semibold tracking-wide uppercase">
                  Sobre <span className="text-primary">nós</span>
                </h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {barbershop.description ?? "Sem descrição"}
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <Scissors className="text-primary h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-wide uppercase">
                    Serviços <span className="text-primary">disponíveis</span>
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    {barbershop.services.length} serviços
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {barbershop.services.map((service) => (
                  <BarbershopServiceItem
                    key={service.id}
                    barbershopIsOpen={barbershop.status?.isOpen ?? false}
                    barbershopSlug={barbershop.slug}
                    barbershopName={barbershop.name}
                    service={service}
                  />
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <ReviewStats barbershopId={barbershop.id} />
              <ReviewList barbershopId={barbershop.id} />
            </section>
          </div>

          <aside className="flex flex-col gap-4 lg:w-80 lg:shrink-0 xl:w-85">
            <div className="border-border bg-card rounded-2xl border p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <Phone className="text-primary h-4 w-4" />
                </div>
                <h2 className="text-sm font-semibold tracking-wide uppercase">
                  Contato
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {barbershop.phone && (
                  <div className="border-border bg-background/50 flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <Smartphone className="text-primary h-3.5 w-3.5 shrink-0" />
                      <span className="font-medium">{barbershop.phone}</span>
                    </div>
                    <Copy message={barbershop.phone} />
                  </div>
                )}
                {barbershop.email && (
                  <div className="border-border bg-background/50 flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5">
                    <div className="text-muted-foreground flex min-w-0 items-center gap-2 text-xs">
                      <MailIcon className="text-primary h-3.5 w-3.5 shrink-0" />
                      <span className="truncate font-medium">
                        {barbershop.email}
                      </span>
                    </div>
                    <Copy message={barbershop.email} />
                  </div>
                )}
              </div>
            </div>

            <div className="border-border bg-card rounded-2xl border p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <Clock className="text-primary h-4 w-4" />
                </div>
                <h2 className="text-sm font-semibold tracking-wide uppercase">
                  Horários
                </h2>
              </div>

              <div className="flex flex-col gap-2">
                {barbershop.hours.length > 0 ? (
                  [...barbershop.hours]
                    .sort((a, b) => {
                      const days = [
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                      ]
                      return (
                        days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek)
                      )
                    })
                    .map((hour) => (
                      <div
                        key={hour.id}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-muted-foreground">
                          {dayMap[hour.dayOfWeek]}
                        </span>
                        <span
                          className={
                            hour.isOpen
                              ? "text-foreground font-medium"
                              : "text-destructive font-semibold uppercase"
                          }
                        >
                          {hour.isOpen
                            ? `${hour.openingTime} — ${hour.closingTime}`
                            : "Fechado"}
                        </span>
                      </div>
                    ))
                ) : (
                  <p className="text-muted-foreground text-xs">
                    Horários não informados
                  </p>
                )}
              </div>

              <hr className="border-border my-4" />

              <div className="flex items-center gap-2 text-xs">
                <span
                  className={twMerge(
                    "block h-2 w-2 rounded-full",
                    barbershop.status?.isOpen
                      ? "animate-pulse bg-green-500"
                      : "bg-destructive",
                  )}
                />
                <span
                  className={
                    barbershop.status?.isOpen
                      ? "text-foreground font-semibold"
                      : "text-destructive font-semibold"
                  }
                >
                  {barbershop.status?.isOpen
                    ? "Aberto agora"
                    : "Fechado no momento"}
                </span>
              </div>

              {barbershop.status?.reason && (
                <div className="border-primary/10 bg-secondary/30 relative mt-4 overflow-hidden rounded-xl border p-3">
                  <div className="bg-primary absolute top-0 left-0 h-full w-1" />
                  <div className="flex items-start gap-3">
                    <Megaphone size={14} className="text-primary mt-1 min-h-0 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-primary/80 text-[10px] font-bold uppercase">
                        Comunicado
                      </span>
                      <p className="text-foreground/80 text-xs font-medium">
                        {barbershop.status.reason}
                      </p>
                      {barbershop.status.closedUntil && (
                        <span className="text-muted-foreground text-[10px]">
                          Voltaremos em{" "}
                          {format(
                            new Date(barbershop.status.closedUntil),
                            "dd/MM/yyyy",
                            { locale: ptBR },
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
