import { getServerSession } from "next-auth"
import { authOptions } from "../../_lib/auth.lib"
import { redirect } from "next/navigation"
import { AdminSidebar } from "./_components/admin-sidebar"
import { AdminHeader } from "./_components/admin-header"
import { type ReactNode } from "react"
import { TooltipProvider } from "../../_components/ui/tooltip"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) redirect("/login")
  if (session.user.role !== "barber") redirect("/")
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="bg-background min-w-0 flex-1">
          <TooltipProvider>{children}</TooltipProvider>
        </main>
      </div>
    </div>
  )
}
