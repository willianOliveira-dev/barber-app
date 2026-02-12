import { db } from "../db/connection"
import { and, countDistinct, eq, ilike, or } from "drizzle-orm"
import { barbershop, barbershopService, category } from "../db/schemas"

class BarbershopRepository {
  async findAll() {
    return db.select().from(barbershop) ?? []
  }

  async findBySlug(slug: string) {
    const _barbershop = await db.query.barbershop.findFirst({
      where: eq(barbershop.slug, slug),
    })

    if (!_barbershop) return null

    const services = await db
      .select()
      .from(barbershopService)
      .where(eq(barbershopService.barbershopId, _barbershop.id))

    return {
      ..._barbershop,
      services,
    }
  }

  async findByParams(
    search?: string,
    categorySlug?: string,
    page: number = 1,
    limit: number = 12,
  ) {
    const safeLimit = Math.min(limit, 12)

    const filters = []

    if (search) {
      filters.push(ilike(barbershop.name, `%${search}%`))
    }

    if (categorySlug) {
      filters.push(eq(category.slug, categorySlug))
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined

    const totalResult = await db
      .select({ count: countDistinct(barbershop.id) })
      .from(barbershop)
      .leftJoin(
        barbershopService,
        eq(barbershop.id, barbershopService.barbershopId),
      )
      .leftJoin(category, eq(barbershopService.categoryId, category.id))
      .where(whereClause)

    const total = Number(totalResult[0]?.count ?? 0)
    const totalPages = Math.max(1, Math.ceil(total / safeLimit))
    const safePage = Math.min(page, totalPages)
    const offset = (safePage - 1) * safeLimit

    const data = await db
      .selectDistinct({ barbershop })
      .from(barbershop)
      .leftJoin(
        barbershopService,
        eq(barbershop.id, barbershopService.barbershopId),
      )
      .leftJoin(category, eq(barbershopService.categoryId, category.id))
      .where(whereClause)
      .limit(safeLimit)
      .offset(offset)

    const barbershops = data.map((item) => item.barbershop)

    return {
      barbershops,
      meta: {
        total,
        page: safePage,
        totalPages,
        limit: safeLimit,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1,
      },
    }
  }
}

export const barbershopRepo = new BarbershopRepository()
