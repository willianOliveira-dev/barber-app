import { InferSelectModel } from "drizzle-orm"
import { booking } from "../schemas"

export type BaseBooking = InferSelectModel<typeof booking>

export type BookingStatus = "confirmed" | "completed" | "cancelled"

export type BookingWithRelations = BaseBooking & {
  barbershop: {
    id: string
    name: string
    slug: string
    image: string | null
    address: string
    city: string
    zipCode: string | null
    state: string
    phone: string | null
    email: string | null
  }
  user: {
    id: string
    email: string
    name: string
    image: string | null
  }
  service: {
    id: string
    name: string
    priceInCents: number
    durationMinutes: number
  }
}
