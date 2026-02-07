import { sql } from 'drizzle-orm';
import { pgTable, varchar, uuid, text, boolean, timestamp, uniqueIndex, index} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
    fullName: varchar('full_name', { length: 150 }).notNull(),
    avatarUrl: varchar('avatar_url', { length: 500 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    username: varchar("username", { length: 50 }).unique(),
    phone: varchar('phone', { length: 20 }),
    isActive: boolean('is_active').notNull().default(true),
    emailVerified: boolean('email_verified').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true}).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', {withTimezone: true})
}, (table) => ({
    emailIndex: index('users_email_index').on(table.email),
    usernameIndex: index('users_username_index').on(table.username)
}));
