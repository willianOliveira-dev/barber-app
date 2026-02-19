import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { barbershop } from "../schemas"

export type Barbershop = InferSelectModel<typeof barbershop>
export type NewBarbershop = InferInsertModel<typeof barbershop>

export interface Coordinates {
  lat: number
  lng: number
}

export interface NearbyBarbershop {
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

export interface UserLocationState {
  coordinates: Coordinates | null
  loading: boolean
  error: string | null
}
