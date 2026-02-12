import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { BarbershopItem } from "../_components/barbershop-item"
import { Header } from "../_components/header"
import { Search } from "../_components/search"
import { Footer } from "../_components/footer"
import { Button } from "../_components/ui/button"
import { QUICK_SEARCH_ALL_OPTIONS } from "../_constants/search"
import { AppPagination } from "../_components/pagination"
import Image from "next/image"
import Link from "next/link"
import { NoResultsCard } from "../_components/no-results-card"

interface BarbershopsPageProps {
  searchParams: Promise<{
    search?: string
    service: string
    page?: number
    limit?: number
  }>
}

export default async function BarbershopsPage({
  searchParams,
}: BarbershopsPageProps) {
  const { search = "", service = "", page = 1, limit = 12 } = await searchParams

  const { barbershops, meta } = await barbershopRepo.findByParams(
    search,
    service,
    page,
    limit,
  )

  const start = (meta.page - 1) * meta.limit + 1
  const end = Math.min(meta.page * meta.limit, meta.total)

  const activeService = service || "Todos"

  const createBarbershopServiceLink = (service: string) => {
    const params = new URLSearchParams()

    if (service.toLocaleLowerCase() !== "todos") {
      params.set("service", service)
      params.set("page", "1")
      params.set("limit", "12")
    }
    const query = params.toString()

    return query ? `/barbershops?${query}` : `/barbershops`
  }

  return (
    <>
      <Header />
      <main className="flex-1 space-y-6 p-5">
        <section className="flex items-center justify-center">
          <div className="container">
            <h1 className="text-2xl font-semibold">
              Todas as{" "}
              <span className="text-primary font-bold">Barbearias</span>
            </h1>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="container">
            <Search />
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="container flex flex-row items-center gap-2 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
            {QUICK_SEARCH_ALL_OPTIONS.map((option) => {
              const isActive =
                option.label.toLowerCase() === activeService.toLowerCase()
              return (
                <Button
                  key={option.label}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  className="flex items-center justify-start gap-4"
                >
                  <Link href={createBarbershopServiceLink(option.label)}>
                    <Image
                      alt={option.label}
                      src={option.icon}
                      width={16}
                      height={16}
                    />
                    {option.label}
                  </Link>
                </Button>
              )
            })}
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="container flex flex-col gap-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase">
              {meta.total}{" "}
              {search
                ? `resultados para "${search}"`
                : "barbearias disponíveis"}
            </h2>

            {meta.total > 0 && (
              <p className="text-muted-foreground text-xs">
                Mostrando {start}–{end}
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {barbershops.length > 0 ? (
                barbershops.map((barbershop) => (
                  <BarbershopItem key={barbershop.id} barbershop={barbershop} />
                ))
              ) : (
                <div className="col-span-full flex justify-center">
                  <NoResultsCard query={search} />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="container">
            <AppPagination meta={meta} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
