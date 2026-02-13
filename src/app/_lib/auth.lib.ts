import { userRepo } from "@/src/repositories/user.repository"
import { type AuthOptions } from "next-auth"
import { bcryptUtil } from "../_utils/bcrypt.util"
import { signInSchema } from "./zod.lib"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { Adapter } from "next-auth/adapters"
import { db } from "@/src/db/connection"
import { env } from "@/src/config/env"

import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

interface AuthorizeCredentialOptions {
  email: string
  password: string
}

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,

  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),

    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      // @ts-expect-error - NextAuth Credentials authorize typing is incompatible with custom user model
      async authorize(credentials: AuthorizeCredentialOptions | undefined) {
        const { email, password } = await signInSchema.parseAsync(credentials)

        const user = await userRepo.findByEmail(email)

        if (!user) {
          throw new Error("USER_NOT_FOUND")
        }

        if (!user.password) {
          throw new Error("USER_WITHOUT_PASSWORD")
        }

        const passwordIsValid = await bcryptUtil.compareAsync(
          password,
          user.password,
        )

        if (!passwordIsValid) {
          throw new Error("INVALID_PASSWORD")
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user

        return userWithoutPassword
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.emailVerified = user.emailVerified
        return token
      }

      const userId = token.sub

      if (userId) {
        const latestUser = await userRepo.findById(userId)

        if (latestUser) {
          token.emailVerified = latestUser.emailVerified
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.emailVerified = token.emailVerified
      }

      return session
    },
  },

  pages: {
    signIn: "/login",
  },
}
