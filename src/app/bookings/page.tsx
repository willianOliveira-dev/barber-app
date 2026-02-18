import { getServerSession } from "next-auth"
import { Footer } from "../_components/footer"
import { Header } from "../_components/header"
import { redirect } from "next/navigation"
import { BookignsTabs } from "../_components/booking-tabs"

export default async function BookingsPage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <>
      <Header />
      <main className="flex-1 space-y-8 p-5">
        <section className="flex items-center justify-center">
          <div className="container flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">
              Meus <span className="text-primary font-bold">Agendamentos</span>
            </h1>
            <p className="text-sm text-gray-400">
              Acompanhe e gerencie seus horários
            </p>
          </div>
        </section>
        <section className="flex items-center justify-center">
          <div className="justyfy-center container flex items-center">
            <BookignsTabs />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
