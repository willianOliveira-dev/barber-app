import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { fakerPT_BR as faker } from "@faker-js/faker"
import { sql, eq } from "drizzle-orm"
import { bcryptUtil } from "@/src/app/_utils/bcrypt.util"
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
  review,
  reviewLike,
} from "./schemas"

const client = neon(env.DATABASE_URL)
const db = drizzle(client)

const BARBERSHOP_IMAGES = [
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=800&auto=format&fit=crop",
]

const SERVICE_IMAGES = {
  corte: [
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format&fit=crop",
  ],
  barba: [
    "https://images.unsplash.com/photo-1621604048884-c818a0e57e59?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=600&auto=format&fit=crop",
  ],
  degrade: [
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop",
  ],
  sobrancelha: [
    "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&auto=format&fit=crop",
  ],
  combo: [
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop",
  ],
  massagem: [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&auto=format&fit=crop",
  ],
  hidratacao: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&auto=format&fit=crop",
  ],
}

const BRAZILIAN_CITIES = [
  // Rio de Janeiro
  { city: "São João de Meriti", state: "RJ", lat: -22.804, lng: -43.372 },
  { city: "Duque de Caxias", state: "RJ", lat: -22.785, lng: -43.311 },
  { city: "Maricá", state: "RJ", lat: -22.919, lng: -42.818 },
  { city: "Rio de Janeiro", state: "RJ", lat: -22.906, lng: -43.172 },
  { city: "Belford Roxo", state: "RJ", lat: -22.764, lng: -43.399 },
  { city: "Niterói", state: "RJ", lat: -22.883, lng: -43.103 },
  { city: "Mesquita", state: "RJ", lat: -22.794, lng: -43.432 },
  // Outros estados
  { city: "São Paulo", state: "SP", lat: -23.55, lng: -46.633 },
  { city: "Belo Horizonte", state: "MG", lat: -19.917, lng: -43.939 },
  { city: "Curitiba", state: "PR", lat: -25.429, lng: -49.271 },
  { city: "Porto Alegre", state: "RS", lat: -30.033, lng: -51.23 },
  { city: "Salvador", state: "BA", lat: -12.971, lng: -38.511 },
  { city: "Fortaleza", state: "CE", lat: -3.731, lng: -38.527 },
  { city: "Recife", state: "PE", lat: -8.053, lng: -34.881 },
  { city: "Brasília", state: "DF", lat: -15.794, lng: -47.882 },
]

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
  "Lounge do Barbeiro",
  "Barbearia VIP",
  "Brothers Barber Shop",
]

