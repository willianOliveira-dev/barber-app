import { sql } from "drizzle-orm"
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
  numeric,
} from "drizzle-orm/pg-core"
import { user } from "./user.schema"

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
    zipCode: varchar("zipCode", { length: 20 }).notNull(),
    streetNumber: varchar("streetNumber", { length: 20 }).notNull(),
    complement: varchar("complement", { length: 100 }),
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 255 }),
    website: varchar("website", { length: 255 }),
    latitude: numeric("latitude", { precision: 9, scale: 6 }),
    longitude: numeric("longitude", { precision: 9, scale: 6 }),
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
    ownerIdIndex: index("barbershops_owner_index").on(table.ownerId),
    slugUnique: uniqueIndex("barbershops_owner_slug_unique").on(
      table.slug,
      table.ownerId,
    ),
    nameIndex: index("barbershops_name_index").on(table.name),
    cityIndex: index("barbershops_city_index").on(table.city),
    latIndex: index("barbershops_latitude_index").on(table.latitude),
    lngIndex: index("barbershops_longitude_index").on(table.longitude),
  }),
)
