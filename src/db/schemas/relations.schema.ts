import { relations } from "drizzle-orm"
import { booking } from "./booking.schema"
import { user } from "./user.schema"
import { barbershop } from "./barbershop.schema"
import { barbershopService } from "./barbershop-service.schema"

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
}))

export const userRelations = relations(user, ({ many }) => ({
  bookings: many(booking),
}))

export const barbershopRelations = relations(barbershop, ({ many, one }) => ({
  bookings: many(booking),

  services: many(barbershopService),

  owner: one(user, {
    fields: [barbershop.ownerId],
    references: [user.id],
  }),
}))

export const barbershopServiceRelations = relations(
  barbershopService,
  ({ many, one }) => ({
    bookings: many(booking),

    barbershop: one(barbershop, {
      fields: [barbershopService.barbershopId],
      references: [barbershop.id],
    }),
  }),
)
