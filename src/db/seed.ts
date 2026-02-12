import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { fakerPT_BR as faker } from "@faker-js/faker"
import { sql } from "drizzle-orm"
import { bcryptUtil } from "@/app/_utils/bcrypt.util"
import { env } from "../config/env"

import {
  user,
  barbershop,
  barbershopService,
  booking,
  barbershopHour,
  barbershopStatus,
  availableTimeSlot,
  category,
} from "./schemas"

const client = neon(env.DATABASE_URL)
const db = drizzle(client)

const BARBERSHOP_IMAGES = [
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1632106061261-8d8b6c7f1f5c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=800&h=600&fit=crop",
]

const SERVICE_IMAGES = {
  corte: [
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&h=400&fit=crop",
  ],
  barba: [
    "https://images.unsplash.com/photo-1621604048884-c818a0e57e59?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=600&h=400&fit=crop",
  ],
  degrade: [
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop",
  ],
  sobrancelha: [
    "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&h=600&fit=crop",
  ],
  combo: [
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop",
  ],
  massagem: [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400&fit=crop",
  ],
  hidratacao: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=400&fit=crop",
  ],
}

const BARBERSHOP_NAMES = [
  "Barbearia Corleone",
  "Gentleman's Barber Shop",
  "Barbearia do Zé",
  "The Barbers",
  "Navalha de Ouro",
  "Dom Barbeiro",
  "Barbearia Tradicional",
  "Seu Elias Barbearia",
  "Corte & Estilo",
  "Cavalheiros Barbearia",
  "Barba & Navalha",
  "Old School Barber",
  "Barbearia Premium",
  "Classic Barber Shop",
  "Barbearia do Centro",
  "Estilo Masculino",
  "Barbeiros Unidos",
  "Cabelo & Cia",
  "Lounge do Barbeiro",
  "Barbearia VIP",
  "Brothers Barber Shop",
  "Rei da Barba",
  "Barberia Moderna",
  "Studio do Corte",
  "Barbearia Elegance",
]

const BRAZILIAN_CITIES = [
  { city: "São Paulo", state: "SP" },
  { city: "Rio de Janeiro", state: "RJ" },
  { city: "Belo Horizonte", state: "MG" },
  { city: "Curitiba", state: "PR" },
  { city: "Porto Alegre", state: "RS" },
  { city: "Brasília", state: "DF" },
  { city: "Salvador", state: "BA" },
  { city: "Fortaleza", state: "CE" },
  { city: "Recife", state: "PE" },
  { city: "Florianópolis", state: "SC" },
  { city: "Campinas", state: "SP" },
  { city: "Vitória", state: "ES" },
]

