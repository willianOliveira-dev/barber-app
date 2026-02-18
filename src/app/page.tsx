import { Button } from "./_components/ui/button"
import { Header } from "./_components/header"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { BarbershopItem } from "./_components/barbershop-item"
import { BookingItem } from "./_components/booking-item"
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

export default async function Home() {
  const session = await getServerSession(authOptions)
  const user = session?.user ? session.user : undefined
  const userId = user ? user.id : undefined
  const barbershops = await barbershopRepo.findAll()
  const categories = await categoryRepo.findAll()

  let latestBooking: BookingWithRelations | undefined = undefined

  if (userId) {
    latestBooking = await bookingRepo.findLatestByUser(userId)
  }

  const createBarbershopServiceLink = (categorySlug: string) => {
    const params = new URLSearchParams()
    params.set("category", categorySlug)
    params.set("page", "1")
    params.set("limit", "12")
    return `/barbershops?${params.toString()}`
  }

  return (
    <>
      <Header />
      <main className="flex-1 space-y-6 p-5">
        {user && (
          <section className="flex items-center justify-center">
            <div className="container flex flex-col gap-2">
              <h2 className="text-xl font-bold">Olá, {user.name}</h2>
              <p className="text-md text-gray-400">
                {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
          </section>
        )}

        <section className="flex items-center justify-center">
          <div className="container">
            <Search />
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="container flex flex-row items-center gap-2 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
              <Button
                key={category.name}
                asChild
                variant="ghost"
                className="flex items-center justify-start gap-4"
              >
                <Link href={createBarbershopServiceLink(category.slug)}>
                  <Image
                    alt={category.name}
                    src={category.icon!}
                    width={16}
                    height={16}
                  />
                  {category.name}
                </Link>
              </Button>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center md:hidden">
          <div className="container">
            <div className="relative h-37.5 w-full rounded-xl">
              <Image
                alt="Agende nos melhores com Razor Barber"
                src="/images/banner-01.png"
                fill
                className="rounded-xl object-cover object-center"
              />
            </div>
          </div>
        </section>

        {latestBooking && (
          <section className="flex items-center justify-center">
            <div className="container flex flex-col gap-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase">
                Agendemantos
              </h3>
              <Link
                className="text-primary hover:text-primary/85 self-end text-sm"
                href="/bookings"
              >
                Ver mais
              </Link>
              <BookingItem booking={latestBooking} />
            </div>
          </section>
        )}

        <section className="flex items-center justify-center">
          <div className="container flex flex-col gap-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase">
              Recomendados
            </h2>

            <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
              {barbershops.map((barbershop) => (
                <BarbershopItem key={barbershop.id} barbershop={barbershop} />
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="container flex flex-col gap-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase">
              Populares
            </h2>
            <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
              {barbershops.map((barbershop) => (
                <BarbershopItem key={barbershop.id} barbershop={barbershop} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
