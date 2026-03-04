import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.url().nonempty(),
  AUTH_GOOGLE_ID: z.string().nonempty(),
  AUTH_GOOGLE_SECRET: z.string().nonempty(),
  NEXTAUTH_SECRET: z.string().nonempty(),
  NEXT_PUBLIC_APP_URL: z.string().nonempty(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  SOCKET_PORT: z.coerce.number().default(3001),
  NEXT_PUBLIC_SOCKET_URL: z.string().nonempty(),
  GROQ_API_KEY: z.string().nonempty(),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("0.0.0.0"),
  NEXTAUTH_URL: z.string().nonempty(),
  OPENCAGE_API_KEY: z.string().nonempty(),
  CLOUDINARY_CLOUD_NAME: z.string().nonempty(),
  CLOUDINARY_API_KEY: z.string().nonempty(),
  CLOUDINARY_API_SECRET: z.string().nonempty(),
})

export const env = envSchema.parse(process.env)
