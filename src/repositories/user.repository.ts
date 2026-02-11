import { db } from "../db/connection"

export class UserRepository {
  async findByEmail(email: string) {
    return db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    })
  }

  async findById(id: string) {
    return db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    })
  }
}

export const userRepo = new UserRepository()
