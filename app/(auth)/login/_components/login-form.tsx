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
} from "@/app/_components/ui/form"
import { loginAction } from "../_actions/login.action"

export function LoginForm() {
  const loginForm = useLoginForm()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const handleSubmit = async (values: LoginFormData) => {
    setIsLoading(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    const data = await res.json()

    setIsLoading(false)

    if (!data.success) {
      toast.error(data.error, {
        description: data.message,
        richColors: true,
        position: "top-center",
        duration: 5000,
      })
    } else {
      toast.success("Login realizado com sucesso!", {
        richColors: true,
        position: "top-center",
        duration: 5000,
      })
      router.push("/")
    }
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
        onClick={() => loginAction.providers("google")}
        variant="secondary"
        className="flex w-full items-center rounded-xl py-6 text-lg transition hover:opacity-90"
      >
        <span>
          <FcGoogle className="size-6" />
        </span>
        Google
      </Button>

      <div className="bg-border h-px" />
      <Form {...loginForm}>
        <form
          className="space-y-4"
          onSubmit={loginForm.handleSubmit(handleSubmit)}
        >
          <FormField
            control={loginForm.control}
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
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
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
            className="text-primary block text-sm hover:underline"
          >
            Esqueci minha senha
          </Link>

          <Button type="submit" className="w-full font-semibold">
            {isLoading ? "Carregando..." : "Entrar"}
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
