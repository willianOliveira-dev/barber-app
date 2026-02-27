import { db } from "@/src/db/connection"
import type {
  BarbershopService,
  BarbershopServiceDetails,
  CreateBarbershopServiceData,
  UpdateBarbershopServiceData,
} from "../db/types"
import { barbershopService, booking } from "../db/schemas"
import { eq, isNull } from "drizzle-orm"

export class BarbershopServiceRepo {
  async findBySlug(slug: string): Promise<BarbershopServiceDetails | null> {
    const result = await db.query.barbershopService.findFirst({
      with: {
        category: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      where: (table, { eq, and }) =>
        and(
          eq(table.slug, slug),
          eq(table.isActive, true),
          isNull(table.deletedAt),
        ),
    })

    return result ?? null
  }

  async create(data: CreateBarbershopServiceData): Promise<BarbershopService> {
    const [createdService] = await db
      .insert(barbershopService)
      .values(data)
      .returning()
    return createdService
  }

  async update(
    id: string,
    data: UpdateBarbershopServiceData,
  ): Promise<BarbershopService | null> {
    const [updatedService] = await db
      .update(barbershopService)
      .set(data)
      .where(eq(barbershopService.id, id))
      .returning()

    return updatedService ?? null
  }
  async hasBooking(serviceId: string): Promise<boolean> {
    const result = await db
      .select({ id: booking.id })
      .from(booking)
      .where(eq(booking.serviceId, serviceId))
      .limit(1)
    return result.length > 0
  }

  async delete(id: string): Promise<BarbershopService | null> {
    const [deletedService] = await db
      .update(barbershopService)
      .set({
        isActive: false,
        deletedAt: new Date(),
      })
      .where(eq(barbershopService.id, id))
      .returning()
    return deletedService ?? null
  }
}

export const barbershopServiceRepo = new BarbershopServiceRepo()
