import { db } from "../db/connection"
import { barbershops } from "../db/schemas"

class BarbershopRepository {
  async findAll() {
    return db.select().from(barbershops)
  }
}

export const barbershopsRepo = new BarbershopRepository()
