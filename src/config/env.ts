import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.url().nonempty(),
  AUTH_GOOGLE_ID: z.string().nonempty(),
  AUTH_GOOGLE_SECRET: z.string().nonempty(),
})

export const env = envSchema.parse(process.env)
