import Image from "next/image"
import { Button } from "./_components/ui/button"
import { Header } from "./_components/header"
import { Input } from "./_components/ui/input"
import { SearchIcon } from "lucide-react"
import { Card, CardContent } from "./_components/ui/card"
import { Badge } from "./_components/ui/badge"
import { Avatar, AvatarImage } from "./_components/ui/avatar"
import { barbershopsRepo } from "@/src/repositories/barbershop.repository"
import { BarberShopItem } from "./_components/barbershop-item"
import { Footer } from "./_components/footer"
import { QUICK_SEARCH_OPTIONS } from "./_constants/search"
import { BookingItem } from "./_components/booking-item"

export default async function Home() {
  const barbershops = await barbershopsRepo.findAll()

  return (
    <div>
      <Header />
      <main className="space-y-6 p-5">
        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">Olá, Willian!</h2>
          <p>Segunda-feira, 09 de Fevereiro.</p>
        </section>

        <section className="flex flex-row items-center gap-2">
          <Input placeholder="Faça sua busca..." />
          <Button size="icon">
            <SearchIcon />
          </Button>
        </section>

        <section className="flex items-center gap-2 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
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
        </section>

        <section className="relative h-37.5 w-full rounded-xl">
          <Image
            alt="Agende nos melhores com Razor Barber"
            src="/banner-01.png"
            fill
            className="rounded-xl object-cover"
          />
        </section>

        <BookingItem />

        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase">
            Recomendados
          </h2>

          <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
            {barbershops.map((barbershop) => (
              <BarberShopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase">
            Populares
          </h2>

          <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
            {barbershops.map((barbershop) => (
              <BarberShopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
