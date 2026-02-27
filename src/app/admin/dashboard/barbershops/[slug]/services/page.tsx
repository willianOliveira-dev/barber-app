import { ArrowLeft, Scissors } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AppPagination } from "@/src/app/_components/pagination"
import { AdminBarbershopServicesClient } from "../../../_components/admin-barbershop-service-client"
import { getBarbershopBySlug } from "@/src/app/barbershops/_actions/get-barbershop-by-slug.action"
import { getBarbershopServicesByBarbershop } from "../../../../../barbershops/_actions/get-barbershop-services-by-barbershop.action"
import { getCategories } from "@/src/app/barbershops/_actions/get-categories.action"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; limit?: string }>
}

export default async function AdminBarbershopServicesPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page = "1", limit = "10" } = await searchParams

  const [barbershopRes, categoriesRes] = await Promise.all([
    getBarbershopBySlug(slug),
    getCategories(),
  ])

  const barbershop = barbershopRes.success && "data" in barbershopRes ? barbershopRes.data : null
  if (!barbershop) return notFound()

  const servicesResFixed = await getBarbershopServicesByBarbershop({
    barbershopId: barbershop.id,
    page: Number(page),
    limit: Number(limit),
  })

  const { services, meta } = servicesResFixed.success && "data" in servicesResFixed
    ? servicesResFixed.data
    : { services: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1, hasNextPage: false, hasPreviousPage: false } }

  const categories = categoriesRes.success && "data" in categoriesRes ? categoriesRes.data : []

  return (
    <div className="mx-auto max-w-screen-2xl">
      <section className="border-border border-b px-5 py-8 lg:px-8 xl:px-12">
        <div className="mb-4 flex items-center gap-3">
          <Link href="/admin/dashboard/barbershops" className="text-muted-foreground hover:text-primary flex items-center gap-1.5 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> Barbearias
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-muted-foreground text-xs">{barbershop.name}</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground text-xs font-medium">Serviços</span>
        </div>
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.18em]">{barbershop.name}</p>
            <h1 className="text-2xl font-bold leading-tight lg:text-3xl">Gerenciar <span className="text-primary">Serviços</span></h1>
            <p className="text-muted-foreground text-xs">{meta.total} {meta.total === 1 ? "serviço" : "serviços"} cadastrados</p>
          </div>
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl"><Scissors className="text-primary h-5 w-5" /></div>
        </div>
      </section>

      <section className="px-5 py-8 lg:px-8 xl:px-12">
        <AdminBarbershopServicesClient services={services} barbershopId={barbershop.id} barbershopSlug={barbershop.slug} categories={categories} pagination={meta} />
      </section>

      {meta.totalPages > 1 && (
        <section className="border-border border-t px-5 py-6 lg:px-8 xl:px-12">
          <AppPagination meta={meta} />
        </section>
      )}
    </div>
  )
}