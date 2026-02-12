import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  index,
  pgEnum,
} from "drizzle-orm/pg-core"
import { user } from "./user.schema"
import { barbershopService } from "./barbershop-service.schema"
import { sql } from "drizzle-orm"
import { barbershop } from "./barbershop.schema"

export const bookingStatusEnum = pgEnum("booking_status", [
  "confirmed",
  "completed",
  "cancelled",
])

export const booking = pgTable(
  "booking",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
    serviceId: uuid("serviceId")
      .notNull()
      .references(() => barbershopService.id),
    barbershopId: uuid("barbershopId")
      .notNull()
      .references(() => barbershop.id, { onDelete: "cascade" }),
    scheduledAt: timestamp("scheduledAt", { withTimezone: true }).notNull(),
    endTime: timestamp("endTime", { withTimezone: true }).notNull(),
    status: bookingStatusEnum("status").notNull().default("confirmed"),
    notes: varchar("notes", { length: 500 }),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    cancelledAt: timestamp("cancelledAt", { mode: "date", withTimezone: true }),
  },
  (table) => ({
    userIndex: index("booking_user_index").on(table.userId),
    serviceIndex: index("booking_service_index").on(table.serviceId),
    barbershopIndex: index("booking_barbershop_index").on(table.barbershopId),
    statusIndex: index("booking_status_index").on(table.status),
    scheduledAtIndex: index("booking_scheduled_at_index").on(table.scheduledAt),
  }),
)
