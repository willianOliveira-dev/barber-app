import { db } from "../db/connection"
import { eq } from "drizzle-orm"
import { barbershops, barbershopServices } from "../db/schemas"

class BarbershopRepository {
  async findAll() {
    return db.select().from(barbershops)
  }

  async findBySlug(slug: string) {
    const barbershop = await db.query.barbershops.findFirst({
      where: eq(barbershops.slug, slug),
    })

    if (!barbershop) return null

    const services = await db
      .select()
      .from(barbershopServices)
      .where(eq(barbershopServices.barbershopId, barbershop.id))

    return {
      ...barbershop,
      services,
    }
  }
}

export const barbershopsRepo = new BarbershopRepository()
