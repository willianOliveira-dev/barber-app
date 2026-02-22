import { and } from "drizzle-orm"
import { db } from "../db/connection"

export class BarbershopServiceRepo {
  async findBySlug(slug: string) {
    return db.query.barbershopService.findFirst({
      with: {
        category: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      where: (barbershoService, { eq }) =>
        and(
          eq(barbershoService.slug, slug),
          eq(barbershoService.isActive, true),
        ),
    })
  }
}

export const barbershopServiceRepo = new BarbershopServiceRepo()
