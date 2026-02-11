import {
  uuid,
  integer,
  varchar,
  text,
  timestamp,
  pgTable,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { barbershop } from "./barbershop.schema"
import { sql } from "drizzle-orm"

export const barbershopService = pgTable(
  "barbershop_service",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    image: varchar("image", { length: 500 }),
    name: varchar("name", { length: 150 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull(),
    description: text("description"),
    barbershopId: uuid("barbershopId")
      .notNull()
      .references(() => barbershop.id, { onDelete: "cascade" }),
    durationMinutes: integer("durationMinutes").notNull(),
    priceInCents: integer("priceInCents").notNull(),
    isActive: boolean("isActive").notNull().default(true),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    nameIndex: index("services_name_index").on(table.name),
    barbershopIndex: index("services_barbershop_index").on(table.barbershopId),
    slugUnique: uniqueIndex("services_slug_unique").on(
      table.barbershopId,
      table.slug,
    ),
  }),
)
