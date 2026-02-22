import { notFound } from "next/navigation"
import { barbershopRepo } from "../repositories/barbershop.repository"

export class BarbershopServices {
  async getBarbershopsWithPagination(
    search?: string,
    categorySlug?: string,
    page: number = 1,
    limit: number = 12,
  ) {
    return await barbershopRepo.findWithPagination(
      search,
      categorySlug,
      page,
      limit,
    )
  }

  async getBarbershopBySlug(slug: string) {
    const barbershop = await barbershopRepo.findBySlug(slug)

    if (!barbershop || !barbershop.isActive) {
      notFound()
    }

    return barbershop
  }

  async getRecommendedBarbershops(limit: number = 8) {
    return await barbershopRepo.findRecommended(limit)
  }

  async getPopularBarbershops(limit: number = 8) {
    return await barbershopRepo.findPopular(limit)
  }
}

export const barbershopSv = new BarbershopServices()
