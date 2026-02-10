"use client"

import { AuthActionCard } from "./auth-action-card"
import { FcGoogle } from "react-icons/fc"
import { Button } from "./ui/button"
import Image from "next/image"
import Link from "next/link"
import { Input } from "./ui/input"
export function LoginForm() {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex flex-col gap-2">
        <Link href="/">
          <Image alt="Razor Barber" src="/logo.webp" width={180} height={22} />
        </Link>
        <h1 className="text-2xl font-bold">Acesse sua conta</h1>
      </div>

      <Button
        variant="secondary"
        className="flex w-full items-center rounded-xl py-6 text-lg transition hover:opacity-90"
      >
        <span>
          <FcGoogle className="size-6" />
        </span>
        Google
      </Button>

      <div className="bg-border h-px" />

      <form className="space-y-4">
        <div>
          <label className="mb-1 text-sm font-medium text-gray-400">
            E-mail
          </label>
          <Input
            type="email"
            placeholder="Seu e-mail"
            className="bg-input focus:ring-primary mt-1 w-full rounded-xl px-4 py-3 outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="mb-1 text-sm font-medium text-gray-400">
            Senha
          </label>
          <Input
            type="password"
            placeholder="Sua senha"
            className="bg-input focus:ring-primary mt-1 w-full rounded-xl px-4 py-3 outline-none focus:ring-2"
          />
        </div>

        <Link
          href="/forgot-password"
          className="text-primary block text-sm hover:underline"
        >
          Esqueci minha senha
        </Link>
        <Button type="submit" className="w-full font-semibold">
          Entrar
        </Button>
      </form>

      <AuthActionCard
        label="Não tem uma conta?"
        linkMessage="Criar sua conta grátis"
        linkHref="/register"
      />
    </div>
  )
}
