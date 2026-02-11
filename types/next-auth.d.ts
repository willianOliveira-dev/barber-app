import { DefaultSession } from "next-auth"

interface CustomUser {
  id: string
  fullName: string
  avatarUrl: string | null
  email: string
  username: string | null
  phone: string | null
  isActive: boolean
  emailVerified: Date | null
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
