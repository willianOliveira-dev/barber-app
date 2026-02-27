import { DefaultSession } from "next-auth"

interface CustomUser {
  id: string
  name: string
  image: string | null
  role: string
  email: string
  emailVerified: Date | null
  password: string | null
  phone: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends CustomUser {}

  interface Session {
    user: CustomUser & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends CustomUser {
    id: string
  }
}
