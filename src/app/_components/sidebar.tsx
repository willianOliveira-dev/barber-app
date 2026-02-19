"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  CalendarCheck,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Scissors,
} from "lucide-react"
import { Search } from "./search"
import { twMerge } from "tailwind-merge"
import { Button } from "./ui/button"

interface SidebarProps {
  today: string
  greeting: string
  userName?: string
  isLoggedIn: boolean
  categories: { id: string; name: string; slug: string; icon?: string | null }[]
}

export function Sidebar({
  today,
  greeting,
  userName,
  isLoggedIn,
  categories,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false)

  useEffect(() => {
    const stored = window.localStorage.getItem("sidebar-collapsed")
    setCollapsed(stored === "true")
  }, [])

  const createLink = (slug: string) => {
    const params = new URLSearchParams()
    params.set("category", slug)
    params.set("page", "1")
    params.set("limit", "12")
    return `/barbershops?${params}`
  }

  const toggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem("sidebar-collapsed", String(!prev))
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
        className={twMerge(
          "flex h-16 shrink-0 items-center border-b border-white/5",
          collapsed ? "justify-center px-0" : "justify-end px-4",
        )}
      >
        <Button
          onClick={toggle}
          className="text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-x-hidden overflow-y-auto">
        <div
          className={
            collapsed
              ? "flex flex-col items-center gap-5 py-6"
              : "space-y-7 p-6 xl:p-8"
          }
        >
          {!collapsed && (
            <div className="space-y-1">
              <p className="text-foreground-muted text-[11px] font-medium tracking-[0.18em] uppercase">
                {today}
              </p>
              {isLoggedIn && userName ? (
                <>
                  <h1 className="text-3xl leading-tight font-bold text-white xl:text-4xl">
                    {greeting},
                  </h1>
                  <h1 className="text-primary text-3xl leading-tight font-bold xl:text-4xl">
                    {userName}.
                  </h1>
                </>
              ) : (
                <>
                  <h1 className="text-3xl leading-tight font-bold text-white xl:text-4xl">
                    Encontre
                  </h1>
                  <h1 className="text-primary text-3xl leading-tight font-bold xl:text-4xl">
                    sua barbearia.
                  </h1>
                </>
              )}
            </div>
          )}

          {!collapsed && (
            <div>
              <p className="text-foreground-muted mb-2 text-[11px] font-medium tracking-widest uppercase">
                Buscar
              </p>
              <Search />
            </div>
          )}

          {collapsed ? (
            <div className="flex w-full flex-col items-center gap-1">
              <div className="mb-1 h-px w-8 bg-white/10" />
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={createLink(category.slug)}
                  title={category.name}
                  className="text-muted-foreground hover:bg-primary/10 hover:text-primary flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
                >
                  {category.icon ? (
                    <Image
                      src={category.icon}
                      alt={category.name}
                      width={16}
                      height={16}
                      className="opacity-60"
                    />
                  ) : (
                    <Scissors className="h-4 w-4" />
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-foreground-muted mb-2 text-[11px] font-medium tracking-[0.18em] uppercase">
                Categorias
              </p>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={createLink(category.slug)}
                  className="group hover:bg-primary/10 hover:text-primary flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-white/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {category.icon && (
                      <Image
                        src={category.icon}
                        alt={category.name}
                        width={14}
                        height={14}
                        className="opacity-50 transition-opacity group-hover:opacity-100"
                      />
                    )}
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div
          className={twMerge(
            "border-t border-white/5",
            collapsed
              ? "flex flex-col items-center gap-3 py-5"
              : "space-y-3 p-6",
          )}
        >
          <div
            className={[
              "flex items-center gap-2 text-xs text-white/40",
              collapsed ? "flex-col" : "",
            ].join(" ")}
          >
            <span className="block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-green-400" />
            {!collapsed && <span>Barbearias abertas agora</span>}
          </div>

          {isLoggedIn &&
            (collapsed ? (
              <Link
                href="/bookings"
                title="Meus agendamentos"
                className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/15 flex h-9 w-9 items-center justify-center rounded-xl border transition-colors"
              >
                <CalendarCheck className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/bookings"
                className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors"
              >
                <span className="font-medium">Meus agendamentos</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
        </div>
      </div>
    </aside>
  )
}
