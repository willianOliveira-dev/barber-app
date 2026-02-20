import { BarbershopServiceItem } from "@/src/app/_components/barbershop-service-item"
import { Copy } from "@/src/app/_components/copy"
import { Footer } from "@/src/app/_components/footer"
import { Menu } from "@/src/app/_components/menu"
import { Button } from "@/src/app/_components/ui/button"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { categoryRepo } from "@/src/repositories/category.repository"
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
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BarbershopPageProps {
  params: Promise<{ slug: string }>
}

export default async function BarbershopDetailPage({
  params,
}: BarbershopPageProps) {
  const { slug } = await params
  const barbershop = await barbershopRepo.findBySlug(slug)
  const categories = await categoryRepo.findAll()

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
          {barbershop?.image ? (
            <Image
              src={barbershop.image}
              alt={barbershop.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <Image
              src="/default.png"
              alt="Sem imagem"
              fill
              className="object-cover"
            />
          )}

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
                {barbershop?.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <MapPinHouse className="text-primary h-3.5 w-3.5" />
                  {barbershop?.address}, {barbershop?.streetNumber}
                  {barbershop?.complement
                    ? ` - ${barbershop.complement}`
                    : ""}{" "}
                  — {barbershop?.city}, {barbershop?.state}
                </span>
                <span className="border-primary/20 bg-primary/10 text-primary flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  <StarIcon className="fill-primary h-3 w-3" />
                  5,0 · 889 avaliações
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
                <div>
                  <h2 className="text-sm font-semibold tracking-wide uppercase">
                    Sobre <span className="text-primary">nós</span>
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {barbershop?.description ?? "Sem descrição"}
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
                    {barbershop?.services.length ?? 0} serviços
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {barbershop?.services.map((service) => (
                  <BarbershopServiceItem
                    key={service.id}
                    barbershopSlug={barbershop.slug}
                    barbershopName={barbershop.name}
                    service={service}
                  />
                ))}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-4 lg:w-80 lg:shrink-0 xl:w-85">
            <div className="border-border bg-card rounded-2xl border p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <Phone className="text-primary h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-wide uppercase">
                    Contato
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    Fale com a gente
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {barbershop?.phone && (
                  <div className="border-border bg-background/50 flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <Smartphone className="text-primary h-3.5 w-3.5 shrink-0" />
                      <span className="font-medium">{barbershop.phone}</span>
                    </div>
                    <Copy message={barbershop.phone} />
                  </div>
                )}
                {barbershop?.email && (
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

                {!barbershop?.phone && !barbershop?.email && (
                  <p className="text-muted-foreground text-xs">Sem contato</p>
                )}
              </div>
            </div>

            <div className="border-border bg-card rounded-2xl border p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <Clock className="text-primary h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-wide uppercase">
                    Horários
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    Programação semanal
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {barbershop && barbershop.hours.length > 0 ? (
                  barbershop.hours
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
                        {hour.isOpen ? (
                          <span className="text-foreground font-medium">
                            {hour.openingTime} — {hour.closingTime}
                          </span>
                        ) : (
                          <span className="text-destructive font-semibold uppercase">
                            Fechado
                          </span>
                        )}
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
                {barbershop?.statusHistory?.[0]?.isOpen !== false ? (
                  <>
                    <span className="block h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    <span className="text-foreground font-semibold">
                      Aberto agora
                    </span>
                  </>
                ) : (
                  <>
                    <span className="bg-destructive block h-2 w-2 rounded-full" />
                    <span className="text-destructive font-semibold">
                      Fechado no momento
                    </span>
                  </>
                )}
              </div>
              <p className="text-muted-foreground mt-2 text-[10px] leading-relaxed">
                {barbershop?.statusHistory?.[0]?.reason ||
                  "Agende seu horário online com antecedência."}
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
