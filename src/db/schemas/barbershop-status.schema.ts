import { sql } from "drizzle-orm"
import {
  pgTable,
  uuid,
  boolean,
  timestamp,
  text,
  index,
} from "drizzle-orm/pg-core"
import { barbershop } from "./barbershop.schema"

export const barbershopStatus = pgTable(
  "barbershop_status",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    barbershopId: uuid("barbershopId")
      .notNull()
      .references(() => barbershop.id, { onDelete: "cascade" }),
    isOpen: boolean("isOpen").notNull().default(true),
    reason: text("reason"),
    closedUntil: timestamp("closedUntil", {
      mode: "date",
      withTimezone: true,
    }),
    updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    barbershopIndex: index("barbershop_status_index").on(table.barbershopId),
  }),
)
