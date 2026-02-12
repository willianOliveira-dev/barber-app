import { db } from "../db/connection"
import { countDistinct, eq, ilike, or } from "drizzle-orm"
import { barbershop, barbershopService } from "../db/schemas"

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
    serviceName?: string,
    page: number = 1,
    limit: number = 12,
  ) {
    const safeLimit = Math.min(12, limit)

    const totalResult = await db
      .select({ count: countDistinct(barbershop.id) })
      .from(barbershop)
      .leftJoin(
        barbershopService,
        eq(barbershop.id, barbershopService.barbershopId),
      )
      .where(
        or(
          search ? ilike(barbershop.name, `%${search}%`) : undefined,
          serviceName
            ? ilike(barbershopService.name, `%${serviceName}%`)
            : undefined,
        ),
      )

    const total = Number(totalResult.at(0)?.count ?? 0)

    const totalPages = Math.ceil(total / safeLimit) || 1

    const safePage = Math.min(page, totalPages)

    const offset = (safePage - 1) * safeLimit

    const data = await db
      .selectDistinct({ barbershop: barbershop })
      .from(barbershop)
      .leftJoin(
        barbershopService,
        eq(barbershop.id, barbershopService.barbershopId),
      )
      .where(
        or(
          search ? ilike(barbershop.name, `%${search}%`) : undefined,
          serviceName
            ? ilike(barbershopService.name, `%${serviceName}%`)
            : undefined,
        ),
      )
      .limit(safeLimit)
      .offset(offset)

    const barbershops = data.map((b) => b.barbershop)

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
