"use client"

import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  CalendarCheck,
  Star,
  ArrowRight,
  TrendingUp,
  Scissors,
  MapPin,
  AlertCircle,
  Clock,
} from "lucide-react"

import { Sidebar } from "./sidebar"
import { Search } from "./search"
import { Footer } from "./footer"
import { RebookItem } from "./rebooking-item"
import { FeaturedBarbershopCard } from "./featured-barbershop-item"
import { NearbyBarbershopsHomeSection } from "./nearby-barbershop-home-section"
import { Session } from "next-auth"
import type {
  BarbershopSummary,
  Category,
  PopularBarbershop,
} from "@/src/db/types"
import type { BookingWithRelations } from "@/src/db/types/booking.type"
import HeaderClient from "./header-client"

interface HomeClientProps {
  user?: Session["user"]
  categories: Category[]
  recommendedBarbershops: BarbershopSummary[]
  popularBarbershops: PopularBarbershop[]
  latestBookings: BookingWithRelations[]
}

export default function HomeClient({
  user,
  categories,
  recommendedBarbershops,
  popularBarbershops,
  latestBookings,
}: HomeClientProps) {
  const createLink = (slug: string) => {
    const params = new URLSearchParams()
    params.set("category", slug)
    params.set("page", "1")
    params.set("limit", "12")
    return `/barbershops?${params}`
  }

  const today = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite"

  return (
    <>
      <HeaderClient user={user} categories={categories} />
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar
          today={today}
          greeting={greeting}
          userName={user?.name?.split(" ")[0]}
          isAutenticated={!!user}
          categories={categories}
        />
        <main className="min-w-0 flex-1">
          <div className="space-y-4 px-5 pt-6 pb-2 lg:hidden">
            {user && (
              <div>
                <p className="text-muted-foreground text-[11px] tracking-widest uppercase">
                  {today}
                </p>
                <h2 className="text-2xl font-bold">
                  {greeting},
                  <span className="text-primary">
                    {user.name.split(" ")[0]}
                  </span>
                </h2>
              </div>
            )}
            <Search />
          </div>
          <section className="px-5 py-6 pt-3 pb-1 lg:hidden">
            <div className="scroll-container scroll-snap scroll-fade -mx-5 flex gap-2 overflow-x-auto px-5 pb-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={createLink(category.slug)}
                  className="scroll-item border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors"
                >
                  <Image
                    src={category.icon!}
                    alt={category.name}
                    width={13}
                    height={13}
                  />
                  {category.name}
                </Link>
              ))}
            </div>
          </section>
          <div className="space-y-10 px-5 py-6 lg:space-y-12 lg:px-8 lg:py-10 xl:px-12">
            <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl">
              <div className="absolute inset-0 h-full w-full">
                <Image
                  src="/images/barbershop-hero.png"
                  alt="Barbearia Hero"
                  fill
                  priority
                  loading="eager"
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 1200px"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-black/40 lg:bg-linear-to-r lg:from-black lg:via-black/60 lg:to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/40 lg:bg-linear-to-t lg:from-black/60" />
              </div>
              <div className="relative z-10 flex min-h-100 flex-col justify-center px-6 py-12 lg:min-h-125 lg:px-16 lg:py-20 xl:px-24">
                <div className="max-w-2xl space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
                    <Scissors className="text-primary h-4 w-4" />
                    <span className="text-xs font-semibold tracking-[0.2em] text-white uppercase">
                      Premium
                    </span>
                  </div>
                  <h1 className="text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                    O melhor corte
                    <br />
                    <span className="text-primary">começa aqui.</span>
                  </h1>
                  <p className="text-base text-gray-300 sm:text-lg lg:text-xl">
                    Encontre as melhores barbearias da sua cidade e agende seu
                    horário em segundos. Sem espera, sem complicação.
                  </p>
                  <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                    <Link
                      href="/barbershops"
                      className="group bg-primary text-primary-foreground shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/30 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold shadow-lg transition-all hover:shadow-xl"
                    >
                      Explorar barbearias
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/register-barbershop"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
                    >
                      <MapPin className="h-4 w-4" />
                      Ver no mapa
                    </Link>
                  </div>
                </div>
              </div>
              <div className="from-primary via-primary/60 absolute right-0 bottom-0 left-0 h-1 bg-linear-to-r to-transparent" />
            </section>
            {latestBookings.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                      <CalendarCheck className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold tracking-wide uppercase">
                        Seus <span className="text-primary">Agendamentos</span>
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        Próximas visitas
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/bookings"
                    className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
                  >
                    Ver todos <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="scroll-container scroll-snap scroll-fade -mx-5 flex gap-4 overflow-x-auto px-5 pb-4 lg:mx-0 lg:px-0 lg:pb-0">
                  {latestBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="scroll-item w-[calc(100vw-2.5rem)] shrink-0 lg:w-1/3"
                    >
                      <RebookItem booking={booking} />
                    </div>
                  ))}
                </div>
              </section>
            )}
            <NearbyBarbershopsHomeSection />
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <Star className="text-primary h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold tracking-wide uppercase">
                      Mais <span className="text-primary">Recomendados</span>
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      Avaliações mais altas
                    </p>
                  </div>
                </div>
                <Link
                  href="/barbershops"
                  className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
                >
                  Ver todos <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="scroll-container scroll-snap scroll-fade -mx-5 flex gap-4 overflow-x-auto px-5 pb-4 lg:hidden">
                {recommendedBarbershops.slice(0, 8).map((barbershop) => (
                  <div
                    key={barbershop.id}
                    className="scroll-item w-[calc(100vw-2.5rem)] shrink-0"
                  >
                    <FeaturedBarbershopCard
                      barbershop={barbershop}
                      variant="recommended"
                    />
                  </div>
                ))}
              </div>
              <div className="hidden gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {recommendedBarbershops.slice(0, 8).map((barbershop) => (
                  <FeaturedBarbershopCard
                    key={barbershop.id}
                    barbershop={barbershop}
                    variant="recommended"
                  />
                ))}
              </div>
            </section>
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <TrendingUp className="text-primary h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold tracking-wide uppercase">
                      Barbearias <span className="text-primary">Populares</span>
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      Os mais agendados
                    </p>
                  </div>
                </div>
                <Link
                  href="/barbershops"
                  className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
                >
                  Ver todas <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="scroll-container scroll-snap scroll-fade -mx-5 flex gap-4 overflow-x-auto px-5 pb-4 lg:hidden">
                {popularBarbershops.slice(0, 8).map((barbershop) => (
                  <div
                    key={barbershop.id}
                    className="scroll-item w-[calc(100vw-2.5rem)] shrink-0"
                  >
                    <FeaturedBarbershopCard
                      barbershop={barbershop}
                      variant="popular"
                    />
                  </div>
                ))}
              </div>
              <div className="hidden gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {popularBarbershops.slice(0, 4).map((barbershop) => (
                  <FeaturedBarbershopCard
                    key={barbershop.id}
                    barbershop={barbershop}
                    variant="popular"
                  />
                ))}
              </div>
            </section>
            <section className="hidden gap-4 lg:grid lg:grid-cols-2">
              <div className="group border-border bg-card hover:border-primary/30 relative overflow-hidden rounded-2xl border p-6 transition-colors">
                <div className="bg-primary/10 mb-4 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Clock className="text-primary h-5 w-5" />
                </div>
                <h4 className="mb-2 text-base font-semibold">
                  Agendamento em 60 segundos
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Escolha o horário, confirme e pronto. Sem ligações, sem
                  espera, sem complicação.
                </p>
                <div className="bg-primary/5 pointer-events-none absolute right-0 bottom-0 h-24 w-24 translate-x-6 translate-y-6 rounded-full transition-transform group-hover:translate-x-4 group-hover:translate-y-4" />
              </div>
              <div className="group border-border bg-card hover:border-primary/30 relative overflow-hidden rounded-2xl border p-6 transition-colors">
                <div className="bg-primary/10 mb-4 flex h-10 w-10 items-center justify-center rounded-xl">
                  <TrendingUp className="text-primary h-5 w-5" />
                </div>
                <h4 className="mb-2 text-base font-semibold">
                  Profissionais verificados
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Todas as barbearias passam por verificação. Você encontra só
                  os melhores da sua cidade.
                </p>
                <div className="bg-primary/5 pointer-events-none absolute right-0 bottom-0 h-24 w-24 translate-x-6 translate-y-6 rounded-full transition-transform group-hover:translate-x-4 group-hover:translate-y-4" />
              </div>
            </section>
            <section className="border-border bg-card relative overflow-hidden rounded-2xl border p-6 lg:p-8">
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden
              >
                <div className="bg-primary/5 absolute -top-8 -left-8 h-40 w-40 rounded-full" />
                <div className="bg-primary/5 absolute -right-4 -bottom-4 h-28 w-28 rounded-full" />
              </div>
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-primary text-xs font-semibold tracking-widest uppercase">
                    Para profissionais
                  </p>
                  <h3 className="text-lg font-bold lg:text-2xl">
                    Tem uma barbearia?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Cadastre seu negócio e alcance novos clientes todo dia.
                  </p>
                </div>
                <Link
                  href="/register-barbershop"
                  className="border-primary bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground inline-flex shrink-0 items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-colors"
                >
                  Cadastrar barbearia <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
            <section className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/5 p-4 lg:p-6">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                aria-hidden
              >
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full border border-red-500/20" />
                <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full border border-red-500/20" />
              </div>
              <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                    <AlertCircle className="text-red-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tracking-[0.2em] text-red-500 uppercase">
                        Aviso Importante
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Este site foi desenvolvido exclusivamente para{" "}
                      <span className="text-foreground font-medium">
                        fins de estudo e portfólio
                      </span>{" "}
                      por{" "}
                      <Link
                        href="https://github.com/willianOliveira-dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-red-500 underline decoration-red-500/30 underline-offset-2 transition-colors hover:text-red-400"
                      >
                        Willian dos Santos Oliveira
                      </Link>
                      . Todas as barbearias, imagens, avaliações e dados
                      apresentados são{" "}
                      <span className="text-foreground font-medium">
                        fictícios
                      </span>{" "}
                      e não representam estabelecimentos reais.
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-linear-to-r from-red-500 via-red-500/60 to-transparent" />
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
