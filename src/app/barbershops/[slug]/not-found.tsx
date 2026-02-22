import Link from "next/link"
import Image from "next/image"

import { Header } from "../../_components/header"
import { Footer } from "../../_components/footer"
import { ArrowLeft, Scissors, Search, HomeIcon } from "lucide-react"

export default function BarbershopNotFound() {
  const suggestions = [
    {
      label: "Ver todas as barbearias",
      href: "/barbershops",
      icon: Scissors,
      description: "Explore o catálogo completo",
    },
    {
      label: "Buscar por nome",
      href: "/barbershops",
      icon: Search,
      description: "Tente uma nova pesquisa",
    },
    {
      label: "Voltar ao início",
      href: "/",
      icon: HomeIcon,
      description: "Ir para a homepage",
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

        <div
          aria-hidden
          className="pointer-events-none absolute right-8 bottom-8 opacity-30 select-none lg:right-12 lg:bottom-12"
        >
          <Image
            src="/images/logo.webp"
            alt=""
            width={280}
            height={36}
            className="h-auto w-45 lg:w-70"
          />
        </div>

        <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-8 text-center">
          <div className="border-primary/20 bg-primary/5 flex h-16 w-16 items-center justify-center rounded-2xl border">
            <Scissors className="text-primary h-8 w-8 opacity-60" />
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-primary h-px w-8" />
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
              Barbearia não encontrada
            </span>
            <div className="bg-primary h-px w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl leading-tight font-bold lg:text-4xl">
              Esta barbearia <span className="text-primary">não existe</span>
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A barbearia que você procura pode ter sido removida ou o endereço
              está incorreto.
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
            href="/barbershops"
            className="text-muted-foreground hover:text-primary flex items-center gap-1.5 text-xs transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Ver todas as barbearias
          </Link>
        </div>
      </main>

      <Footer />
    </>
  )
}
