import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { barbershop } from "../schemas"

export type Barbershop = InferSelectModel<typeof barbershop>
export type NewBarbershop = InferInsertModel<typeof barbershop>
export type BarbershopWithRatings = {
  averageRating: number
  totalReviews: number
}

export type BarbershopSummary = {
  id: string
  name: string
  description: string | null
  slug: string
  image: string | null
  address: string
  city: string
  state: string
  phone: string | null
  email: string | null
  latitude: string | null
  longitude: string | null
} & BarbershopWithRatings

export type PopularBarbershop = {
  totalBookings: number
} & BarbershopSummary

export type BarbershopWithRelations = any & BarbershopWithRatings
export type Coordinates = {
  lat: number
  lng: number
}
export type NearbyBarbershop = {
  id: string
  name: string
  slug: string
  latitude: number
  longitude: number
  address: string
  city: string
  state: string
  zipCode: string | null
  phone: string | null
  image: string | null
  distance: number // quilometros
}
export type UserLocationState = {
  coordinates: Coordinates | null
  loading: boolean
  error: string | null
}
