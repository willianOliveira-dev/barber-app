import { categoryRepo } from "@/src/repositories/category.repository"
import { authOptions } from "@/src/app/_lib/auth.lib"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "./menu"
import { Search } from "./search"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { HomeIcon, CalendarHeart, LogIn } from "lucide-react"
import { FaScissors } from "react-icons/fa6"

export async function Header() {
  const categories = await categoryRepo.findAll()
  const session = await getServerSession(authOptions)
  const user = session?.user

  const navigationLinks = [
    { name: "Início", href: "/", icon: HomeIcon },
    { name: "Barbearias", href: "/barbershops", icon: FaScissors },
    { name: "Agendamentos", href: "/bookings", icon: CalendarHeart },
  ]

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
            {navigationLinks.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                href={href}
                className="text-muted-foreground hover:bg-primary/10 hover:text-primary flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                <Icon size={15} />
                {name}
              </Link>
            ))}
          </nav>

          <div className="bg-border mx-1 hidden h-5 w-px lg:block" />

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <div className="border-border bg-background/50 flex items-center gap-2.5 rounded-xl border px-3 py-1.5">
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
              </div>
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
