import { pgTable, uuid, timestamp, boolean, index } from "drizzle-orm/pg-core"
import { barbershop } from "./barbershop.schema"
import { sql } from "drizzle-orm"
import { barbershopService } from "./barbershop-service.schema"
import { booking } from "./booking.schema"

export const availableTimeSlot = pgTable(
  "available_time_slot",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    barbershopId: uuid("barbershopId")
      .notNull()
      .references(() => barbershop.id, { onDelete: "cascade" }),
    serviceId: uuid("serviceId")
      .notNull()
      .references(() => barbershopService.id, { onDelete: "cascade" }),
    startTime: timestamp("startTime", { withTimezone: true }).notNull(),
    isAvailable: boolean("isAvailable").notNull().default(true),
    bookingId: uuid("bookingId").references(() => booking.id, {
      onDelete: "set null",
    }),
  },
  (table) => ({
    barbershopIndex: index("available_time_slot_barbershop_index").on(
      table.barbershopId,
    ),
    serviceIndex: index("available_time_slot_service_index").on(
      table.serviceId,
    ),
    startTimeIndex: index("available_time_slot_start_time_index").on(
      table.startTime,
    ),
    availabilityIndex: index("available_time_slot_availability_index").on(
      table.barbershopId,
      table.startTime,
      table.isAvailable,
    ),
  }),
)
