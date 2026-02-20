import { InferSelectModel } from "drizzle-orm"
import { review } from "../schemas"

export type ReviewRating = 1 | 2 | 3 | 4 | 5
export type ReviewSortBy = "recent" | "oldest" | "highest" | "lowest"
export type BaseReview = InferSelectModel<typeof review>
export type ReviewWithRelations = BaseReview & {
  likeCount: number
  isLikedByUser: boolean
  user: {
    id: string
    name: string
    image: string | null
  }
  barbershop: {
    id: true
    name: true
    image: true
    slug: true
    ownerId: true
  }
  booking: {
    id: string
    userId: string
    barbershopId: string
    createdAt: Date
    updatedAt: Date
    serviceId: string
    scheduledAt: Date
    endTime: Date
    status: "confirmed" | "completed" | "cancelled"
    notes: string | null
    cancelledAt: Date | null
    service: {
      id: string
      name: string
    }
  }
}
export type ReviewWithRelationsCursorPagination = {
  reviews: Omit<ReviewWithRelations, "barbershop">[]
  meta: {
    nextCursor: {
      id: string
      createdAt: Date
    } | null
    hasMore: boolean
    total: number
  }
}

export type GetStatsByBarbershop = {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}
