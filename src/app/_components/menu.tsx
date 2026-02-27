"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"

import {
  MenuIcon,
  HomeIcon,
  CalendarHeart,
  LogIn,
  ChevronRight,
} from "lucide-react"
import { FaScissors } from "react-icons/fa6"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { Button } from "./ui/button"
import { SkeletonAvatar } from "./skeleton-avatar"
import { ProfileCard } from "./profile-card"
import { cn } from "../_lib/utils.lib"
import { ButtonSignOut } from "./button-sign-out"
import { Category } from "@/src/db/types"

export type MenuProps = { categories: Category[] }

export function Menu({ categories }: MenuProps) {
  const { status, data } = useSession()
  const [isOpenSheet, setIsOpenSheet] = useState<boolean>(false)

  const pathname = usePathname()

  const navigationLinks = [
    { name: "Início", href: "/", icon: HomeIcon },
    { name: "Barbearias", href: "/barbershops", icon: FaScissors },
    { name: "Agendamentos", href: "/bookings", icon: CalendarHeart },
  ]

  const createBarbershopCategoryLink = (categorySlug: string) => {
    const params = new URLSearchParams()
    params.set("category", categorySlug)
    params.set("page", "1")
    params.set("limit", "12")
    return `/barbershops?${params.toString()}`
  }

  return (
    <Sheet open={isOpenSheet} onOpenChange={setIsOpenSheet}>
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
              <FaScissors className="text-primary h-3.5 w-3.5" />
            </div>
            <SheetTitle className="text-foreground text-sm font-semibold tracking-[0.12em] uppercase">
              Menu
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="border-border border-b px-4 py-4">
          {status === "loading" ? (
            <SkeletonAvatar />
          ) : status === "authenticated" ? (
            <div className="border-border bg-background/50 rounded-xl border p-3">
              <ProfileCard
                avatarUrl={data.user.image}
                email={data.user.email}
                name={data.user.name}
              />
            </div>
          ) : (
            <div className="border-border bg-background/50 flex items-center justify-between gap-3 rounded-xl border px-4 py-3">
              <div>
                <p className="text-foreground text-sm font-semibold">
                  Olá, visitante
                </p>
                <p className="text-muted-foreground text-xs">
                  Faça login para agendar
                </p>
              </div>
              <Button asChild size="sm" className="gap-1.5 rounded-lg text-xs">
                <Link href="/login" onClick={() => setIsOpenSheet(false)}>
                  <LogIn className="h-3.5 w-3.5" />
                  Entrar
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="border-border border-b px-4 py-4">
          <p className="text-muted-foreground mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] uppercase">
            Navegar
          </p>
          <nav>
            <ul className="flex flex-col gap-0.5">
              {navigationLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpenSheet(false)}
                      className={cn(
                        "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <link.icon
                          size={15}
                          className={cn(
                            isActive
                              ? "text-primary-foreground"
                              : "text-muted-foreground group-hover:text-primary",
                          )}
                        />
                        {link.name}
                      </div>
                      <ChevronRight
                        className={cn(
                          "h-3.5 w-3.5 transition-opacity",
                          isActive
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

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="text-muted-foreground mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] uppercase">
            Categorias
          </p>
          <div className="flex flex-col gap-0.5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={createBarbershopCategoryLink(category.slug)}
                onClick={() => setIsOpenSheet(false)}
                className="group text-muted-foreground hover:bg-primary/10 hover:text-primary flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <Image
                    alt={category.name}
                    src={category.icon!}
                    width={14}
                    height={14}
                    className="opacity-60 transition-opacity group-hover:opacity-100"
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        {status === "authenticated" && (
          <div className="border-border border-t px-4 py-4">
            <ButtonSignOut />
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
