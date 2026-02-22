import { notFound } from "next/navigation"
import { barbershopServiceRepo } from "../repositories/barbershop-service.repository"

export class BarbershopServiceServices {
  async findBySlug(slug: string) {
    const service = await barbershopServiceRepo.findBySlug(slug)

    if (!service || !service.isActive) {
      notFound()
    }

    return service
  }
}

export const barbershopServiceSv = new BarbershopServiceServices()
