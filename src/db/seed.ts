import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { fakerPT_BR as faker } from "@faker-js/faker"
import { sql } from "drizzle-orm"
import { bcryptUtil } from "@/app/_utils/bcrypt.util"
import { env } from "../config/env"

import { user, barbershop, barbershopService, booking } from "./schemas"

const client = neon(env.DATABASE_URL)
const db = drizzle(client)

async function seed() {
  try {
    console.log("🧹 Limpando banco de dados...")
    await db.execute(
      sql`TRUNCATE TABLE ${booking}, ${barbershopService}, ${barbershop}, ${user} CASCADE`,
    )

    console.log("👥 Criando 120 usuários reais...")
    const usersToInsert = Array.from({ length: 120 }).map(() => {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      return {
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: bcryptUtil.hashSync("@Password123"),
        phone: faker.phone.number({ style: "international" }),
        image: `https://i.pravatar.cc/150?u=${faker.string.uuid()}`,
        isActive: true,
        emailVerified: faker.date.past(),
      }
    })
    const insertedUsers = await db
      .insert(user)
      .values(usersToInsert)
      .returning()

    console.log("💈 Criando 50 barbearias reais pelo Brasil...")
    const cidades = [
      "São Paulo",
      "Rio de Janeiro",
      "Curitiba",
      "Belo Horizonte",
      "Porto Alegre",
      "Florianópolis",
    ]
    const nomesFamosos = [
      "Corleone",
      "Cavalera",
      "Seu Elias",
      "Navalha Gringa",
      "Dom Barbeiro",
      "Corte Real",
      "Confraria da Barba",
    ]

    const barbershopsToInsert = Array.from({ length: 50 }).map((_, i) => {
      const nomeBase = faker.helpers.arrayElement(nomesFamosos)
      const nomeFinal = `${nomeBase} ${faker.person.lastName()}`
      const slug = `${faker.helpers.slugify(nomeFinal).toLowerCase()}-${i}`

      return {
        name: nomeFinal,
        slug,
        description: `Referência em estética masculina, a ${nomeFinal} oferece um ambiente exclusivo com profissionais premiados e o melhor da barboterapia clássica.`,

        image: `https://loremflickr.com/800/600/barbershop,interior?lock=${i}`,
        ownerId: insertedUsers[i % 50].id,
        address: faker.location.streetAddress(),
        city: faker.helpers.arrayElement(cidades),
        state: "BR",
        zipCode: faker.location.zipCode("#####-###"),
        phone: faker.phone.number(),
        email: `contato@${faker.helpers.slugify(nomeFinal).toLowerCase()}.com.br`,
        openingTime: "08:00",
        closingTime: "21:00",
        isActive: true,
      }
    })
    const insertedBarbershops = await db
      .insert(barbershop)
      .values(barbershopsToInsert)
      .returning()

    console.log("✂️ Gerando serviços com fotos reais de cortes...")

    const serviceTemplates = [
      { n: "Corte Clássico", p: 5000, d: 45, search: "haircut,man" },
      { n: "Barboterapia", p: 4500, d: 40, search: "shave,beard" },
      { n: "Degradê Moderno", p: 6500, d: 60, search: "fade,haircut" },
      { n: "Sobrancelha", p: 2500, d: 20, search: "eyebrow,grooming" },
      { n: "Combo Premium", p: 9500, d: 90, search: "barber,service" },
    ]

    for (const shop of insertedBarbershops) {
      const services = serviceTemplates.map((t, idx) => ({
        name: t.n,
        slug: `${faker.helpers.slugify(t.n).toLowerCase()}-${faker.string.nanoid(4)}`,
        description: `Tratamento completo de ${t.n.toLowerCase()} com produtos de linha internacional.`,
        image: `https://loremflickr.com/600/400/${t.search}?lock=${idx + 50}`,
        durationMinutes: t.d,
        priceInCents: t.p,
        isActive: true,
        barbershopId: shop.id,
      }))

      const insertedServices = await db
        .insert(barbershopService)
        .values(services)
        .returning()

      for (let j = 0; j < 3; j++) {
        await db.insert(booking).values({
          userId: faker.helpers.arrayElement(insertedUsers.slice(51)).id,
          serviceId: faker.helpers.arrayElement(insertedServices).id,
          scheduledAt: faker.date.soon({ days: 20 }),
          status: "confirmed",
        })
      }
    }

    console.log("✅ Seed finalizado com sucesso e sem erros de imagem!")
  } catch (error) {
    console.error("❌ Erro no seed:", error)
  }
}

seed()
