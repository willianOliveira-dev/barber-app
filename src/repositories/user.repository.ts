import { db } from "../db/connection"

export class UserRepository {
  async findByEmail(email: string) {
    return db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    })
  }

  async findById(id: string) {
    return db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    })
  }
}

export const userRepo = new UserRepository()
