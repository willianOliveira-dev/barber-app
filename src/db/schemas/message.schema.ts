import {
  pgTable,
  uuid,
  pgEnum,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { conversation } from "./conversation.schema"
import { user } from "./user.schema"
import { barbershop } from "./barbershop.schema"

export const senderTypeEnum = pgEnum("sender_type", [
  "user",
  "barbershop",
  "bot",
])

export const message = pgTable("message", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  conversationId: uuid("conversationId")
    .notNull()
    .references(() => conversation.id, { onDelete: "cascade" }),

  // remetente — apenas um dos dois será preenchido
  senderType: senderTypeEnum("senderType").notNull(),
  senderUserId: uuid("senderUserId").references(() => user.id),
  senderBarbershopId: uuid("senderBarbershopId").references(
    () => barbershop.id,
  ),

  content: text("content").notNull(),

  // controle de leitura por mensagem
  readByUser: boolean("readByUser").notNull().default(false),
  readByBarbershop: boolean("readByBarbershop").notNull().default(false),

  deletedAt: timestamp("deletedAt", { withTimezone: true }),

  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
})
