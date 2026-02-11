import { sql } from "drizzle-orm"
import {
  pgTable,
  varchar,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core"

export const user = pgTable(
  "user",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 150 }).notNull(),
    image: varchar("image", { length: 500 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: timestamp("emailVerified", {
      mode: "date",
      withTimezone: true,
    }),
    password: text("password"),
    phone: varchar("phone", { length: 20 }),
    isActive: boolean("isActive").notNull().default(true),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),

    deletedAt: timestamp("deletedAt", { mode: "date", withTimezone: true }),
  },
  (table) => ({
    emailIndex: index("user_email_index").on(table.email),
  }),
)
