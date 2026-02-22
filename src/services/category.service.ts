import { categoryRepo } from "../repositories/category.repository"

export class CategoryService {
  async getCategories() {
    return categoryRepo.findAll()
  }
}
export const categorySv = new CategoryService()
