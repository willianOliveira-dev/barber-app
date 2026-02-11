"use client"
import { signIn } from "next-auth/react"

type ProviderOptions = "google" // | facebook ...

export class LoginAction {
  async crendetials(email: string, password: string): Promise<void> {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
  }
  async providers(provider: ProviderOptions): Promise<void> {
    await signIn(provider, {
      redirect: false,
    })
  }
}

export const loginAction = new LoginAction()
