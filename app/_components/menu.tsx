"use client"
import { MenuIcon, HomeIcon, CalendarHeart, LogIn } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog as SheetPrimitive } from "radix-ui"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { QUICK_SEARCH_OPTIONS } from "../_constants/search"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "../_lib/utils"
import Image from "next/image"
import Link from "next/link"

export type MenuProps = React.ComponentProps<typeof SheetPrimitive.Trigger>

export function Menu({ ...props }: MenuProps) {
  const pathname = usePathname()

  const navigationLinks = [
    {
      name: "Ínicio",
      router: "/",
      icon: HomeIcon,
    },
    {
      name: "Agendamentos",
      router: "/booking",
      icon: CalendarHeart,
    },
  ]

  const [isOpenSheet, setIsOpenSheet] = useState<boolean>(false)
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

        <section className="border-b-secondary border-b p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-lg font-semibold">Olá. Faça seu login!</p>
            <Button asChild size="icon">
              <Link href="/login">
                <LogIn />
              </Link>
            </Button>
          </div>
        </section>

        <section className="border-b-secondary border-b p-5">
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
                    className="flex items-center justify-start gap-2"
                    href={link.router}
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
        </section>

        <section className="border-b-secondary border-b p-5">
          <div className="flex flex-col gap-4">
            {QUICK_SEARCH_OPTIONS.map((option) => (
              <Button
                key={option.label}
                variant="ghost"
                className="flex items-center justify-start gap-4"
              >
                <span className="relative block size-4">
                  <Image
                    alt={option.label}
                    src={option.icon}
                    fill
                    className="object-contain"
                  ></Image>
                </span>
                {option.label}
              </Button>
            ))}
          </div>
        </section>

        <SheetFooter>
          <div className="flex items-center gap-4">
            <Button variant="ghost">
              <span>
                <LogIn />
              </span>
              Sair da conta
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
