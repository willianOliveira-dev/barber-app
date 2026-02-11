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
    console.log("🧹 Limpando banco...")
    await db.execute(
      sql`
        TRUNCATE TABLE
          ${booking},
          ${barbershopService},
          ${barbershop},
          ${user}
        CASCADE
      `,
    )

    console.log("👤 Criando usuários...")
    const usersToInsert = Array.from({ length: 20 }).map(() => {
      const name = faker.person.firstName()

      return {
        name,
        email: faker.internet.email({ firstName: name }).toLowerCase(),
        password: bcryptUtil.hashSync("@Password_segura_123"),
        phone: faker.phone.number(),
        image: `https://i.pravatar.cc/150?u=${name}`,
        isActive: true,
        emailVerified: faker.date.recent(),
      }
    })

    const insertedUsers = await db
      .insert(user)
      .values(usersToInsert)
      .returning()

    console.log("💈 Criando barbearias...")
    const barbershopNames = [
      "Navalha Afiada",
      "Dom Barbeiro",
      "Viking Barber",
      "Corte & Estilo",
      "Retro Barber Club",
      "Barba & Cia",
      "Elite da Tesoura",
      "Cavalheiros",
      "Seu Elias Barber",
      "Fade Masters",
    ]

    const barbershopsToInsert = insertedUsers.slice(0, 10).map((owner, i) => {
      const name = barbershopNames[i]
      const slug = faker.helpers.slugify(name).toLowerCase()

      return {
        name,
        slug,
        description: `A ${name} oferece cortes modernos e clássicos.`,
        image: `https://loremflickr.com/800/600/barbershop?lock=${i}`,
        ownerId: owner.id,
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode("#####-###"),
        phone: faker.phone.number(),
        email: `contato@${slug}.com.br`,
        openingTime: "09:00",
        closingTime: "20:00",
        isActive: true,
      }
    })

    const insertedBarbershops = await db
      .insert(barbershop)
      .values(barbershopsToInsert)
      .returning()

    console.log("✂️ Criando serviços...")
    const servicesTemplate = [
      { name: "Corte Social", price: 4500, duration: 30 },
      { name: "Barba Completa", price: 3500, duration: 40 },
      { name: "Corte Degradê", price: 5500, duration: 45 },
      { name: "Sobrancelha", price: 1500, duration: 15 },
      { name: "Combo Completo", price: 8000, duration: 80 },
    ]

    for (const shop of insertedBarbershops) {
      const services = servicesTemplate.map((service) => ({
        name: service.name,
        slug: faker.helpers.slugify(service.name).toLowerCase(),
        description: faker.lorem.paragraph(),
        image: `https://loremflickr.com/800/600/barber,service?lock=${faker.number.int(
          { min: 1, max: 99999 },
        )}`,
        durationMinutes: service.duration,
        priceInCents: service.price,
        isActive: true,
        barbershopId: shop.id,
      }))

      const insertedServices = await db
        .insert(barbershopService)
        .values(services)
        .returning()

      const randomUser = faker.helpers.arrayElement(insertedUsers)
      const randomService = faker.helpers.arrayElement(insertedServices)

      await db.insert(booking).values({
        userId: randomUser.id,
        serviceId: randomService.id,
        scheduledAt: faker.date.soon({ days: 7 }),
        status: "scheduled",
      })
    }

    console.log("✅ Seed executado com sucesso!")
  } catch (error) {
    console.error("❌ Erro no seed:", error)
  }
}

seed()
