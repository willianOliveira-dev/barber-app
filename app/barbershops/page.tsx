import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { BarbershopItem } from "../_components/barbershop-item"
import { Header } from "../_components/header"
import { Search } from "../_components/search"
import { Footer } from "../_components/footer"

interface BarbershopsPageProps {
  searchParams: Promise<{ search: string }>
}

export default async function BarbershopsPage({
  searchParams,
}: BarbershopsPageProps) {
  const { search } = await searchParams
  const barbershops = await barbershopRepo.findByParams(search)

  return (
    <>
      <Header />
      <main className="flex-1 space-y-6 p-5">
        <section className="flex items-center justify-center">
          <div className="container">
            <Search />
          </div>
        </section>
        <section className="flex items-center justify-center">
          <div className="container flex flex-col gap-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase">
              Resultados para &quot;{search}&quot;
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {barbershops.length > 0 ? (
                barbershops.map((barbershop) => (
                  <BarbershopItem key={barbershop.id} barbershop={barbershop} />
                ))
              ) : (
                <div>Não há resultados para está busca</div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
