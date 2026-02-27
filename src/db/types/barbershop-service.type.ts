import { InferSelectModel } from "drizzle-orm"
import { barbershopService } from "../schemas"

export type BarbershopService = InferSelectModel<typeof barbershopService>
export type BarbershopServiceDetails = BarbershopService & {
  category: {
    id: string
    name: string
  } | null
}

export type CreateBarbershopServiceData = {
  name: string
  slug: string
  barbershopId: string
  description?: string | null
  priceInCents: number
  durationMinutes: number
  categoryId: string
  isActive?: boolean
  image?: string | null 
}

export type UpdateBarbershopServiceData = Partial<CreateBarbershopServiceData>