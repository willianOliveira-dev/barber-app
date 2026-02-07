import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { sql } from 'drizzle-orm';
import { env } from '../config/env';
import { users, barbershopServices, barbershops, bookings } from './schemas';

const client = neon(env.DATABASE_URL);
const db = drizzle(client);

async function main() {
    try {
        console.log('Limpando banco de dados...');
        // A ordem importa por causa das chaves estrangeiras
        await db.execute(
            sql`TRUNCATE TABLE ${bookings}, ${barbershopServices}, ${barbershops}, ${users} RESTART IDENTITY CASCADE`,
        );

        console.log('Criando usuários reais...');
        const usersToInsert = Array.from({ length: 20 }).map(() => {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const username = faker.internet
                .username({ firstName, lastName })
                .toLowerCase();

            return {
                fullName: `${firstName} ${lastName}`,
                username,
                email: faker.internet
                    .email({ firstName, lastName })
                    .toLowerCase(),
                password: 'password_segura_123',
                phone: faker.phone.number(),
                avatarUrl: `https://i.pravatar.cc/150?u=${username}`,
                isActive: true,
                emailVerified: true,
            };
        });
        const insertedUsers = await db
            .insert(users)
            .values(usersToInsert)
            .returning();

        console.log('Criando barbearias com temas brasileiros...');
        const nomesBarbearias = [
            'Barbearia Navalha Afiada',
            'Corte & Estilo',
            'Dom Barbeiro',
            'O Alquimista da Barba',
            'Retro Barber Club',
            'Viking Barbearia',
            'Barba e Breja',
            'Cavalheiros Modernos',
            'Elite da Tesoura',
            'Seu Elias Style',
        ];

        const barbershopsToInsert = insertedUsers
            .slice(0, 10)
            .map((owner, index) => {
                const nome = nomesBarbearias[index];
                const slug = faker.helpers.slugify(nome).toLowerCase();
                return {
                    name: nome,
                    ownerId: owner.id,
                    slug,
                    description: `A ${nome} oferece o melhor do corte clássico e moderno em um ambiente descontraído.`,
                    address: faker.location.streetAddress(),
                    city: faker.location.city(),
                    state: faker.location.state({ abbreviated: true }),
                    zipCode: faker.location.zipCode('#####-###'),
                    phone: faker.phone.number(),
                    email: `contato@${slug}.com.br`,
                    openingTime: '09:00',
                    closingTime: '20:00',
                };
            });
        const insertedBarbershops = await db
            .insert(barbershops)
            .values(barbershopsToInsert)
            .returning();

        console.log('Adicionando serviços e fotos reais...');
        const servicosTemplates = [
            { name: 'Corte Social', price: 4500, duration: 30, img: 'haircut' },
            { name: 'Barba Terapia', price: 3500, duration: 40, img: 'beard' },
            {
                name: 'Corte Degradê (Fade)',
                price: 5500,
                duration: 45,
                img: 'fade-haircut',
            },
            { name: 'Sobrancelha', price: 1500, duration: 15, img: 'eyebrows' },
            {
                name: 'Combo Completo',
                price: 8000,
                duration: 80,
                img: 'barbershop-service',
            },
        ];

        for (const shop of insertedBarbershops) {
            const servicesForShop = servicosTemplates.map((s) => ({
                name: s.name,
                slug: faker.helpers.slugify(s.name).toLowerCase(),
                description: `Serviço profissional de ${s.name.toLowerCase()} realizado por especialistas.`,
                barbershopId: shop.id,
                priceInCents: s.price,
                durationMinutes: s.duration,
                imageUrl: `https://source.unsplash.com/featured/800x600?${s.img}`,
                isActive: true,
            }));
            const insertedServices = await db
                .insert(barbershopServices)
                .values(servicesForShop)
                .returning();

            // Criar agendamentos para cada barbearia
            const randomClient = faker.helpers.arrayElement(insertedUsers);
            const randomService = faker.helpers.arrayElement(insertedServices);

            await db.insert(bookings).values({
                userId: randomClient.id,
                serviceId: randomService.id,
                scheduledAt: faker.date.soon({ days: 7 }),
                status: 'confirmed',
            });
        }

        console.log('✅ Banco de dados limpo e populado com sucesso!');
    } catch (error) {
        console.error('❌ Erro:', error);
    }
}

main();
