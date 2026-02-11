import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core"

import { users } from "./users.schema"
import { sql } from "drizzle-orm"

export const barbershops = pgTable(
  "barbershops",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 150 }).notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    description: text("description"),
    slug: varchar("slug", { length: 200 }).notNull(),

    address: varchar("address", { length: 255 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 50 }).notNull(),
    zipCode: varchar("zip_code", { length: 20 }),

    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 255 }),

    openingTime: varchar("opening_time", { length: 5 }).notNull(),
    closingTime: varchar("closing_time", { length: 5 }).notNull(),

    isActive: boolean("is_active").notNull().default(true),

    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),

    deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
  },
  (table) => ({
    ownerId: index("barbershops_owner_index").on(table.ownerId),
    slugUnique: uniqueIndex("barbershops_owner_slug_unique").on(
      table.slug,
      table.ownerId,
    ),
    nameIndex: index("barbershops_name_index").on(table.name),
    cityIndex: index("barbershops_city_index").on(table.city),
  }),
)
