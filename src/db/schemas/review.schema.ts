import { sql } from "drizzle-orm"
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core"
import { user } from "./user.schema"
import { barbershop } from "./barbershop.schema"
import { booking } from "./booking.schema"

export const review = pgTable(
  "review",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    barbershopId: uuid("barbershopId")
      .notNull()
      .references(() => barbershop.id, { onDelete: "cascade" }),
    bookingId: uuid("bookingId")
      .notNull()
      .references(() => booking.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    response: text("response"),
    respondedAt: timestamp("respondedAt", {
      mode: "date",
      withTimezone: true,
    }),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIndex: index("review_user_index").on(table.userId),
    barbershopIndex: index("review_barbershop_index").on(table.barbershopId),
    bookingIndex: index("review_booking_index").on(table.bookingId),
    ratingIndex: index("review_rating_index").on(table.rating),
    createdAtIndex: index("review_created_at_index").on(table.createdAt),
    bookingUnique: uniqueIndex("review_booking_unique").on(table.bookingId),
    ratingCheck: check(
      "review_rating_check",
      sql`${table.rating} >= 1 AND ${table.rating} <= 5`,
    ),
  }),
)

export const reviewLike = pgTable(
  "review_like",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    reviewId: uuid("reviewId")
      .notNull()
      .references(() => review.id, { onDelete: "cascade" }),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    reviewIndex: index("review_like_review_index").on(table.reviewId),
    userIndex: index("review_like_user_index").on(table.userId),
    reviewUserUnique: uniqueIndex("review_like_review_user_unique").on(
      table.reviewId,
      table.userId,
    ),
  }),
)
