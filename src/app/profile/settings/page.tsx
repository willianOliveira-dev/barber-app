import { getServerSession } from "next-auth"
import { authOptions } from "../../_lib/auth.lib"
import { redirect } from "next/navigation"
import { Header } from "../../_components/header"
import { Footer } from "../../_components/footer"
import { ProfileSettingsClient } from "../../_components/profile-settings-client"
import { Settings } from "lucide-react"

export default async function ProfileSettingsPage() {
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
                  Conta
                </p>
                <h1 className="text-2xl leading-tight font-bold lg:text-3xl xl:text-4xl">
                  Configura<span className="text-primary">ções</span>
                </h1>
                <p className="text-muted-foreground text-xs">
                  Gerencie sua conta e preferências
                </p>
              </div>
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                <Settings className="text-primary h-5 w-5" />
              </div>
            </div>
          </section>

          <ProfileSettingsClient user={session.user} />
        </div>
      </main>

      <Footer />
    </>
  )
}
