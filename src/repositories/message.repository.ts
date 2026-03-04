import { db } from "../db/connection"
import { and, eq, isNull } from "drizzle-orm"
import { message } from "../db/schemas"

export class MessageRepository {
  async findByConversation(conversationId: string) {
    return await db.query.message.findMany({
      where: and(
        eq(message.conversationId, conversationId),
        isNull(message.deletedAt),
      ),
      orderBy: (m, { asc }) => [asc(m.createdAt)],
    })
  }

  async create(data: typeof message.$inferInsert) {
    const [created] = await db.insert(message).values(data).returning()
    return created
  }

  async markReadByUser(conversationId: string) {
    await db
      .update(message)
      .set({ readByUser: true })
      .where(
        and(
          eq(message.conversationId, conversationId),
          eq(message.readByUser, false),
        ),
      )
  }

  async markReadByBarbershop(conversationId: string) {
    await db
      .update(message)
      .set({ readByBarbershop: true })
      .where(
        and(
          eq(message.conversationId, conversationId),
          eq(message.readByBarbershop, false),
        ),
      )
  }

  async delete(id: string) {
    await db
      .update(message)
      .set({ deletedAt: new Date() })
      .where(eq(message.id, id))
  }
}

export const messageRepo = new MessageRepository()
