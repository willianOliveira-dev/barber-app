import { db } from "../db/connection"
import { and, eq, gt, isNull, sql } from "drizzle-orm"
import { conversation, message } from "../db/schemas"

export class ConversationRepository {
  async findById(id: string) {
    return await db.query.conversation.findFirst({
      where: and(eq(conversation.id, id), isNull(conversation.deletedAt)),
      with: {
        messages: {
          where: isNull(message.deletedAt),
          orderBy: (m, { asc }) => [asc(m.createdAt)],
        },
        barbershop: {
          columns: {
            id: true,
            name: true,
            phone: true,
            email: true,
            address: true,
            city: true,
            state: true,
          },
        },
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })
  }
  async findByUserAndBarbershop(userId: string, barbershopId: string) {
    return await db.query.conversation.findFirst({
      where: and(
        eq(conversation.userId, userId),
        eq(conversation.barbershopId, barbershopId),
        isNull(conversation.deletedAt),
      ),
      with: {
        messages: {
          where: isNull(message.deletedAt),
          orderBy: (m, { asc }) => [asc(m.createdAt)],
        },
      },
    })
  }
  async findActiveByBarbershop(barbershopId: string) {
    return await db.query.conversation.findMany({
      where: and(
        eq(conversation.barbershopId, barbershopId),
        isNull(conversation.deletedAt),
      ),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        messages: {
          where: isNull(message.deletedAt),
          orderBy: (m, { desc }) => [desc(m.createdAt)],
          limit: 1,
        },
      },
      orderBy: (c, { desc }) => [desc(c.updatedAt)],
    })
  }
  async findUnreadByBarbershop(barbershopId: string) {
    return await db.query.conversation.findMany({
      where: and(
        eq(conversation.barbershopId, barbershopId),
        isNull(conversation.deletedAt),
        gt(conversation.unreadByBarbershop, 0),
      ),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: (c, { desc }) => [desc(c.updatedAt)],
    })
  }
  async create(data: typeof conversation.$inferInsert) {
    const [created] = await db.insert(conversation).values(data).returning()
    return created
  }

  async update(id: string, data: Partial<typeof conversation.$inferInsert>) {
    const [updated] = await db
      .update(conversation)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(conversation.id, id))
      .returning()
    return updated
  }
  
  async incrementUnread(id: string, target: "user" | "barbershop") {
    const field =
      target === "user"
        ? conversation.unreadByUser
        : conversation.unreadByBarbershop

    await db
      .update(conversation)
      .set({ [field.name]: sql`${field} + 1`, updatedAt: new Date() })
      .where(eq(conversation.id, id))
  }
  async resetUnread(id: string, target: "user" | "barbershop") {
    const field = target === "user" ? "unreadByUser" : "unreadByBarbershop"

    await db
      .update(conversation)
      .set({ [field]: 0, updatedAt: new Date() })
      .where(eq(conversation.id, id))
  }
  async delete(id: string) {
    await db
      .update(conversation)
      .set({ deletedAt: new Date() })
      .where(eq(conversation.id, id))
  }
}

export const conversationRepo = new ConversationRepository()
