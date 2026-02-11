import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.url().nonempty(),
  AUTH_GOOGLE_ID: z.string().nonempty(),
  AUTH_GOOGLE_SECRET: z.string().nonempty(),
  NEXT_PUBLIC_URL: z.string().nonempty(),
  NEXTAUTH_SECRET: z.string().nonempty(),
  NEXTAUTH_URL: z.string().nonempty(),
})

export const env = envSchema.parse(process.env)
