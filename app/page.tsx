import Image from "next/image"
import { Button } from "./_components/ui/button"
import { Header } from "./_components/ui/header"
import { Input } from "./_components/ui/input"
import { SearchIcon } from "lucide-react"

export default function Home() {
  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">Olá, Willian!</h2>
        <p>Segunda-feira, 05 de agosto.</p>

        <div className="mt-6 flex flex-row items-center gap-2">
          <Input placeholder="Faça sua busca..." />
          <Button size="icon">
            <SearchIcon />
          </Button>
        </div>

        <div className="relative mt-6 h-37.5 w-full rounded-xl">
          <Image
            alt="Agende nos melhores com Razor Barber"
            src="/banner-01.png"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        <div></div>
      </div>
    </div>
  )
}
