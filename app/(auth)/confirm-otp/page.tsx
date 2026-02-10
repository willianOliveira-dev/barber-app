// app/(auth)/confirm-otp/page.tsx
"use client"

import { Button } from "@/app/_components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/app/_components/ui/input-otp"
import Image from "next/image"
import Link from "next/link"

export default function ConfirmOtpPage() {
  function handleConfirm(code: string) {
    console.log("OTP confirmado:", code)
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <Link href="/">
          <Image alt="Razor Barber" src="/logo.webp" width={180} height={22} />
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Confirme seu código</h1>
        <p className="mt-1 text-sm text-gray-400">
          Enviamos um código para seu e-mail
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 p-2">
        <InputOTP maxLength={6} onComplete={handleConfirm}>
          <InputOTPGroup>
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot
                inputMode="numeric"
                className="size-13.5 text-lg font-semibold md:size-14.5 md:text-xl"
                key={i}
                index={i}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <Button type="submit" className="w-full font-semibold">
          Confirmar código
        </Button>
      </div>

      <div className="space-y-2 text-center text-sm">
        <p className="text-gray-400">Não recebeu o código?</p>
        <Button variant="secondary" className="transition hover:opacity-90">
          Reenviar código
        </Button>
      </div>
    </div>
  )
}
