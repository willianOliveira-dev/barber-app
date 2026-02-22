import Link from "next/link"
import Image from "next/image"
import { Header } from "./_components/header"
import { Footer } from "./_components/footer"
import { ArrowLeft, HomeIcon, Search, Scissors } from "lucide-react"

export default function NotFound() {
  const suggestions = [
    {
      label: "Ir para o início",
      href: "/",
      icon: HomeIcon,
      description: "Voltar para a homepage",
    },
    {
      label: "Explorar barbearias",
      href: "/barbershops",
      icon: Scissors,
      description: "Ver todas as barbearias",
    },
    {
      label: "Buscar serviços",
      href: "/barbershops",
      icon: Search,
      description: "Encontrar o que procura",
    },
  ]

  return (
    <>
      <Header />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-20 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        >
          <span className="text-foreground/3 text-[28vw] leading-none font-black tracking-tighter lg:text-[22vw]">
            404
          </span>
        </div>

        <div className="pointer-events-none absolute right-8 bottom-8 opacity-20 select-none lg:right-12 lg:bottom-12">
          <Image
            src="/images/logo.webp"
            alt="Logo Razor Barber"
            width={280}
            height={36}
            className="h-auto w-45 lg:w-70"
          />
        </div>

        <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary h-px w-8" />
            <span className="text-primary text-xl font-semibold tracking-[0.2em] uppercase">
              Erro 404
            </span>
            <div className="bg-primary h-px w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl leading-tight font-bold lg:text-4xl">
              Página não <span className="text-primary">encontrada</span>
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              O endereço que você tentou acessar não existe ou foi removido.
              Explore as opções abaixo para continuar.
            </p>
          </div>

          <div className="w-full space-y-2">
            {suggestions.map(({ label, href, icon: Icon, description }) => (
              <Link
                key={label}
                href={href}
                className="group border-border bg-card hover:border-primary/20 hover:bg-card/80 flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <Icon className="text-primary h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-foreground text-sm font-medium">
                      {label}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {description}
                    </p>
                  </div>
                </div>
                <ArrowLeft className="text-muted-foreground h-4 w-4 shrink-0 rotate-180 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          <Link
            href="/"
            className="text-muted-foreground hover:text-primary flex items-center gap-1.5 text-xs transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para o início
          </Link>
        </div>
      </main>

      <Footer />
    </>
  )
}
