"use client"
import { Button } from "./ui/button"
import { AuthActionCard } from "./auth-action-card"
import Link from "next/link"
import Image from "next/image"
import { Input } from "./ui/input"

export function RegisterForm() {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex flex-col gap-2">
        <Link href="/">
          <Image alt="Razor Barber" src="/logo.webp" width={180} height={22} />
        </Link>
        <h1 className="text-2xl font-bold">Cadastra-se agora</h1>
      </div>

      <form className="w-full max-w-md space-y-4">
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="mb-1 text-sm font-medium text-gray-400"
          >
            Nome Completo
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            className="bg-input focus:ring-primary mt-1 w-full rounded-xl px-4 py-3 outline-none focus:ring-2"
            placeholder="Seu nome completo"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="mb-1 text-sm font-medium text-gray-400"
          >
            E-mail
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            className="bg-input focus:ring-primary mt-1 w-full rounded-xl px-4 py-3 outline-none focus:ring-2"
            placeholder="Seu e-mail"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="mb-1 text-sm font-medium text-gray-400"
          >
            Senha
          </label>
          <Input
            type="password"
            id="password"
            name="password"
            className="bg-input focus:ring-primary mt-1 w-full rounded-xl px-4 py-3 outline-none focus:ring-2"
            placeholder="Deve ter no mínimo 8 caracteres"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="confirmPassword"
            className="mb-1 text-sm font-medium text-gray-400"
          >
            Confirmação de Senha
          </label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="bg-input focus:ring-primary mt-1 w-full rounded-xl px-4 py-3 outline-none focus:ring-2"
            placeholder="Deve ter no mínimo 8 caracteres"
          />
        </div>

        <Button type="submit" className="w-full font-semibold">
          Cadastrar
        </Button>
      </form>

      <AuthActionCard
        label="Já tem uma conta?"
        linkMessage="Acesse agora a plataforma"
        linkHref="/login"
      />
    </div>
  )
}
