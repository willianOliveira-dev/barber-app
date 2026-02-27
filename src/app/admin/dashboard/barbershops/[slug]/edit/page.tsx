import { ArrowLeft, Scissors } from "lucide-react"
import Link from "next/link"
import { AdminBarbershopForm } from "../../../_components/admin-barbershop-form"
import { getBarbershopBySlug } from "@/src/app/barbershops/_actions/get-barbershop-by-slug.action"
import { notFound } from "next/navigation"
import { NewBarbershopFormData } from "../../_hooks/use-new-barbershop-form.hook"
import { hoursTransformer } from "@/src/app/_utils/hours-transformer.util"

interface UpdateBarbershopPageProps {
  params: Promise<{ slug: string }>
}

export default async function UpdateBarbershopPage({
  params,
}: UpdateBarbershopPageProps) {
  const { slug } = await params
  const response = await getBarbershopBySlug(slug)
  if (!response.success || !("data" in response)) notFound()

  const barbershop = response.data

  const defaultValues: Partial<NewBarbershopFormData> = {
    name: barbershop.name,
    description: barbershop.description ?? "",
    website: barbershop.website ?? "",
    address: barbershop.address,
    neighborhood: barbershop.neighborhood ?? "",
    streetNumber: barbershop.streetNumber ?? "",
    complement: barbershop.complement ?? "",
    zipCode: barbershop.zipCode ?? "",
    city: barbershop.city,
    state: barbershop.state,
    phone: barbershop.phone ?? "",
    email: barbershop.email ?? "",
    isActive: barbershop.isActive,
    image: barbershop.image ?? undefined,
    hours: hoursTransformer.transformHoursForEdit(barbershop.hours),
    status: barbershop.status
      ? {
          isOpen: barbershop.status.isOpen,
          reason: barbershop.status.reason ?? "",
          closedUntil: barbershop.status.closedUntil ?? undefined,
        }
      : {
          isOpen: true,
          reason: "",
          closedUntil: undefined,
        },
  }

  return (
    <div className="mx-auto max-w-screen-2xl">
      <section className="border-border border-b px-5 py-8 lg:px-8 xl:px-12">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard/barbershops"
            className="text-muted-foreground hover:text-primary flex items-center gap-1.5 text-xs transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Barbearias
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground text-xs font-medium">
            Editar barbearia
          </span>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
              Editar
            </p>
            <h1 className="text-2xl leading-tight font-bold lg:text-3xl">
              Editar <span className="text-primary">Barbearia</span>
            </h1>
          </div>
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
            <Scissors className="text-primary h-5 w-5" />
          </div>
        </div>
      </section>

      <section className="px-5 py-8 lg:px-8 xl:px-12">
        <AdminBarbershopForm
          isEditing={true}
          defaultValues={defaultValues}
          barbershopId={barbershop.id}
        />
      </section>
    </div>
  )
}
