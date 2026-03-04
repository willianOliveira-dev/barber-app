import { env } from "../config/env"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@/src/db/schemas"

export const db = drizzle(env.DATABASE_URL, { schema })
