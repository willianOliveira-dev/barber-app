"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  HomeIcon,
  CalendarHeart,
  LogIn,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react"
import { FaScissors } from "react-icons/fa6"

import { Menu } from "./menu"
import { Search } from "./search"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { cn } from "../_lib/utils.lib"
import { InferSelectModel } from "drizzle-orm"
import { category } from "@/src/db/schemas"

interface HeaderClientProps {
  categories: InferSelectModel<typeof category>[]
}

const navigationLinks = [
  { name: "Início", href: "/", icon: HomeIcon },
  { name: "Barbearias", href: "/barbershops", icon: FaScissors },
  { name: "Agendamentos", href: "/bookings", icon: CalendarHeart },
]

export function HeaderClient({ categories }: HeaderClientProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header className="border-border bg-card/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-5 lg:px-8 xl:px-12">
        <Link href="/" className="shrink-0">
          <Image
            alt="Razor Barber"
            src="/logo.webp"
            width={150}
            height={22}
            className="h-auto w-32.5 lg:w-37.5"
          />
        </Link>

        <div className="hidden w-full max-w-sm lg:block xl:max-w-md">
          <Search />
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 lg:flex">
            {navigationLinks.map(({ name, href, icon: Icon }) => {
              const active = isActive(href)
              return (
                <Link
                  key={name}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                  )}
                >
                  <Icon size={15} />
                  {name}

                  {active && (
                    <span className="bg-primary h-1 w-1 rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="bg-border mx-1 hidden h-5 w-px lg:block" />

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="border-border bg-background/50 hover:border-primary/30 flex items-center gap-2.5 rounded-xl border px-3 py-1.5 transition-colors focus:outline-none">
                    <Avatar className="ring-primary/20 ring-offset-card h-7 w-7 ring-2 ring-offset-1">
                      {user.image ? (
                        <AvatarImage src={user.image} alt={user.name ?? ""} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-foreground text-sm font-medium">
                      {user.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="border-border bg-card w-56 rounded-xl p-1.5"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="px-2 py-2">
                    <p className="text-foreground text-sm font-semibold">
                      {user.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs font-normal">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-border my-1" />

                  <DropdownMenuItem
                    asChild
                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary cursor-pointer rounded-lg px-2 py-2 text-sm"
                  >
                    <Link href="/profile" className="flex items-center gap-2.5">
                      <User className="h-4 w-4" />
                      Meu perfil
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    asChild
                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary cursor-pointer rounded-lg px-2 py-2 text-sm"
                  >
                    <Link
                      href="/bookings"
                      className="flex items-center gap-2.5"
                    >
                      <CalendarHeart className="h-4 w-4" />
                      Meus agendamentos
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    asChild
                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary cursor-pointer rounded-lg px-2 py-2 text-sm"
                  >
                    <Link
                      href="/profile/settings"
                      className="flex items-center gap-2.5"
                    >
                      <Settings className="h-4 w-4" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-border my-1" />

                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg px-2 py-2 text-sm"
                  >
                    <LogOut className="mr-2.5 h-4 w-4" />
                    Sair da conta
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="gap-2 rounded-xl text-xs">
                <Link href="/login">
                  <LogIn className="h-3.5 w-3.5" />
                  Entrar
                </Link>
              </Button>
            )}
          </div>

          <div className="lg:hidden">
            <Menu categories={categories} />
          </div>
        </div>
      </div>
    </header>
  )
}
