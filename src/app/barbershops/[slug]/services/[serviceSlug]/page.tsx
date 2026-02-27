import { getServerSession } from "next-auth"
import { authOptions } from "@/src/app/_lib/auth.lib"
import { format } from "date-fns"
import { Header } from "@/src/app/_components/header"
import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  Clock,
  House,
  Info,
  Tag,
} from "lucide-react"
import { Badge } from "@/src/app/_components/ui/badge"
import { cn } from "@/src/app/_lib/utils.lib"
import { BarbershopServiceBookingPanel } from "@/src/app/_components/barbershop-service-booking-panel"
import { ptBR } from "date-fns/locale"
import { getBarbershopBySlug } from "../../../_actions/get-barbershop-by-slug.action"
import { notFound } from "next/navigation"
import { getBarbershopServiceBySlug } from "../../../_actions/get-barbershop-service-by-slug.action"
import { formatDuration } from "@/src/app/_utils/format-duration.util"
import { priceFormatter } from "@/src/app/_utils/price-formatter.util"
import { Footer } from "react-day-picker"
import Image from "next/image"
import Link from "next/link"

interface BarbershopServicePageProps {
  params: Promise<{ slug: string; serviceSlug: string }>
}

export default async function BarbershopServiceDetailPage({
  params,
}: BarbershopServicePageProps) {
  const { slug, serviceSlug } = await params
  const session = await getServerSession(authOptions)
  const user = session?.user

  const [barbershopResponse, barbershopServiceResponse] = await Promise.all([
    getBarbershopBySlug(slug),
    getBarbershopServiceBySlug(serviceSlug),
  ])

  if (!barbershopResponse.success || !barbershopServiceResponse.success) {
    return notFound()
  }

  const barbershop = barbershopResponse.data
  const service =
    "data" in barbershopServiceResponse ? barbershopServiceResponse.data : null

  if (!service) return notFound()

  const durationLabel = formatDuration(service.durationMinutes)

  const metaItems = [
    {
      icon: Clock,
      label: "Duração",
      value: durationLabel,
    },
    {
      icon: House,
      label: "Barbearia",
      value: barbershop.name,
    },
    {
      icon: CalendarCheck,
      label: "Disponibilidade",
      value: service.isActive ? "Disponível" : "Indisponível",
      highlight: service.isActive,
    },
    {
      icon: Tag,
      label: "Categoria",
      value: service.category?.name ?? "Sem categoria",
    },
    {
      icon: Info,
      label: "Criado em",
      value: format(new Date(service.createdAt), "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      }),
    },
  ]

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-screen-2xl">
          <div className="border-border flex items-center gap-3 border-b px-5 py-4 lg:px-8 xl:px-12">
            <Link
              href={`/barbershops/${slug}`}
              className="text-muted-foreground hover:text-primary flex items-center gap-1.5 text-xs transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {barbershop.name}
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-foreground truncate text-xs font-medium">
              {service.name}
            </span>
          </div>

          <div className="grid gap-8 px-5 py-8 lg:grid-cols-3 lg:px-8 lg:py-10 xl:px-12">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <div className="relative h-65 w-full overflow-hidden rounded-2xl sm:h-85 lg:h-100">
                <Image
                  src={service.image || "/images/default.png"}
                  alt={service.image ? service.name : "Sem Imagem"}
                  fill
                  quality={90}
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  {service.isActive ? (
                    <Badge className="flex items-center gap-1.5 border border-green-400/20 bg-green-400/10 px-2.5 py-1 text-xs font-semibold text-green-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Disponível
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="border-border border text-xs"
                    >
                      Indisponível
                    </Badge>
                  )}
                </div>

                <div className="absolute right-5 bottom-4 left-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs font-medium tracking-widest text-white/60 uppercase">
                      Serviço
                    </p>
                    <h1 className="text-2xl leading-tight font-bold text-white sm:text-3xl lg:text-4xl">
                      {service.name}
                    </h1>
                  </div>
                  <div className="shrink-0 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 backdrop-blur-sm">
                    <p className="text-[10px] font-medium tracking-widest text-white/50 uppercase">
                      Valor
                    </p>
                    <p className="text-primary text-xl font-bold">
                      {priceFormatter.formatToPrice(service.priceInCents)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-border bg-card rounded-2xl border p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <Info className="text-primary h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-semibold tracking-wide uppercase">
                    Sobre o <span className="text-primary">serviço</span>
                  </h2>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description ??
                    "Sem descrição disponível para este serviço."}
                </p>
              </div>

              <div className="border-border bg-card overflow-hidden rounded-2xl border">
                <div className="border-border border-b px-5 py-4">
                  <h2 className="text-sm font-semibold tracking-wide uppercase">
                    Informa<span className="text-primary">ções</span>
                  </h2>
                </div>
                <div className="divide-border divide-y">
                  {metaItems.map(({ icon: Icon, label, value, highlight }) => (
                    <div
                      key={label}
                      className="flex flex-col items-start justify-center gap-4 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="text-muted-foreground flex items-center gap-2.5">
                        <Icon className="text-primary h-3.5 w-3.5 shrink-0" />
                        <span className="text-xs">{label}</span>
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          highlight ? "text-green-400" : "text-foreground",
                        )}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={`/barbershops/${slug}`}
                className="group border-border bg-card hover:border-primary/20 hidden items-center gap-4 rounded-2xl border p-4 transition-colors sm:flex"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={barbershop.image || "/images/default.png"}
                    alt={barbershop.image ? barbershop.name : "Sem Imagem"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
                    Barbearia
                  </p>
                  <p className="text-foreground truncate text-sm font-semibold">
                    {barbershop.name}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {barbershop.address}
                  </p>
                </div>
                <ArrowLeft className="text-muted-foreground h-4 w-4 rotate-180 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </div>

            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <BarbershopServiceBookingPanel
                  barbershopIsOpen={
                    barbershop.status ? barbershop.status.isOpen : false
                  }
                  service={service}
                  barbershopName={barbershop.name}
                  isAuthenticated={!!user}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
