"use client"

import { signIn, SignInResponse } from "next-auth/react"

type ProviderOptions = "google"

export class LoginAction {
  async credentials(
    email: string,
    password: string,
  ): Promise<SignInResponse | undefined> {
    return signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    })
  }

  async provider(
    provider: ProviderOptions,
  ): Promise<SignInResponse | undefined> {
    return signIn(provider, {
      redirect: false,
      callbackUrl: "/",
    })
  }
}

export const loginAction = new LoginAction()
