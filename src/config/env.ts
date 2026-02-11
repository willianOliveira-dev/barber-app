import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.url().nonempty(),
  GOOGLE_CLIENT_ID: z.string().nonempty(),
  GOOGLE_CLIENT_SECRET: z.string().nonempty(),
})

export const env = envSchema.parse(process.env)
