import { BarbershopItem } from "../_components/barbershop-item"
import { Header } from "../_components/header"
import { Search } from "../_components/search"
import { Footer } from "../_components/footer"
import { AppPagination } from "../_components/pagination"
import { NoResultsCard } from "../_components/no-results-card"
import { LayoutGrid, SlidersHorizontal } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { categorySv } from "@/src/services/category.service"
import { barbershopSv } from "@/src/services/barbershop.service"
import Image from "next/image"
import Link from "next/link"

interface BarbershopsPageProps {
  searchParams: Promise<{
    search?: string
    category: string
    page?: number
    limit?: number
  }>
}

export default async function BarbershopsPage({
  searchParams,
}: BarbershopsPageProps) {
  const {
    search = "",
    category = "",
    page = 1,
    limit = 12,
  } = await searchParams

  const { barbershops, meta } = await barbershopSv.getBarbershopsWithPagination(
    search,
    category,
    page,
    limit,
  )

  const categories = await categorySv.getCategories()

  const categoriesWithAll = [
    { id: "all", name: "Todos", slug: "todos", icon: "/icons/all.svg" },
    ...categories,
  ]

  const start = (meta.page - 1) * meta.limit + 1
  const end = Math.min(meta.page * meta.limit, meta.total)
  const activeCategory = category || "todos"

  const createCategoryLink = (slug: string) => {
    const params = new URLSearchParams()
    if (slug.toLowerCase() !== "todos") {
      params.set("category", slug)
      params.set("page", "1")
      params.set("limit", "12")
    }
    const query = params.toString()
    return query ? `/barbershops?${query}` : `/barbershops`
  }

  return (
    <>
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-screen-2xl">
          <section className="border-border border-b px-5 py-8 lg:px-8 xl:px-12">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
                  Explorar
                </p>
                <h1 className="text-2xl leading-tight font-bold lg:text-3xl xl:text-4xl">
                  Todas as <span className="text-primary">Barbearias</span>
                </h1>
                {meta.total > 0 && (
                  <p className="text-muted-foreground text-xs">
                    {meta.total}{" "}
                    {search
                      ? `resultados para "${search}"`
                      : "barbearias disponíveis"}{" "}
                    · Mostrando {start}–{end}
                  </p>
                )}
              </div>

              <div className="w-full max-w-sm lg:w-[320px] xl:w-95">
                <Search />
              </div>
            </div>
          </section>

          <section className="border-border border-b px-5 py-3">
            <div className="scroll-container scroll-fade -mx-5 flex items-center gap-2 overflow-x-auto px-5 py-3 lg:mx-0 lg:px-8 xl:px-12">
              {categoriesWithAll.map((cat) => {
                const isActive =
                  cat.slug.toLowerCase() === activeCategory.toLowerCase()
                return (
                  <Link
                    key={cat.id}
                    href={createCategoryLink(cat.slug)}
                    className={twMerge(
                      "scroll-item flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium whitespace-nowrap transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary border",
                    )}
                  >
                    {cat.icon && (
                      <Image
                        alt={cat.name}
                        src={cat.icon}
                        width={13}
                        height={13}
                        className={
                          isActive ? "brightness-0 invert" : "opacity-60"
                        }
                      />
                    )}
                    {cat.name}
                  </Link>
                )
              })}
            </div>
          </section>

          <section className="px-5 py-8 lg:px-8 xl:px-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <LayoutGrid className="text-primary h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-wide uppercase">
                    {search ? (
                      <>
                        Resultados para{" "}
                        <span className="text-primary">
                          &quot;{search}&quot;
                        </span>
                      </>
                    ) : activeCategory !== "todos" ? (
                      <>
                        Categoria{" "}
                        <span className="text-primary">{activeCategory}</span>
                      </>
                    ) : (
                      <>
                        Todas as{" "}
                        <span className="text-primary">barbearias</span>
                      </>
                    )}
                  </p>
                  {meta.total > 0 && (
                    <p className="text-muted-foreground text-xs">
                      {meta.total} encontradas · página {meta.page} de{" "}
                      {meta.totalPages}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-border bg-card text-muted-foreground hidden items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs sm:flex">
                <SlidersHorizontal className="text-primary h-3.5 w-3.5" />
                {limit} por página
              </div>
            </div>

            {barbershops.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {barbershops.map((barbershop) => (
                  <BarbershopItem key={barbershop.id} barbershop={barbershop} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-16">
                <NoResultsCard query={search} />
              </div>
            )}
          </section>

          {meta.totalPages > 1 && (
            <section className="border-border border-t px-5 py-6 lg:px-8 xl:px-12">
              <AppPagination meta={meta} />
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
