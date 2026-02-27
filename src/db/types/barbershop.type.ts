import { InferSelectModel } from "drizzle-orm"
import {
  barbershop,
  barbershopService,
  barbershopHour,
  barbershopStatus,
} from "../schemas"
import { DayOfWeekEnum } from "@/src/repositories/barbershop.repository"

export type Barbershop = InferSelectModel<typeof barbershop>
export type BarbershopService = InferSelectModel<typeof barbershopService>
export type BarbershopHour = InferSelectModel<typeof barbershopHour>
export type BarbershopStatus = InferSelectModel<typeof barbershopStatus>

export type RatingSource = { rating: number }
export type WithReviews = { reviews: RatingSource[] }
export type BarbershopWithRatings = {
  averageRating: number
  totalReviews: number
}

export type PopularBarbershop = BarbershopWithRatings & {
  id: string
  name: string
  description: string | null
  slug: string
  image: string | null
  address: string
  streetNumber: string | null
  neighborhood: string | null
  complement: string | null
  zipCode: string
  city: string
  state: string
  phone: string | null
  email: string | null
  latitude: string | null
  longitude: string | null
  totalBookings: number
}

export type BarbershopSummary = BarbershopWithRatings & {
  id: string
  name: string
  description: string | null
  slug: string
  image: string | null
  address: string
  city: string
  streetNumber: string | null
  neighborhood: string | null
  complement: string | null
  zipCode: string
  state: string
  phone: string | null
  email: string | null
  latitude: string | null
  longitude: string | null
}

export type NearbyBarbershop = BarbershopWithRatings & {
  id: string
  name: string
  slug: string
  description: string | null
  email: string | null
  latitude: number
  longitude: number
  address: string
  city: string
  state: string
  zipCode: string
  phone: string | null
  streetNumber: string | null
  neighborhood: string | null
  complement: string | null
  image: string | null
  distance: number
}

export type BarbershopDetails = BarbershopWithRatings & {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  address: string
  city: string
  state: string
  status: BarbershopStatus | null
  zipCode: string
  isActive: boolean
  phone: string | null
  email: string | null
  neighborhood: string | null
  complement: string | null
  streetNumber: string | null
  website: string | null
  latitude: string | null
  longitude: string | null
  hours: BarbershopHour[]
  owner: { id: string; name: string; email: string }
  services: (BarbershopService & {
    category: { id: string; name: string } | null
  })[]
}

export type BarbershopSearchResult = BarbershopWithRatings & {
  id: string
  name: string
  slug: string
  image: string | null
  address: string
  city: string
}

export type BarbershopOwnerResult = {
  id: string
  name: string
  slug: string
  image: string | null
  address: string
  streetNumber: string | null
  state: string
  isActive: boolean
  servicesCount: number
}

export type BarbershopServiceResult = {
  id: string
  name: string
  slug: string
  barbershopId: string
  description: string | null
  priceInCents: number
  durationMinutes: number
  image: string | null
  isActive: boolean
  category: { id: string; name: string } | null
}

export type PaginationMeta = {
  total: number
  page: number
  totalPages: number
  limit: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type CreateBarbershopStatusData = {
  isOpen: boolean
  reason?: string | null
  closedUntil?: Date | null
}

export type UpdateBarbershopStatusData = Partial<CreateBarbershopStatusData>

export type CreateBarbershopData = {
  name: string
  slug: string
  description?: string | null
  image?: string | null
  ownerId: string
  address: string
  city: string
  state: string
  zipCode: string
  streetNumber?: string
  neighborhood?: string | null
  complement?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  latitude?: string | null
  longitude?: string | null
  isActive?: boolean
}

export type UpdateBarbershopData = Partial<CreateBarbershopData>

export type CrateBarbershopHoursData = {
  dayOfWeek:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"
  openingTime: string
  closingTime: string
  isOpen: boolean
}
export type UpdateBarbershopHoursData = Partial<CrateBarbershopHoursData> & {
  dayOfWeek: DayOfWeekEnum
}
