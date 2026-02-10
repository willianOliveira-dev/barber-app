import Image from "next/image"
import { Button } from "./_components/ui/button"
import { Header } from "./_components/header"
import { Input } from "./_components/ui/input"
import { SearchIcon } from "lucide-react"
import { barbershopsRepo } from "@/src/repositories/barbershop.repository"
import { BarberShopItem } from "./_components/barbershop-item"
import { QUICK_SEARCH_OPTIONS } from "./_constants/search"
import { BookingItem } from "./_components/booking-item"
import { Footer } from "./_components/footer"

export default async function Home() {
  const barbershops = await barbershopsRepo.findAll()

  return (
    <>
      <Header />
      <main className="space-y-6 p-5">
        <section className="flex items-center justify-center">
          <div className="container flex flex-col gap-2">
            <h2 className="text-xl font-bold">Olá, Willian!</h2>
            <p>Segunda-feira, 09 de Fevereiro.</p>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="container flex flex-row items-center gap-2">
            <Input placeholder="Faça sua busca..." />
            <Button size="icon">
              <SearchIcon />
            </Button>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="container flex flex-row items-center gap-2 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
            {QUICK_SEARCH_OPTIONS.map((option) => (
              <Button key={option.label} variant="secondary" className="flex-1">
                <span className="relative block size-4">
                  <Image
                    alt={option.label}
                    src={option.icon}
                    fill
                    className="object-contain"
                  ></Image>
                </span>
                {option.label}
              </Button>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center md:hidden">
          <div className="container">
            <div className="relative h-37.5 w-full rounded-xl">
              <Image
                alt="Agende nos melhores com Razor Barber"
                src="/banner-01.png"
                fill
                className="rounded-xl object-cover object-center"
              />
            </div>
          </div>
        </section>

        <BookingItem />

        <section className="flex items-center justify-center">
          <div className="container flex flex-col gap-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase">
              Recomendados
            </h2>

            <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
              {barbershops.map((barbershop) => (
                <BarberShopItem key={barbershop.id} barbershop={barbershop} />
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
                <BarberShopItem key={barbershop.id} barbershop={barbershop} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
