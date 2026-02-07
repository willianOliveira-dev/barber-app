import {
    uuid,
    integer,
    varchar,
    text,
    timestamp,
    pgTable,
    boolean,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core';
import { barbershops } from './barbershops.schema';
import { sql } from 'drizzle-orm';

export const barbershopServices = pgTable(
    'barbershop_services',
    {
        id: uuid('id')
            .primaryKey()
            .default(sql`gen_random_uuid()`),
        imageUrl: varchar('image_url', { length: 500 }),
        name: varchar('name', { length: 150 }).notNull(),
        slug: varchar('slug', { length: 200 }).notNull(),
        description: text('description'),
        barbershopId: uuid('barbershop_id')
            .notNull()
            .references(() => barbershops.id, { onDelete: 'cascade' }),
        durationMinutes: integer('duration_minutes').notNull(),
        priceInCents: integer('price_in_cents').notNull(),
        isActive: boolean('is_active').notNull().default(true),
        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => ({
        nameIndex: index('services_name_index').on(table.name),
        barbershopIndex: index('services_barbershop_index').on(
            table.barbershopId,
        ),
        slugUnique: uniqueIndex('services_slug_unique').on(
            table.barbershopId,
            table.slug,
        ),
    }),
);
