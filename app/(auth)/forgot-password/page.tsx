"use client"

import { AuthActionCard } from "@/app/_components/auth-action-card"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import Image from "next/image"
import Link from "next/link"

export default function ForgotPasswordPage() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    console.log("Solicitação de reset enviada")
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <Link href="/">
          <Image alt="Razor Barber" src="/logo.webp" width={180} height={22} />
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Recuperar senha</h1>
        <p className="mt-1 text-sm text-gray-400">
          Enviaremos um código para seu e-mail
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-400">E-mail</label>
          <Input
            type="email"
            placeholder="seu@email.com"
            className="bg-input focus:ring-primary mt-1 w-full rounded-xl px-4 py-3 outline-none focus:ring-2"
          />
        </div>

        <Button
          type="submit"
          className="bg-primary text-primary-foreground w-full"
        >
          Enviar código
        </Button>
      </form>

      <AuthActionCard
        label="Lembrou da senha?"
        linkMessage="Volte para o login"
        linkHref="/login"
      />
    </div>
  )
}
