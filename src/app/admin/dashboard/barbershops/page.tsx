import Link from "next/link"
import { Plus, Scissors } from "lucide-react"
import { Button } from "@/src/app/_components/ui/button"
import { getBarbershopsByOwner } from "./_actions/get-barbershops-by-owner.action"
import { AdminBarbershopManagementCard } from "../_components/admin-barbershop-management-card"
import { AppPagination } from "@/src/app/_components/pagination"

interface AdminBarbershopsPageProps {
  searchParams: Promise<{ page?: number; limit?: number }>
}

export default async function AdminBarbershopsPage({
  searchParams,
}: AdminBarbershopsPageProps) {
  const { page = 1, limit = 10 } = await searchParams
  const response = await getBarbershopsByOwner({
    page,
    limit,
  })
  const barbershops =
    response.success && "data" in response ? response.data.barbershops : []

  const meta =
    response.success && "data" in response
      ? response.data.meta
      : {
          total: 0,
          page: 1,
          limit: 12,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-screen-2xl flex-col">
      <section className="border-border border-b px-5 py-8 lg:px-8 xl:px-12">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
              Gerenciar
            </p>
            <h1 className="text-2xl leading-tight font-bold lg:text-3xl">
              Todas as <span className="text-primary">Barbearias</span>
            </h1>
            <p className="text-muted-foreground text-xs">
              {meta?.total ?? barbershops.length} unidades cadastradas
            </p>
          </div>
          <Button asChild size="sm" className="gap-2 rounded-xl">
            <Link href="/admin/dashboard/barbershops/new">
              <Plus className="h-4 w-4" />
              Nova barbearia
            </Link>
          </Button>
        </div>
      </section>

      <section className="flex-1 px-5 py-8 lg:px-8 xl:px-12">
        {barbershops.length === 0 ? (
          <div className="border-border bg-card flex flex-col items-center gap-3 rounded-2xl border py-16 text-center">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
              <Scissors className="text-primary h-6 w-6" />
            </div>
            <p className="text-foreground text-sm font-semibold">
              Nenhuma barbearia cadastrada
            </p>
            <Button asChild size="sm" className="gap-2 rounded-xl">
              <Link href="/admin/dashboard/barbershops/new">
                <Plus className="h-4 w-4" /> Criar primeira
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {barbershops.map((barbershop) => (
              <AdminBarbershopManagementCard
                key={barbershop.id}
                barbershop={barbershop}
              />
            ))}
          </div>
        )}
      </section>

      {meta.totalPages > 1 && (
        <section className="border-border border-t px-5 py-6 lg:px-8 xl:px-12">
          <AppPagination meta={meta} />
        </section>
      )}
    </div>
  )
}
