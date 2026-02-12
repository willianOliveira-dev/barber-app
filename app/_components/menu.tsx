"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"

import { MenuIcon, HomeIcon, CalendarHeart, LogIn } from "lucide-react"
import { FaScissors } from "react-icons/fa6"

import { Dialog as SheetPrimitive } from "radix-ui"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"

import { Button } from "./ui/button"
import { SkeletonAvatar } from "./skeleton-avatar"
import { ProfileCard } from "./profile-card"

import { QUICK_SEARCH_OPTIONS } from "../_constants/search"
import { cn } from "../_lib/utils.lib"

export type MenuProps = React.ComponentProps<typeof SheetPrimitive.Trigger>

export function Menu({ ...props }: MenuProps) {
  const { status, data } = useSession()
  const [isOpenSheet, setIsOpenSheet] = useState<boolean>(false)
  const pathname = usePathname()

  const navigationLinks = [
    { name: "Ínicio", router: "/", icon: HomeIcon },
    { name: "Barbearias", router: "/barbershops", icon: FaScissors },
    { name: "Agendamentos", router: "/booking", icon: CalendarHeart },
  ]

  const handleSignOutClick = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const createBarbershopServiceLink = (service: string) => {
    const params = new URLSearchParams()
    params.set("service", service)
    params.set("page", "1")
    params.set("limit", "12")
    return `/barbershops?${params.toString()}`
  }

  return (
    <Sheet open={isOpenSheet} onOpenChange={setIsOpenSheet}>
      <SheetTrigger {...props} asChild>
        <Button variant="secondary" size="icon">
          <MenuIcon />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        {status === "loading" ? (
          <SkeletonAvatar />
        ) : status === "authenticated" ? (
          <ProfileCard
            avatarUrl={data.user.image}
            email={data.user.email}
            name={data.user.name}
          />
        ) : (
          <div className="p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-lg font-semibold">Olá. Faça seu login!</p>
              <Button asChild size="icon">
                <Link href="/login">
                  <LogIn />
                </Link>
              </Button>
            </div>
          </div>
        )}

        <div className="bg-border h-px" />

        <div className="p-5">
          <nav>
            <ul className="flex flex-col gap-4">
              {navigationLinks.map((link) => (
                <li
                  key={link.name}
                  className={cn(
                    "hover:bg-secondary rounded-md px-4 py-2 transition-all duration-300",
                    pathname === link.router &&
                      "bg-primary hover:bg-primary/85",
                  )}
                >
                  <Link
                    href={link.router}
                    className="flex items-center justify-start gap-2"
                    onClick={() => setIsOpenSheet((state) => !state)}
                  >
                    <span>
                      <link.icon size={16} />
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="bg-border h-px" />

        <div className="p-5">
          <div className="flex flex-col gap-4">
            {QUICK_SEARCH_OPTIONS.map((option) => (
              <Button
                key={option.label}
                asChild
                variant="ghost"
                className="flex items-center justify-start gap-4"
              >
                <Link
                  href={createBarbershopServiceLink(option.label)}
                  onClick={() => setIsOpenSheet((state) => !state)}
                >
                  <Image
                    alt={option.label}
                    src={option.icon}
                    width={16}
                    height={16}
                  />
                  {option.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {status === "authenticated" && (
          <>
            <div className="bg-border h-px" />
            <SheetFooter>
              <div className="flex items-center gap-4">
                <Button onClick={handleSignOutClick} variant="ghost">
                  <span>
                    <LogIn />
                  </span>
                  Sair da conta
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
