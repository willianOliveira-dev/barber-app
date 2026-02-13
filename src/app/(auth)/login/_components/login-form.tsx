"use client"

import { AuthActionCard } from "../../../_components/auth-action-card"
import { FcGoogle } from "react-icons/fc"
import { Button } from "../../../_components/ui/button"
import { Input } from "../../../_components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"

import { LoginFormData, useLoginForm } from "../_hooks/useLoginForm"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/app/_components/ui/form"

import { loginAction } from "../_actions/login.action"

export function LoginForm() {
  const form = useLoginForm()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLoginWithGoogle = async () => {
    setIsLoading(true)

    const res = await loginAction.provider("google")

    setIsLoading(false)

    if (res?.error) {
      toast.error("Erro ao autenticar com Google")
      return
    }

    router.push("/")
  }

  const handleAuthError = (error: string) => {
    const errorMap: Record<string, string> = {
      USER_NOT_FOUND: "Usuário não encontrado",
      INVALID_PASSWORD: "Senha inválida",
      USER_WITHOUT_PASSWORD: "Usuário não possui senha",
      CredentialsSignin: "E-mail ou senha inválidos",
    }
    toast.error(errorMap[error] ?? "Erro ao realizar login")
  }

  const handleSubmit = async (values: LoginFormData) => {
    setIsLoading(true)

    const res = await loginAction.credentials(values.email, values.password)

    setIsLoading(false)

    if (!res) {
      toast.error("Erro inesperado")
      return
    }

    if (res.error) {
      handleAuthError(res.error)
      return
    }

    toast.success("Login realizado com sucesso!")
    router.push("/")
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex flex-col gap-2">
        <Link href="/">
          <Image alt="Razor Barber" src="/logo.webp" width={180} height={22} />
        </Link>
        <h1 className="text-2xl font-bold">Acesse sua conta</h1>
      </div>

      <Button
        type="button"
        onClick={handleLoginWithGoogle}
        variant="secondary"
        className="flex w-full items-center rounded-xl py-6 text-lg"
        disabled={isLoading}
      >
        <FcGoogle className="mr-2 size-6" />
        Entrar com Google
      </Button>

      <div className="bg-border h-px" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="m@example.com"
                    className="bg-input focus:ring-primary mt-1 w-full rounded-xl px-4 py-3 outline-none focus:ring-2"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Sua senha"
                    className="bg-input focus:ring-primary mt-1 w-full rounded-xl px-4 py-3 outline-none focus:ring-2"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Link
            href="/forgot-password"
            className="text-primary text-sm hover:underline"
          >
            Esqueci minha senha
          </Link>

          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Form>

      <AuthActionCard
        label="Não tem uma conta?"
        linkMessage="Criar sua conta grátis"
        linkHref="/register"
      />
    </div>
  )
}
