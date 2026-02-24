import Link from "next/link"
import Image from "next/image"
import { Plus, Scissors, Pencil, Trash2, Eye } from "lucide-react"
import { Button } from "@/src/app/_components/ui/button"
import { getBarbershopsByOwner } from "./_actions/get-barbershops-by-owner"

export default async function AdminBarbershopsPage() {
  const response = await getBarbershopsByOwner()
  const barbershops = response.data

  return (
    <div className="mx-auto max-w-screen-2xl">
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
              {barbershops.length} unidades cadastradas
            </p>
          </div>
          <Button asChild size="sm" className="gap-2 rounded-xl">
            <Link href="/admin/barbershops/new">
              <Plus className="h-4 w-4" />
              Nova barbearia
            </Link>
          </Button>
        </div>
      </section>

      <section className="px-5 py-8 lg:px-8 xl:px-12">
        <div className="border-border bg-card overflow-hidden rounded-2xl border">
          <div className="divide-border divide-y">
            {barbershops.map((b) => (
              <div key={b.id} className="flex items-center gap-4 px-5 py-4">
                <div className="border-border bg-primary/5 relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border">
                  {b.image ? (
                    <Image
                      src={b.image}
                      alt={b.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Scissors className="text-primary/40 h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground truncate text-sm font-semibold">
                      {b.name}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${b.isActive ? "bg-green-400/10 text-green-400" : "bg-border text-muted-foreground"}`}
                    >
                      {b.isActive ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                  <p className="text-muted-foreground truncate text-xs">
                    {b.address}
                  </p>
                  <p className="text-primary/70 text-xs">
                    {b.servicesCount} serviços
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <Link
                    href={`/barbershops/${b.slug}`}
                    className="border-border text-muted-foreground hover:border-primary/30 hover:text-primary flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={`/admin/barbershops/${b.id}/services`}
                    className="border-border text-muted-foreground hover:border-primary/30 hover:text-primary flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs transition-colors"
                  >
                    <Scissors className="h-3.5 w-3.5" />
                    Serviços
                  </Link>
                  <Link
                    href={`/admin/barbershops/${b.id}/edit`}
                    className="border-border text-muted-foreground hover:border-primary/30 hover:text-primary flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                  <button className="border-border text-muted-foreground hover:border-destructive/30 hover:text-destructive flex h-8 w-8 items-center justify-center rounded-lg border transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
