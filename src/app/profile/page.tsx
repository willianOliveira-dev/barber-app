import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth.lib"
import { redirect } from "next/navigation"
import { Header } from "../_components/header"
import { Footer } from "../_components/footer"
import { Avatar, AvatarFallback, AvatarImage } from "../_components/ui/avatar"
import {
  CalendarCheck,
  CalendarHeart,
  Mail,
  Settings,
  User,
} from "lucide-react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { twMerge } from "tailwind-merge"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const user = session.user

  const quickLinks = [
    {
      label: "Agendamentos confirmados",
      href: "/bookings",
      icon: CalendarCheck,
      description: "Ver próximas visitas",
    },
    {
      label: "Explorar barbearias",
      href: "/barbershops",
      icon: CalendarHeart,
      description: "Encontrar novos locais",
    },
    {
      label: "Configurações",
      href: "/profile/settings",
      icon: Settings,
      description: "Edite seu perfil e configurações",
    },
  ]

  return (
    <>
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-screen-2xl">
          <section className="border-border border-b px-5 py-8 lg:px-8 xl:px-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <div className="relative shrink-0">
                <Avatar className="ring-primary/30 ring-offset-background h-20 w-20 ring-2 ring-offset-4 lg:h-24 lg:w-24">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name ?? ""} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="ring-background absolute right-1 bottom-1 h-3 w-3 rounded-full bg-green-400 ring-2" />
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
                    Perfil do usuário
                  </p>
                  <h1 className="text-foreground text-2xl font-bold lg:text-3xl">
                    {user.name}
                  </h1>
                </div>
                <div className="flex flex-wrap gap-3">
                  {user.email && (
                    <div className="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs">
                      <Mail className="text-primary h-3 w-3" />
                      {user.email}
                    </div>
                  )}
                  <div className="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs">
                    <User className="text-primary h-3 w-3" />
                    Membro ativo
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 px-5 py-8 lg:grid-cols-3 lg:px-8 xl:px-12">
            <div className="space-y-3 lg:col-span-1">
              <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
                Acesso rápido
              </p>
              {quickLinks.map(({ label, href, icon: Icon, description }) => (
                <Link
                  key={label}
                  href={href}
                  className="group border-border bg-card hover:border-primary/20 hover:bg-card/80 flex items-center justify-between gap-3 rounded-xl border p-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                      <Icon className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-medium">
                        {label}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="text-muted-foreground h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>

            <div className="space-y-3 lg:col-span-2">
              <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
                Informações da conta
              </p>

              <div className="border-border bg-card overflow-hidden rounded-2xl border">
                {[
                  { label: "Nome completo", value: user.name ?? "—" },
                  { label: "E-mail", value: user.email ?? "—" },
                  { label: "ID da conta", value: user.id ?? "—" },
                  {
                    label: "Provedor",
                    value: user.image?.includes("google")
                      ? "Google"
                      : "Credenciais",
                  },
                ].map(({ label, value }, i, arr) => (
                  <div
                    key={label}
                    className={twMerge(
                      "flex items-center justify-between gap-4 px-5 py-4",
                      i < arr.length - 1 ? "border-border border-b" : "",
                    )}
                  >
                    <span className="text-muted-foreground text-xs">
                      {label}
                    </span>
                    <span className="text-foreground max-w-[60%] truncate text-right text-xs font-medium">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
