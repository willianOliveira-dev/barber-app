import { relations } from "drizzle-orm"
import { booking } from "./booking.schema"
import { user } from "./user.schema"
import { barbershop } from "./barbershop.schema"
import { barbershopService } from "./barbershop-service.schema"
import { category } from "./category.schema"
import { barbershopHour } from "./barbershop-hour.schema"
import { barbershopStatus } from "./barbershop-status.schema"
import { account } from "./account.schema"
import { review, reviewLike } from "./review.schema"
import { conversation } from "./conversation.schema"
import { message } from "./message.schema"

export const userRelations = relations(user, ({ many }) => ({
  bookings: many(booking),
  barbershops: many(barbershop),
  accounts: many(account),
  reviews: many(review),
  reviewLikes: many(reviewLike),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const conversationRelations = relations(
  conversation,
  ({ one, many }) => ({
    user: one(user, {
      fields: [conversation.userId],
      references: [user.id],
    }),
    barbershop: one(barbershop, {
      fields: [conversation.barbershopId],
      references: [barbershop.id],
    }),
    messages: many(message),
  }),
)

export const messageRelations = relations(message, ({ one }) => ({
  conversation: one(conversation, {
    fields: [message.conversationId],
    references: [conversation.id],
  }),
  senderUser: one(user, {
    fields: [message.senderUserId],
    references: [user.id],
  }),
  senderBarbershop: one(barbershop, {
    fields: [message.senderBarbershopId],
    references: [barbershop.id],
  }),
}))

export const barbershopRelations = relations(barbershop, ({ many, one }) => ({
  bookings: many(booking),
  services: many(barbershopService),
  hours: many(barbershopHour),
  status: one(barbershopStatus),
  reviews: many(review),
  owner: one(user, {
    fields: [barbershop.ownerId],
    references: [user.id],
  }),
}))

export const barbershopHourRelations = relations(barbershopHour, ({ one }) => ({
  barbershop: one(barbershop, {
    fields: [barbershopHour.barbershopId],
    references: [barbershop.id],
  }),
}))

export const barbershopStatusRelations = relations(
  barbershopStatus,
  ({ one }) => ({
    barbershop: one(barbershop, {
      fields: [barbershopStatus.barbershopId],
      references: [barbershop.id],
    }),
  }),
)

export const categoryRelations = relations(category, ({ many }) => ({
  services: many(barbershopService),
}))

export const barbershopServiceRelations = relations(
  barbershopService,
  ({ many, one }) => ({
    bookings: many(booking),
    category: one(category, {
      fields: [barbershopService.categoryId],
      references: [category.id],
    }),
    barbershop: one(barbershop, {
      fields: [barbershopService.barbershopId],
      references: [barbershop.id],
    }),
  }),
)

export const bookingRelations = relations(booking, ({ one }) => ({
  user: one(user, {
    fields: [booking.userId],
    references: [user.id],
  }),
  barbershop: one(barbershop, {
    fields: [booking.barbershopId],
    references: [barbershop.id],
  }),
  service: one(barbershopService, {
    fields: [booking.serviceId],
    references: [barbershopService.id],
  }),
  review: one(review, {
    fields: [booking.id],
    references: [review.bookingId],
  }),
}))

export const reviewRelations = relations(review, ({ one, many }) => ({
  user: one(user, {
    fields: [review.userId],
    references: [user.id],
  }),
  barbershop: one(barbershop, {
    fields: [review.barbershopId],
    references: [barbershop.id],
  }),
  booking: one(booking, {
    fields: [review.bookingId],
    references: [booking.id],
  }),
  likes: many(reviewLike),
}))

export const reviewLikeRelations = relations(reviewLike, ({ one }) => ({
  review: one(review, {
    fields: [reviewLike.reviewId],
    references: [review.id],
  }),
  user: one(user, {
    fields: [reviewLike.userId],
    references: [user.id],
  }),
}))
