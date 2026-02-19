import { getServerSession } from "next-auth"
import { Footer } from "../_components/footer"
import { Header } from "../_components/header"
import { redirect } from "next/navigation"
import { BookignsTabs } from "../_components/booking-tabs"
import { authOptions } from "../_lib/auth.lib"
import { CalendarCheck } from "lucide-react"

export default async function BookingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) redirect("/login")

  return (
    <>
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-screen-2xl">
          <section className="border-border border-b px-5 py-8 lg:px-8 xl:px-12">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
                  Painel pessoal
                </p>
                <h1 className="text-2xl leading-tight font-bold lg:text-3xl xl:text-4xl">
                  Meus <span className="text-primary">Agendamentos</span>
                </h1>
                <p className="text-muted-foreground text-xs">
                  Acompanhe e gerencie seus horários
                </p>
              </div>

              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                <CalendarCheck className="text-primary h-5 w-5" />
              </div>
            </div>
          </section>

          <section className="px-5 py-8 lg:px-8 xl:px-12">
            <BookignsTabs />
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
