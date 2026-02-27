import {
  pgTable,
  uuid,
  pgEnum,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { user } from "./user.schema"
import { barbershop } from "./barbershop.schema"

export const conversationStatusEnum = pgEnum("conversation_status", [
  "bot_handling", // bot respondendo
  "human_required", // bot não soube, aguardando barbeiro
  "human_handling", // barbeiro assumiu
  "resolved", // encerrada
])

export const conversation = pgTable("conversation", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  barbershopId: uuid("barbershopId")
    .notNull()
    .references(() => barbershop.id, { onDelete: "cascade" }),
  status: conversationStatusEnum("status").notNull().default("bot_handling"),

  // controle de bot
  botEnabled: boolean("botEnabled").notNull().default(true),

  // controle de não lidas por participante
  unreadByUser: integer("unreadByUser").notNull().default(0),
  unreadByBarbershop: integer("unreadByBarbershop").notNull().default(0),

  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
})
