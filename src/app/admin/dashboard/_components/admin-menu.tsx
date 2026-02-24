"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  MenuIcon,
  LayoutDashboard,
  Scissors,
  Plus,
  CalendarCheck,
  MessageSquare,
  BarChart3,
  Users,
  ChevronRight,
  LogOut,
  Shield,
  ExternalLink,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../_components/ui/sheet"
import { Button } from "../../../_components/ui/button"
import { cn } from "../../../_lib/utils.lib"
import { Session } from "next-auth"
import { ButtonSignOut } from "../../../_components/button-sign-out"
import { ProfileCard } from "../../../_components/profile-card"

interface AdminMenuProps {
  user?: Session["user"]
}

const navGroups = [
  {
    label: "Geral",
    items: [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    label: "Barbearias",
    items: [
      {
        label: "Todas as barbearias",
        href: "/admin/dashboard/barbershops",
        icon: Scissors,
      },
      {
        label: "Nova barbearia",
        href: "/admin/dashboard/barbershops/new",
        icon: Plus,
      },
    ],
  },
  {
    label: "Agendamentos",
    items: [
      {
        label: "Gerenciar agendamentos",
        href: "/admin/dashboard/bookings",
        icon: CalendarCheck,
      },
    ],
  },
  {
    label: "Comunidade",
    items: [
      {
        label: "Comentários",
        href: "/admin/dashboard/reviews",
        icon: MessageSquare,
      },
    ],
  },
  {
    label: "Relatórios",
    items: [
      {
        label: "Pagamentos",
        href: "/admin/dashboard/reports/payments",
        icon: BarChart3,
      },
      {
        label: "Fluxo de clientes",
        href: "/admin/dashboard/reports/customers",
        icon: Users,
      },
    ],
  },
]

export function AdminMenu({ user }: AdminMenuProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="border-border bg-card hover:bg-card/80 hover:border-primary/30 rounded-xl border transition-all"
        >
          <MenuIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="border-border bg-card flex flex-col gap-0 border-l p-0">
        <SheetHeader className="border-border border-b px-6 pt-6 pb-5">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-lg">
              <Shield className="text-primary h-3.5 w-3.5" />
            </div>
            <SheetTitle className="text-foreground text-sm font-semibold tracking-[0.12em] uppercase">
              Admin
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="border-border border-b px-4 py-4">
          {user ? (
            <div className="border-border bg-background/50 rounded-xl border p-3">
              <div className="flex flex-col items-center gap-3">
                <ProfileCard
                  avatarUrl={user.image}
                  email={user.email}
                  name={user.name}
                />
                <div className="mt-0.5 flex items-center gap-1">
                  <Shield className="text-primary h-2.5 w-2.5" />
                  <span className="text-primary text-[10px] font-semibold tracking-widest uppercase">
                    Administrador
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto">
          {navGroups.map(({ label, items }) => (
            <div key={label} className="border-border border-b px-4 py-4">
              <p className="text-muted-foreground mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] uppercase">
                {label}
              </p>
              <nav>
                <ul className="flex flex-col gap-0.5">
                  {items.map(({ label: itemLabel, href, icon: Icon }) => {
                    const active = pathname == href
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={close}
                          className={cn(
                            "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              size={15}
                              className={cn(
                                active
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground group-hover:text-primary",
                              )}
                            />
                            {itemLabel}
                          </div>
                          <ChevronRight
                            className={cn(
                              "h-3.5 w-3.5 transition-opacity",
                              active
                                ? "opacity-60"
                                : "opacity-0 group-hover:opacity-100",
                            )}
                          />
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          ))}
        </div>

        <div className="border-border space-y-0.5 border-t px-4 py-4">
          <Link
            href="/"
            onClick={close}
            className="text-muted-foreground hover:bg-primary/10 hover:text-primary flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all"
          >
            <ExternalLink className="h-4 w-4" />
            Ir para o app
          </Link>
          <ButtonSignOut />
        </div>
      </SheetContent>
    </Sheet>
  )
}
