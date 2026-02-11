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

import { user } from "./user.schema"
import { sql } from "drizzle-orm"

export const barbershop = pgTable(
  "barbershop",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 150 }).notNull(),
    image: varchar("image", { length: 500 }),
    ownerId: uuid("ownerId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    description: text("description"),
    slug: varchar("slug", { length: 200 }).notNull(),

    address: varchar("address", { length: 255 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 50 }).notNull(),
    zipCode: varchar("zipCode", { length: 20 }),

    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 255 }),

    openingTime: varchar("openingTime", { length: 5 }).notNull(),
    closingTime: varchar("closingTime", { length: 5 }).notNull(),

    isActive: boolean("isActive").notNull().default(true),

    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),

    deletedAt: timestamp("deletedAt", { mode: "date", withTimezone: true }),
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
