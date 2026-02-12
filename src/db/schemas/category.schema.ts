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
} from "drizzle-orm/pg-core"

export const category = pgTable(
  "category",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 150 }).notNull().unique(),
    description: text("description"),
    icon: varchar("icon", { length: 100 }), // Nome do ícone (ex: "scissors", "beard", "hair")
    image: varchar("image", { length: 500 }),
    isActive: boolean("isActive").notNull().default(true),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    nameIndex: index("category_name_index").on(table.name),
    slugUnique: uniqueIndex("category_slug_unique").on(table.slug),
  }),
)
