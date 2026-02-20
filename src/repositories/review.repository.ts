import { db } from "../db/connection"
import { review, reviewLike } from "../db/schemas"
import { eq, and, desc, asc, sql, or, inArray } from "drizzle-orm"
import { GetStatsByBarbershop, ReviewRating, ReviewSortBy, ReviewWithRelationsCursorPagination } from "../db/types/review.type"

export interface GetReviewsParams {
  barbershopId: string
  rating?: ReviewRating | ReviewRating[]
  sortBy?: ReviewSortBy
  cursor?: {
    id: string
    createdAt: Date
  }
  limit?: number
  userId?: string
}

export class ReviewRepository {
  async findWithCursorPagination(params: GetReviewsParams): Promise<ReviewWithRelationsCursorPagination> {
    const {
      barbershopId,
      rating,
      sortBy = "recent",
      cursor,
      limit = 5,
      userId,
    } = params

    const safeLimit = Math.min(limit, 5)
    const filters = []

    filters.push(eq(review.barbershopId, barbershopId))

    if (cursor) {
      const isDescending = sortBy === "recent" || sortBy === "highest"

      if (isDescending) {
        filters.push(
          or(
            sql`${review.createdAt} < ${cursor.createdAt}`,
            and(
              sql`${review.createdAt} = ${cursor.createdAt}`,
              sql`${review.id} > ${cursor.id}`,
            ),
          ),
        )
      } else {
        filters.push(
          or(
            sql`${review.createdAt} > ${cursor.createdAt}`,
            and(
              sql`${review.createdAt} = ${cursor.createdAt}`,
              sql`${review.id} > ${cursor.id}`,
            ),
          ),
        )
      }
    }

    if (rating) {
      if (Array.isArray(rating)) {
        filters.push(inArray(review.rating, rating))
      } else {
        filters.push(eq(review.rating, rating))
      }
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined

    let orderByClause
    switch (sortBy) {
      case "oldest":
        orderByClause = [asc(review.createdAt), asc(review.id)]
        break
      case "highest":
        orderByClause = [
          desc(review.rating),
          desc(review.createdAt),
          desc(review.id),
        ]
        break
      case "lowest":
        orderByClause = [
          asc(review.rating),
          desc(review.createdAt),
          desc(review.id),
        ]
        break
      case "recent":
      default:
        orderByClause = [desc(review.createdAt), desc(review.id)]
        break
    }

    const results = await db.query.review.findMany({
      where: whereClause,
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
        booking: {
          with: {
            service: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: orderByClause,
      limit: safeLimit + 1,
    })

    const reviewIds = results.map((r) => r.id)
    const likeCounts = await this.getLikeCounts(reviewIds)

    const userLikes = userId
      ? await this.getUserLikes(userId, reviewIds)
      : new Set()

    const reviewsWithLikeCounts = results.map((r) => ({
      ...r,
      likeCount: likeCounts[r.id] || 0,
      isLikedByUser: userLikes.has(r.id),
    }))

    const hasMore = reviewsWithLikeCounts.length > safeLimit
    const reviews = hasMore
      ? reviewsWithLikeCounts.slice(0, safeLimit)
      : reviewsWithLikeCounts

    const nextCursor = hasMore
      ? {
          createdAt: reviews[reviews.length - 1].createdAt,
          id: reviews[reviews.length - 1].id,
        }
      : null

    return {
      reviews,
      meta: {
        nextCursor,
        hasMore,
        total: reviews.length,
      },
    }
  }

  async getLikeCounts(reviewIds: string[]): Promise<Record<string, number>> {
    if (reviewIds.length === 0) return {}

    const results = await db
      .select({
        reviewId: reviewLike.reviewId,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(reviewLike)
      .where(inArray(reviewLike.reviewId, reviewIds))
      .groupBy(reviewLike.reviewId)

    return results.reduce(
      (acc, { reviewId, count }) => {
        acc[reviewId] = count
        return acc
      },
      {} as Record<string, number>,
    )
  }

  async getUserLikes(
    userId: string,
    reviewIds: string[],
  ): Promise<Set<string>> {
    if (reviewIds.length === 0) return new Set()

    const results = await db
      .select({
        reviewId: reviewLike.reviewId,
      })
      .from(reviewLike)
      .where(
        and(
          eq(reviewLike.userId, userId),
          inArray(reviewLike.reviewId, reviewIds),
        ),
      )

    return new Set(results.map((r) => r.reviewId))
  }

  async getStatsByBarbershop(barbershopId: string): Promise<GetStatsByBarbershop> {
    const [result] = await db
      .select({
        totalReviews: sql<number>`COUNT(*)::int`,
        averageRating: sql<number>`ROUND(AVG(${review.rating})::numeric, 1)::float`,
        rating5: sql<number>`COUNT(CASE WHEN ${review.rating} = 5 THEN 1 END)::int`,
        rating4: sql<number>`COUNT(CASE WHEN ${review.rating} = 4 THEN 1 END)::int`,
        rating3: sql<number>`COUNT(CASE WHEN ${review.rating} = 3 THEN 1 END)::int`,
        rating2: sql<number>`COUNT(CASE WHEN ${review.rating} = 2 THEN 1 END)::int`,
        rating1: sql<number>`COUNT(CASE WHEN ${review.rating} = 1 THEN 1 END)::int`,
      })
      .from(review)
      .where(eq(review.barbershopId, barbershopId))

    return {
      totalReviews: result.totalReviews || 0,
      averageRating: result.averageRating || 0,
      ratingDistribution: {
        5: result.rating5 || 0,
        4: result.rating4 || 0,
        3: result.rating3 || 0,
        2: result.rating2 || 0,
        1: result.rating1 || 0,
      },
    }
  }

  async findById(id: string, userId?: string) {
    const reviewData = await db.query.review.findFirst({
      where: eq(review.id, id),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
        barbershop: {
          columns: {
            id: true,
            name: true,
            image: true,
            slug: true,
            ownerId: true,
          },
        },
        booking: {
          with: {
            service: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!reviewData) return null

    const likeCounts = await this.getLikeCounts([reviewData.id])
    const userLikes = userId
      ? await this.getUserLikes(userId, [reviewData.id])
      : new Set()

    return {
      ...reviewData,
      likeCount: likeCounts[reviewData.id] || 0,
      isLikedByUser: userLikes.has(reviewData.id),
    }
  }

  async findByBookingId(bookingId: string) {
    return await db.query.review.findFirst({
      where: eq(review.bookingId, bookingId),
    })
  }

  async create(data: typeof review.$inferInsert) {
    return await db.insert(review).values(data).returning()
  }

  async update(id: string, data: Partial<typeof review.$inferInsert>) {
    return await db
      .update(review)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(review.id, id))
      .returning()
  }

  async delete(id: string) {
    return await db.delete(review).where(eq(review.id, id)).returning()
  }

  async likeReview(reviewId: string, userId: string) {
    const existing = await db.query.reviewLike.findFirst({
      where: and(
        eq(reviewLike.reviewId, reviewId),
        eq(reviewLike.userId, userId),
      ),
    })

    if (existing) {
      throw new Error("Você já curtiu esta avaliação")
    }

    return await db.insert(reviewLike).values({ reviewId, userId }).returning()
  }

  async unlikeReview(reviewId: string, userId: string) {
    return await db
      .delete(reviewLike)
      .where(
        and(eq(reviewLike.reviewId, reviewId), eq(reviewLike.userId, userId)),
      )
      .returning()
  }

  async respondToReview(reviewId: string, response: string) {
    return await db
      .update(review)
      .set({
        response,
        respondedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(review.id, reviewId))
      .returning()
  }

  async canUserReview(userId: string, bookingId: string): Promise<boolean> {
    const bookingData = await db.query.booking.findFirst({
      where: and(eq(review.bookingId, bookingId), eq(review.userId, userId)),
    })

    if (!bookingData) return false
    if (bookingData.status !== "completed") return false

    const existingReview = await this.findByBookingId(bookingId)
    if (existingReview) return false

    return true
  }
}

export const reviewRepo = new ReviewRepository()
