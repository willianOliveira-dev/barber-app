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

        <section className="relative h-37.5 w-full rounded-xl">
          <Image
            alt="Agende nos melhores com Razor Barber"
            src="/banner-01.png"
            fill
            className="rounded-xl object-cover"
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase">
            Agendemantos
          </h2>
          <div>
            <Card className="p-0">
              <CardContent className="flex justify-between p-0">
                <div className="flex flex-col gap-2 p-6">
                  <Badge className="w-fit">Confirmado</Badge>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold">Corte de Cabelo</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-10">
                        <AvatarImage src="https://t3.ftcdn.net/jpg/02/94/29/86/360_F_294298678_i3y46pvuAsGQsfSQw047Yqmvdr74kyfJ.jpg" />
                      </Avatar>
                      <p className="text-sm">Barbershop</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center border-l-2 border-solid p-6">
                  <p className="text-sm">Fevereiro</p>
                  <p className="text-2xl">09</p>
                  <p className="text-sm">09:45</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

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
    </div>
  )
}
