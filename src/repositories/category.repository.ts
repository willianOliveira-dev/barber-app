import { db } from "../db/connection"

export class CategoryRepository {
  async findAll() {
    return await db.query.category.findMany()
  }
}

export const categoryRepo = new CategoryRepository()
