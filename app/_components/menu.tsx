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
import Image from "next/image"
import Link from "next/link"

export type MenuProps = React.ComponentProps<typeof SheetPrimitive.Trigger>

export function Menu({ ...props }: MenuProps) {
  return (
    <Sheet>
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
            <Button size="icon">
              <LogIn />
            </Button>
          </div>
        </section>

        <section className="border-b-secondary border-b p-5">
          <nav>
            <ul className="flex flex-col gap-4">
              <li className="bg-primary rounded-md px-4 py-2">
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/"
                >
                  <span>
                    <HomeIcon size={16} />
                  </span>
                  Ínicio
                </Link>
              </li>
              <li className="rounded-md px-4 py-2">
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/"
                >
                  <span>
                    <CalendarHeart size={16} />
                  </span>
                  Agendamentos
                </Link>
              </li>
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