async function seed() {
  try {
    console.log("🧹 Limpando banco de dados...")
    await db.execute(
      sql`TRUNCATE TABLE ${reviewLike}, ${review}, ${availableTimeSlot}, ${booking}, ${barbershopHour}, ${barbershopStatus}, ${barbershopService}, ${barbershop}, ${category}, ${user} CASCADE`,
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
          "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&auto=format&fit=crop",
      },
      {
        name: "Barba",
        slug: "barba",
        description:
          "Aparar, desenhar e cuidados especiais para barba com navalha e produtos premium.",
        icon: "/icons/beard.svg",
        image:
          "https://images.unsplash.com/photo-1621604048884-c818a0e57e59?w=400&auto=format&fit=crop",
      },
      {
        name: "Acabamento",
        slug: "acabamento",
        description:
          "Ajustes precisos no contorno do cabelo e barba (pezinho) para um visual limpo e renovado.",
        icon: "/icons/razor.svg",
        image:
          "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&auto=format&fit=crop",
      },
      {
        name: "Sobrancelha",
        slug: "sobrancelha",
        description:
          "Design e modelagem de sobrancelhas masculinas para um olhar marcante.",
        icon: "/icons/eyebrow.svg",
        image:
          "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400&auto=format&fit=crop",
      },
      {
        name: "Massagem",
        slug: "massagem",
        description:
          "Momento de relaxamento focado no alívio de tensões musculares e bem-estar físico e mental.",
        icon: "/icons/towel.svg",
        image:
          "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&auto=format&fit=crop",
      },
      {
        name: "Hidratação",
        slug: "hidratacao",
        description:
          "Tratamentos capilares, hidratação e cuidados especiais para cabelo e couro cabeludo.",
        icon: "/icons/huge.svg",
        image:
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&auto=format&fit=crop",
      },
    ]

    const insertedCategories = await db
      .insert(category)
      .values(categoriesToInsert)
      .returning()

    console.log("👥 Criando 25 usuários...")
    const usersToInsert = Array.from({ length: 25 }).map(() => {
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

    console.log("💈 Criando 18 barbearias nas regiões solicitadas...")

    const barbershopsToInsert = Array.from({ length: 18 }).map((_, i) => {
      const location = BRAZILIAN_CITIES[i % BRAZILIAN_CITIES.length]
      const baseName = BARBERSHOP_NAMES[i % BARBERSHOP_NAMES.length]
      const slug = `${faker.helpers.slugify(baseName).toLowerCase()}-${faker.string.nanoid(4)}`
      const streetNumber = faker.number.int({ min: 1, max: 9999 }).toString()

      return {
        name: `${baseName} - ${location.city}`,
        slug,
        description: `Localizada em ${location.city}, a ${baseName} é referência em cortes masculinos modernos e tradicionais. Ambiente acolhedor com profissionais experientes.`,
        image: BARBERSHOP_IMAGES[i % BARBERSHOP_IMAGES.length],
        ownerId: insertedUsers[i % insertedUsers.length].id,
        address: faker.location.streetAddress(),
        city: location.city,
        state: location.state,
        zipCode: faker.location.zipCode("#####-###"),
        streetNumber,
        complement: faker.datatype.boolean()
          ? faker.helpers.arrayElement(["Sala 101", "Loja 5", "2º andar", null])
          : null,
        phone: faker.phone.number(),
        email: `contato@${faker.helpers.slugify(baseName).toLowerCase()}.com.br`,
        website: faker.datatype.boolean()
          ? `https://www.${faker.helpers.slugify(baseName).toLowerCase()}.com.br`
          : null,
        latitude: (
          location.lat + faker.number.float({ min: -0.02, max: 0.02 })
        ).toFixed(6),
        longitude: (
          location.lng + faker.number.float({ min: -0.02, max: 0.02 })
        ).toFixed(6),
        isActive: true,
      }
    })

    const insertedBarbershops = await db
      .insert(barbershop)
      .values(barbershopsToInsert)
      .returning()

    console.log("🕐 Criando horários de funcionamento...")
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

    console.log("📊 Criando status inicial...")
    const statusToInsert = insertedBarbershops.map((shop) => ({
      barbershopId: shop.id,
      isOpen: true,
      reason: null,
      closedUntil: null,
    }))

    await db.insert(barbershopStatus).values(statusToInsert)

    console.log("✂️ Gerando serviços...")

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
    ]

    let totalBookings = 0
    let totalTimeSlots = 0
    const allBookings: any[] = []

    for (const shop of insertedBarbershops) {
      console.log(`💈 ${shop.name}...`)

      const numServices = faker.number.int({ min: 3, max: 5 })
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

      for (let day = 0; day < 7; day++) {
        const date = new Date()
        date.setDate(date.getDate() + day)

        if (date.getDay() === 0) continue

        const endHour = date.getDay() === 6 ? 18 : 20

        for (const service of insertedServices) {
          const timeSlotsForService = []
          let currentTime = new Date(date)
          currentTime.setHours(8, 0, 0, 0)

          const closingTime = new Date(date)
          closingTime.setHours(endHour, 0, 0, 0)

          const serviceDurationMs = service.durationMinutes * 60 * 1000

          while (
            currentTime.getTime() + serviceDurationMs <=
            closingTime.getTime()
          ) {
            const now = new Date()
            const isPast = currentTime < now
            const isToday = currentTime.toDateString() === now.toDateString()

            let availabilityProbability = 0.95

            if (isPast) {
              availabilityProbability = 0.1
            } else if (isToday) {
              availabilityProbability = 0.7
            }

            timeSlotsForService.push({
              barbershopId: shop.id,
              serviceId: service.id,
              startTime: new Date(currentTime),
              isAvailable: faker.datatype.boolean({
                probability: availabilityProbability,
              }),
              bookingId: null,
            })

            currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000)
          }

          if (timeSlotsForService.length > 0) {
            const insertedSlots = await db
              .insert(availableTimeSlot)
              .values(timeSlotsForService)
              .returning()

            totalTimeSlots += insertedSlots.length

            for (const slot of insertedSlots) {
              if (!slot.isAvailable) {
                const endTime = new Date(slot.startTime)
                endTime.setMinutes(
                  endTime.getMinutes() + service.durationMinutes,
                )

                const now = new Date()
                let status: "confirmed" | "completed" | "cancelled"

                if (slot.startTime < now) {
                  status = faker.helpers.arrayElement([
                    "completed",
                    "completed",
                    "cancelled",
                  ])
                } else {
                  status = "confirmed"
                }

                const randomUser =
                  insertedUsers[
                    Math.floor(Math.random() * insertedUsers.length)
                  ]

                const insertedBooking = await db
                  .insert(booking)
                  .values({
                    userId: randomUser.id,
                    serviceId: service.id,
                    barbershopId: shop.id,
                    scheduledAt: slot.startTime,
                    endTime: endTime,
                    status: status,
                  })
                  .returning()

                await db
                  .update(availableTimeSlot)
                  .set({
                    bookingId: insertedBooking[0].id,
                  })
                  .where(eq(availableTimeSlot.id, slot.id))

                allBookings.push({
                  ...insertedBooking[0],
                  userId: randomUser.id,
                })

                totalBookings++
              }
            }
          }
        }
      }
    }

    console.log("⭐ Criando Avaliações...")
    const reviewsToInsert: any[] = []
    const completedBookings = allBookings.filter(
      (b) => b.status === "completed",
    )

    const bookingsWithReview = completedBookings.slice(
      0,
      Math.floor(completedBookings.length * 0.3),
    )

    for (const bookingItem of bookingsWithReview) {
      const hasComment = faker.datatype.boolean({ probability: 0.7 })
      const rating = faker.number.int({ min: 3, max: 5 })

      reviewsToInsert.push({
        userId: bookingItem.userId,
        barbershopId: bookingItem.barbershopId,
        bookingId: bookingItem.id,
        rating: rating,
        comment: hasComment ? faker.lorem.paragraph({ min: 1, max: 3 }) : null,
        response: null,
        respondedAt: null,
        createdAt: faker.date.between({
          from: bookingItem.scheduledAt,
          to: new Date(),
        }),
        updatedAt: new Date(),
      })
    }

    const insertedReviews = await db
      .insert(review)
      .values(reviewsToInsert)
      .returning()

    console.log("👍 Criando likes nas reviews...")
    const reviewLikesToInsert: any[] = []
    const usedUserReviewPairs = new Set<string>()

    for (const reviewItem of insertedReviews) {
      const numLikes = faker.number.int({ min: 0, max: 5 })

      for (let i = 0; i < numLikes; i++) {
        const randomUser = faker.helpers.arrayElement(insertedUsers)
        const key = `${reviewItem.id}-${randomUser.id}`

        if (
          !usedUserReviewPairs.has(key) &&
          randomUser.id !== reviewItem.userId
        ) {
          usedUserReviewPairs.add(key)
          reviewLikesToInsert.push({
            reviewId: reviewItem.id,
            userId: randomUser.id,
            createdAt: faker.date.recent(),
          })
        }
      }
    }

    if (reviewLikesToInsert.length > 0) {
      await db.insert(reviewLike).values(reviewLikesToInsert)
    }

    console.log("\n✅ Seed finalizado!")
    console.log(`📊 Resumo:`)
    console.log(`   • ${insertedCategories.length} categorias`)
    console.log(`   • ${insertedUsers.length} usuários`)
    console.log(`   • ${insertedBarbershops.length} barbearias`)
    console.log(`   • ${insertedReviews.length} reviews`)
    console.log(`   • ${reviewLikesToInsert.length} likes`)
    console.log(`   • ${totalTimeSlots} time slots`)
    console.log(`   • ${totalBookings} agendamentos`)
    console.log(`\n📍 Cidades atendidas:`)
    const cities = [
      ...new Set(insertedBarbershops.map((b) => `${b.city}-${b.state}`)),
    ]
    cities.forEach((city) => console.log(`   • ${city}`))
  } catch (error) {
    console.error("❌ Erro:", error)
    throw error
  }
}

seed()
