import bcrypt from "bcryptjs"

export class BcryptUtil {
  async hashAsync(password: string, saltRounds = 10): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds)
    return bcrypt.hash(password, salt)
  }

  async compareAsync(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
  hashSync(password: string, saltRounds = 10): string {
    const salt = bcrypt.genSaltSync(saltRounds)
    return bcrypt.hashSync(password, salt)
  }

  compareSync(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash)
  }
}

export const bcryptUtil = new BcryptUtil()
