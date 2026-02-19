import { Header } from "./_components/header"
import { Sidebar } from "./_components/sidebar"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { BarbershopItem } from "./_components/barbershop-item"
import { Footer } from "./_components/footer"
import { Search } from "./_components/search"
import { categoryRepo } from "@/src/repositories/category.repository"
import {
  bookingRepo,
  BookingWithRelations,
} from "../repositories/booking.repository"
import { authOptions } from "./_lib/auth.lib"
import { getServerSession } from "next-auth"
import { ptBR } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { RebookItem } from "./_components/rebooking-item"
import {
  CalendarCheck,
  Star,
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin,
} from "lucide-react"
import { NearbyBarbershopsHomeSection } from "./_components/nearby-barbershop-home-section"

export default async function Home() {
  const session = await getServerSession(authOptions)
  const user = session?.user
  const userId = user?.id
  const barbershops = await barbershopRepo.findAll()
  const categories = await categoryRepo.findAll()

  let latestBookings: BookingWithRelations[] = []
  if (userId) {
    latestBookings = await bookingRepo.findLatestByUser(userId)
  }

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
      <Header />
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar
          today={today}
          greeting={greeting}
          userName={user?.name?.split(" ")[0]}
          isLoggedIn={!!user}
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
                  {greeting},{" "}
                  <span className="text-primary">
                    {user.name.split(" ")[0]}
                  </span>
                </h2>
              </div>
            )}
            <Search />
          </div>

          <section className="pt-3 pb-1 lg:hidden">
            <div className="scroll-container scroll-snap scroll-fade flex gap-2 px-5">
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
            <section className="border-primary/20 from-primary/20 via-primary/5 relative overflow-hidden rounded-2xl border bg-linear-to-br to-transparent p-6 lg:p-10">
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden
              >
                <div className="border-primary/10 absolute -top-20 -right-20 h-64 w-64 rounded-full border" />
                <div className="border-primary/10 absolute -right-10 -bottom-10 h-40 w-40 rounded-full border" />
              </div>
              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2 lg:space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary h-px w-8" />
                    <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
                      Premium
                    </span>
                  </div>
                  <h2 className="text-2xl leading-tight font-bold lg:text-4xl xl:text-5xl">
                    O melhor corte
                    <br />
                    <span className="text-primary">começa aqui.</span>
                  </h2>
                  <p className="text-muted-foreground max-w-sm text-sm lg:text-base">
                    Encontre barbearias premium perto de você e agende em
                    segundos.
                  </p>
                </div>
                <div className="flex flex-row gap-3 lg:flex-col lg:items-stretch">
                  <Link
                    href="/barbershops"
                    className="bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                  >
                    Explorar barbearias <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/barbershops?nearby=true"
                    className="border-border bg-card hover:border-primary/40 inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition-colors"
                  >
                    <MapPin className="text-primary h-4 w-4" />
                    Perto de mim
                  </Link>
                </div>
              </div>
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
                <div className="scroll-container scroll-fade flex gap-4">
                  {latestBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="scroll-item w-75 shrink-0 lg:w-1/3"
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
              <div className="scroll-container scroll-snap scroll-fade flex gap-4 lg:hidden">
                {barbershops.slice(0, 8).map((barbershop) => (
                  <div
                    key={barbershop.id}
                    className="scroll-item w-43.75 shrink-0"
                  >
                    <BarbershopItem barbershop={barbershop} />
                  </div>
                ))}
              </div>
              <div className="hidden gap-4 lg:grid lg:grid-cols-3 xl:grid-cols-4">
                {barbershops.slice(0, 8).map((barbershop) => (
                  <BarbershopItem key={barbershop.id} barbershop={barbershop} />
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
                      Mais agendadas esta semana
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
              <div className="scroll-container scroll-snap scroll-fade flex gap-4 lg:hidden">
                {barbershops.slice(0, 8).map((barbershop) => (
                  <div
                    key={barbershop.id}
                    className="scroll-item w-43.75 shrink-0"
                  >
                    <BarbershopItem barbershop={barbershop} />
                  </div>
                ))}
              </div>
              <div className="hidden gap-4 lg:grid lg:grid-cols-3 xl:grid-cols-4">
                {barbershops.slice(0, 4).map((barbershop) => (
                  <BarbershopItem key={barbershop.id} barbershop={barbershop} />
                ))}
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
          </div>
        </main>
      </div>

      <Footer />
    </>
  )
}
