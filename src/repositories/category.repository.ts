import { db } from "../db/connection"
import { Category } from "../db/types"

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return await db.query.category.findMany()
  }
}

export const categoryRepo = new CategoryRepository()