async function seed() {
  try {
    console.log("🧹 Limpando banco de dados...")
    await db.execute(
      sql`TRUNCATE TABLE ${availableTimeSlot}, ${booking}, ${barbershopHour}, ${barbershopStatus}, ${barbershopService}, ${barbershop}, ${category}, ${user} CASCADE`,
    )

    console.log("📁 Criando categorias de serviços...")
    const categoriesToInsert = [
      {
        name: "Cabelo",
        slug: "cabelo",
        description:
          "Serviços de corte masculino com máquina, tesoura e acabamento profissional.",
        icon: "/icons/hair.svg",
        image:
          "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop",
      },
      {
        name: "Barba",
        slug: "barba",
        description:
          "Aparar, desenhar e cuidados especiais para barba com navalha e produtos premium.",
        icon: "/icons/beard.svg",
        image:
          "https://images.unsplash.com/photo-1621604048884-c818a0e57e59?w=400&h=300&fit=crop",
      },
      {
        name: "Acabamento",
        slug: "acabamento",
        description:
          "Ajustes precisos no contorno do cabelo e barba (pezinho) para um visual limpo e renovado.",
        icon: "/icons/razor.svg",
        image:
          "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop",
      },
      {
        name: "Sobrancelha",
        slug: "sobrancelha",
        description:
          "Design e modelagem de sobrancelhas masculinas para um olhar marcante.",
        icon: "/icons/eyebrow.svg",
        image:
          "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400&h=300&fit=crop",
      },
      {
        name: "Massagem",
        slug: "massagem",
        description:
          "Momento de relaxamento focado no alívio de tensões musculares e bem-estar físico e mental.",
        icon: "/icons/towel.svg",
        image:
          "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      },
      {
        name: "Hidratação",
        slug: "hidratacao",
        description:
          "Tratamentos capilares, hidratação e cuidados especiais para cabelo e couro cabeludo.",
        icon: "/icons/huge.svg",
        image:
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
      },
    ]

    const insertedCategories = await db
      .insert(category)
      .values(categoriesToInsert)
      .returning()

    console.log("👥 Criando 120 usuários reais...")
    const usersToInsert = Array.from({ length: 120 }).map((_, index) => {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()

      return {
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: bcryptUtil.hashSync("@Password123"),
        phone: faker.phone.number({ style: "international" }),
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + " " + lastName)}&size=150&background=random`,
        isActive: true,
        emailVerified: faker.date.past(),
      }
    })

    const insertedUsers = await db
      .insert(user)
      .values(usersToInsert)
      .returning()

    console.log("💈 Criando 50 barbearias reais pelo Brasil...")

    const barbershopsToInsert = Array.from({ length: 50 }).map((_, i) => {
      const location = faker.helpers.arrayElement(BRAZILIAN_CITIES)
      const baseName = BARBERSHOP_NAMES[i % BARBERSHOP_NAMES.length]
      const suffix = i >= BARBERSHOP_NAMES.length ? ` ${location.city}` : ""
      const fullName = `${baseName}${suffix}`
      const slug = `${faker.helpers.slugify(fullName).toLowerCase()}-${faker.string.nanoid(4)}`

      return {
        name: fullName,
        slug,
        description: `Localizada em ${location.city}, a ${baseName} é referência em cortes masculinos modernos e tradicionais. Ambiente acolhedor com profissionais experientes e atendimento premium.`,
        image: BARBERSHOP_IMAGES[i % BARBERSHOP_IMAGES.length],
        ownerId: insertedUsers[i % insertedUsers.length].id,
        address: faker.location.streetAddress(),
        city: location.city,
        state: location.state,
        zipCode: faker.location.zipCode("#####-###"),
        phone: faker.phone.number(),
        email: `contato@${faker.helpers.slugify(baseName).toLowerCase()}.com.br`,
        isActive: true,
      }
    })

    const insertedBarbershops = await db
      .insert(barbershop)
      .values(barbershopsToInsert)
      .returning()

    console.log("🕐 Criando horários de funcionamento para cada barbearia...")
    const daysOfWeek = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ]

    for (const shop of insertedBarbershops) {
      const hoursToInsert = daysOfWeek.map((day) => {
        const isSunday = day === "sunday"
        const isSaturday = day === "saturday"

        return {
          barbershopId: shop.id,
          dayOfWeek: day as
            | "monday"
            | "tuesday"
            | "wednesday"
            | "thursday"
            | "friday"
            | "saturday"
            | "sunday",
          openingTime: isSunday ? "00:00" : "08:00",
          closingTime: isSunday ? "00:00" : isSaturday ? "18:00" : "20:00",
          isOpen: !isSunday,
        }
      })

      await db.insert(barbershopHour).values(hoursToInsert)
    }

    console.log("📊 Criando status inicial para cada barbearia...")
    const statusToInsert = insertedBarbershops.map((shop) => ({
      barbershopId: shop.id,
      isOpen: true,
      reason: null,
      closedUntil: null,
    }))

    await db.insert(barbershopStatus).values(statusToInsert)

    console.log("✂️ Gerando serviços com descrições e preços reais...")

    const serviceTemplates = [
      {
        name: "Corte de Cabelo",
        description:
          "Corte profissional com máquina e tesoura, incluindo lavagem e finalização com produtos premium.",
        priceInCents: 5000,
        durationMinutes: 45,
        images: SERVICE_IMAGES.corte,
        categoryId: insertedCategories.find((c) => c.slug === "cabelo")!.id,
      },
      {
        name: "Barba Completa",
        description:
          "Aparar, desenhar e hidratar a barba com navalha e toalha quente. Inclui massagem facial.",
        priceInCents: 4000,
        durationMinutes: 40,
        images: SERVICE_IMAGES.barba,
        categoryId: insertedCategories.find((c) => c.slug === "barba")!.id,
      },
      {
        name: "Corte + Barba",
        description:
          "Combo completo: corte de cabelo + barba profissional. O melhor custo-benefício!",
        priceInCents: 8000,
        durationMinutes: 75,
        images: SERVICE_IMAGES.combo,
        categoryId: insertedCategories.find((c) => c.slug === "acabamento")!.id,
      },
      {
        name: "Degradê",
        description:
          "Corte degradê moderno com máquina profissional e finalização impecável.",
        priceInCents: 5500,
        durationMinutes: 50,
        images: SERVICE_IMAGES.degrade,
        categoryId: insertedCategories.find((c) => c.slug === "cabelo")!.id,
      },
      {
        name: "Design de Sobrancelha",
        description:
          "Modelagem e design de sobrancelhas masculinas com pinça e navalha.",
        priceInCents: 2500,
        durationMinutes: 20,
        images: SERVICE_IMAGES.sobrancelha,
        categoryId: insertedCategories.find((c) => c.slug === "sobrancelha")!
          .id,
      },
      {
        name: "Pezinho",
        description:
          "Acabamento profissional na nuca e contornos, garantindo um visual limpo e renovado.",
        priceInCents: 1500,
        durationMinutes: 15,
        images: SERVICE_IMAGES.combo,
        categoryId: insertedCategories.find((c) => c.slug === "acabamento")!.id,
      },
      {
        name: "Massagem Relaxante",
        description:
          "Massagem terapêutica para alívio de tensões musculares e bem-estar completo.",
        priceInCents: 3500,
        durationMinutes: 30,
        images: SERVICE_IMAGES.massagem,
        categoryId: insertedCategories.find((c) => c.slug === "massagem")!.id,
      },
      {
        name: "Hidratação Capilar",
        description:
          "Tratamento de hidratação profunda com produtos de alta qualidade para revitalizar os fios.",
        priceInCents: 4500,
        durationMinutes: 50,
        images: SERVICE_IMAGES.hidratacao,
        categoryId: insertedCategories.find((c) => c.slug === "hidratacao")!.id,
      },
    ]

    let totalBookings = 0

    for (const shop of insertedBarbershops) {
      const numServices = faker.number.int({ min: 4, max: 7 })
      const selectedTemplates = faker.helpers.arrayElements(
        serviceTemplates,
        numServices,
      )

      const services = selectedTemplates.map((template) => {
        const imageIndex = faker.number.int({
          min: 0,
          max: template.images.length - 1,
        })

        return {
          name: template.name,
          slug: `${faker.helpers.slugify(template.name).toLowerCase()}-${faker.string.nanoid(4)}`,
          description: template.description,
          image: template.images[imageIndex],
          durationMinutes: template.durationMinutes,
          priceInCents:
            template.priceInCents + faker.number.int({ min: -500, max: 1500 }),
          categoryId: template.categoryId,
          isActive: true,
          barbershopId: shop.id,
        }
      })

      const insertedServices = await db
        .insert(barbershopService)
        .values(services)
        .returning()

      console.log(`   Gerando time slots para ${shop.name}...`)
      const timeSlotsToInsert = []

      for (let day = 0; day < 30; day++) {
        const date = new Date()
        date.setDate(date.getDate() + day)

        if (date.getDay() === 0) continue

        const endHour = date.getDay() === 6 ? 18 : 20

        for (let hour = 8; hour < endHour; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const startTime = new Date(date)
            startTime.setHours(hour, minute, 0, 0)

            const endTime = new Date(startTime)
            endTime.setMinutes(endTime.getMinutes() + 30)

            timeSlotsToInsert.push({
              barbershopId: shop.id,
              startTime,
              endTime,
              isAvailable: faker.datatype.boolean({ probability: 0.8 }),
            })
          }
        }
      }

      await db.insert(availableTimeSlot).values(timeSlotsToInsert)

      const numBookings = faker.number.int({ min: 2, max: 5 })

      for (let j = 0; j < numBookings; j++) {
        const service = faker.helpers.arrayElement(insertedServices)
        const bookingDate = faker.date.soon({ days: 30 })
        const endTime = new Date(bookingDate)
        endTime.setMinutes(endTime.getMinutes() + service.durationMinutes)

        await db.insert(booking).values({
          userId: faker.helpers.arrayElement(insertedUsers).id,
          serviceId: service.id,
          barbershopId: shop.id,
          scheduledAt: bookingDate,
          endTime: endTime,
          status: faker.helpers.arrayElement(["confirmed", "completed"]),
        })

        totalBookings++
      }
    }

    console.log("✅ Seed finalizado com sucesso!")
    console.log(`📊 Resumo:`)
    console.log(`   • ${insertedCategories.length} categorias criadas`)
    console.log(`   • ${insertedUsers.length} usuários criados`)
    console.log(`   • ${insertedBarbershops.length} barbearias criadas`)
    console.log(`   • ${totalBookings} agendamentos criados`)
    console.log(`   • Todas as imagens são reais do Unsplash`)
  } catch (error) {
    console.error("❌ Erro no seed:", error)
    throw error
  }
}

seed()
