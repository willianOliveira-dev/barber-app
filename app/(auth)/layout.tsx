import Image from "next/image"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-background flex min-h-screen w-full flex-col lg:flex-row">
      <div className="relative hidden h-screen w-2/3 lg:block">
        <div className="auth-banner">
          <span className="auth-ball auth-ball--1" />
          <span className="auth-ball auth-ball--2" />
          <span className="auth-ball auth-ball--3" />
          <span className="auth-ball auth-ball--4" />
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Image
              src="/logo-light.webp"
              alt="Ilustração de Autenticação"
              width={420}
              height={420}
              priority
              className="opacity-50 select-none"
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center px-6 lg:w-1/3">
        {children}
      </div>

      <div className="via-primary block h-5 w-full bg-linear-to-r from-[#1c7fd6] to-[#0f4fa8] lg:hidden"></div>
    </div>
  )
}
