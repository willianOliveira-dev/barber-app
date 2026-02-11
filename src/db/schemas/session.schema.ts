import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { user } from "./user.schema"

export const session = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),

  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  expires: timestamp("expires", { mode: "date" }).notNull(),
})
