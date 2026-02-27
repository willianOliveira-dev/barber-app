import { ArrowLeft, Scissors } from "lucide-react"
import Link from "next/link"
import { AdminBarbershopForm } from "../../_components/admin-barbershop-form"

export default function NewBarbershopPage() {
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
            Nova barbearia
          </span>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
              Criar
            </p>
            <h1 className="text-2xl leading-tight font-bold lg:text-3xl">
              Nova <span className="text-primary">Barbearia</span>
            </h1>
          </div>
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
            <Scissors className="text-primary h-5 w-5" />
          </div>
        </div>
      </section>

      <section className="px-5 py-8 lg:px-8 xl:px-12">
        <AdminBarbershopForm />
      </section>
    </div>
  )
}
