import { db } from "../db/connection"
import { eq } from "drizzle-orm"
import { barbershop as _barbershop, barbershopService } from "../db/schemas"

class BarbershopRepository {
  async findAll() {
    return db.select().from(_barbershop) ?? []
  }

  async findBySlug(slug: string) {
    const barbershop = await db.query.barbershop.findFirst({
      where: eq(_barbershop.slug, slug),
    })

    if (!barbershop) return null

    const services = await db
      .select()
      .from(barbershopService)
      .where(eq(barbershopService.barbershopId, barbershop.id))

    return {
      ...barbershop,
      services,
    }
  }

  async findByParams(search?: string) {
    return await db.query.barbershop.findMany({
      where: (barbershop, { ilike }) => ilike(barbershop.name, `%${search}%`),
    })
  }
}

export const barbershopRepo = new BarbershopRepository()
