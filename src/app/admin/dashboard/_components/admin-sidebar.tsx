"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CalendarCheck,
  LayoutDashboard,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Scissors,
  Users,
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "../../../_lib/utils.lib"
import { Button } from "../../../_components/ui/button"
import { twMerge } from "tailwind-merge"

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

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
        { label: "Nova barbearia", href: "/admin/dashboard/barbershops/new", icon: Plus },
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
        { label: "Comentários", href: "/admin/dashboard/reviews", icon: MessageSquare },
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

  useEffect(() => {
    const stored = localStorage.getItem("admin-sidebar-collapsed")
    if (stored !== null) setCollapsed(stored === "true")
  }, [])

  const toggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem("admin-sidebar-collapsed", String(!prev))
      return !prev
    })
  }

  return (
    <aside
      className={twMerge(
        "hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:shrink-0 lg:flex-col lg:overflow-hidden",
        "transition-all duration-300 ease-in-out",
        collapsed ? "lg:w-17" : "lg:w-75 xl:w-[320px]",
        "border-primary/10 bg-secondary border-r",
      )}
    >
      <div
        className={cn(
          "flex h-12 shrink-0 items-center border-b border-white/5",
          collapsed ? "justify-center" : "justify-between px-4",
        )}
      >
        {!collapsed && (
          <span className="text-[11px] font-semibold tracking-[0.18em] text-white uppercase">
            Admin
          </span>
        )}
        <Button
          variant="secondary"
          onClick={toggle}
          className="text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-3.5 w-3.5" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto py-4">
        {navGroups.map(({ label, items }) => (
          <div
            key={label}
            className={cn(
              "flex flex-col",
              collapsed ? "gap-1 px-2" : "gap-0.5 px-3 pb-3",
            )}
          >
            {!collapsed && (
              <p className="mb-1 px-2 text-[10px] font-semibold tracking-[0.16em] text-white/75 uppercase">
                {label}
              </p>
            )}
            {items.map(({ label: itemLabel, href, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? itemLabel : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg transition-colors",
                    collapsed ? "h-9 w-9 justify-center" : "px-3 py-2.5",
                    active
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-primary/10 hover:text-primary text-white/40",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium">
                        {itemLabel}
                      </span>
                      {active && (
                        <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </div>
    </aside>
  )
}
