"use client"

import Image from "next/image"
import Link from "next/link"
import { signOut } from "next-auth/react"
import {
  LogOut,
  ChevronDown,
  Shield,
  ExternalLink,
  Settings,
  User,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../_components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../_components/ui/dropdown-menu"
import { Session } from "next-auth"
import { Button } from "../../../_components/ui/button"
import { AdminMenu } from "./admin-menu"
import { ButtonSignOut } from "@/src/app/_components/button-sign-out"

interface AdminHeaderClientProps {
  user?: Session["user"]
}

export function AdminHeaderClient({ user }: AdminHeaderClientProps) {
  return (
    <header className="border-border bg-card/90 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-5 lg:px-8 xl:px-12">
        <Link
          href="/admin/dashboard"
          className="flex shrink-0 items-center gap-2.5"
        >
          <Image
            alt="Razor Barber"
            src="/logo.webp"
            width={150}
            height={22}
            className="h-auto w-30 lg:w-35"
          />
          <div className="border-primary/20 bg-primary/10 flex items-center gap-1 rounded-md border px-1.5 py-0.5">
            <Shield className="text-primary h-3 w-3" />
            <span className="text-primary text-[10px] font-bold tracking-widest uppercase">
              Admin
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="border-border bg-background/50 hover:border-primary/30 flex items-center gap-2.5 rounded-xl border px-3 py-5 transition-colors focus:outline-none"
                >
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
                  <div className="hidden flex-col items-start sm:flex">
                    <span className="text-foreground text-xs leading-tight font-semibold">
                      {user.name?.split(" ")[0]}
                    </span>
                    <span className="text-primary text-[10px] font-medium">
                      Administrador
                    </span>
                  </div>
                  <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="border-border bg-card w-56 rounded-xl p-1.5"
                sideOffset={8}
              >
                <DropdownMenuLabel className="px-2 py-2">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Shield className="text-primary h-3 w-3" />
                    <span className="text-primary text-[10px] font-bold tracking-widest uppercase">
                      Administrador
                    </span>
                  </div>
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
                  <Link href="/" className="flex items-center gap-2.5">
                    <ExternalLink className="h-4 w-4" />
                    Ir para o app
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

                <DropdownMenuItem className="p-0">
                  <ButtonSignOut />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          <div className="lg:hidden">
            <AdminMenu user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}
