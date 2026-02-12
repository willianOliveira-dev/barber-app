import { pgTable, uuid, timestamp, boolean, index } from "drizzle-orm/pg-core"
import { barbershop } from "./barbershop.schema"
import { sql } from "drizzle-orm"

export const availableTimeSlot = pgTable(
  "available_time_slot",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    barbershopId: uuid("barbershopId")
      .notNull()
      .references(() => barbershop.id, { onDelete: "cascade" }),
    startTime: timestamp("startTime", { withTimezone: true }).notNull(),
    endTime: timestamp("endTime", { withTimezone: true }).notNull(),
    isAvailable: boolean("isAvailable").notNull().default(true),
  },
  (table) => ({
    barbershopIndex: index("available_time_slot_barbershop_index").on(
      table.barbershopId,
    ),
    startTimeIndex: index("available_time_slot_start_time_index").on(
      table.startTime,
    ),
  }),
)
