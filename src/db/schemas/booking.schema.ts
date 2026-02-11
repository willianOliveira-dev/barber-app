import { pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core"
import { users } from "./users.schema"
import { barbershopServices } from "./barbershop-services.schema"
import { sql } from "drizzle-orm"

export const bookings = pgTable("bookings", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),

  serviceId: uuid("service_id")
    .notNull()
    .references(() => barbershopServices.id),

  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),

  status: varchar("status", { length: 30 }).notNull().default("scheduled"),

  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
})
