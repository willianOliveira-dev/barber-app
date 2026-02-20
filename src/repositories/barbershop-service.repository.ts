import { db } from "../db/connection"

export class BarbershopServiceRepo {
  async findBySlug(slug: string) {
    return await db.query.barbershopService.findFirst({
      where: (barbershoService, { eq }) => eq(barbershoService.slug, slug),
    })
  }
}

export const barbershopServiceRepo = new BarbershopServiceRepo()
