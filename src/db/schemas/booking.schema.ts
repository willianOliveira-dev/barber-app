import { pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core"
import { user } from "./user.schema"
import { barbershopService } from "./barbershop-service.schema"
import { sql } from "drizzle-orm"

export const booking = pgTable("booking", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  userId: uuid("userId")
    .notNull()
    .references(() => user.id),

  serviceId: uuid("serviceId")
    .notNull()
    .references(() => barbershopService.id),

  scheduledAt: timestamp("scheduledAt", { withTimezone: true }).notNull(),

  status: varchar("status", { length: 30 }).notNull().default("scheduled"),

  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
})
