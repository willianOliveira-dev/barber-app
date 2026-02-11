import { pgTable, text, integer, uuid, unique } from "drizzle-orm/pg-core"
import { user } from "./user.schema"
import type { AdapterAccountType } from "@auth/core/adapters"
import { sql } from "drizzle-orm"

export const account = pgTable(
  "account",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),

    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    providerUnique: unique("account_provider_unique").on(
      account.provider,
      account.providerAccountId,
    ),
  }),
)
