import { sql } from "drizzle-orm"
import {
  pgTable,
  uuid,
  varchar,
  boolean,
  index,
  pgEnum,
} from "drizzle-orm/pg-core"
import { barbershop } from "./barbershop.schema"

export const dayOfWeekEnum = pgEnum("day_of_week", [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
])

export const barbershopHour = pgTable(
  "barbershop_hour",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    barbershopId: uuid("barbershopId")
      .notNull()
      .references(() => barbershop.id, { onDelete: "cascade" }),
    dayOfWeek: dayOfWeekEnum("dayOfWeek").notNull(),
    openingTime: varchar("openingTime", { length: 5 }).notNull(),
    closingTime: varchar("closingTime", { length: 5 }).notNull(),
    isOpen: boolean("isOpen").notNull().default(true),
  },
  (table) => ({
    barbershopIndex: index("barbershop_hours_index").on(table.barbershopId),
  }),
)
