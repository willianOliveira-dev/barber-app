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
  category,
  review,
  reviewLike,
} from "./schemas"

// =====================================================
// ⚠️ CONSTANTES MANTIDAS (conforme solicitado)
// =====================================================

export const categoriesToInsert = [
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

export const serviceTemplate = [
  {
    name: "Corte de Cabelo",
    description:
      "Corte profissional com máquina e tesoura, incluindo lavagem e finalização com produtos premium.",
    priceInCents: 5000,
    durationMinutes: 45,
    images: [
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format&fit=crop&q=80",
    ],
    categoryId: "cabelo",
  },
  {
    name: "Barba Completa",
    description:
      "Aparar, desenhar e hidratar a barba com navalha e toalha quente. Inclui massagem facial.",
    priceInCents: 4000,
    durationMinutes: 40,
    images: [
      "https://images.unsplash.com/photo-1621604048884-c818a0e57e59?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=600&auto=format&fit=crop&q=80",
    ],
    categoryId: "barba",
  },
  {
    name: "Corte + Barba",
    description:
      "Combo completo: corte de cabelo + barba profissional. O melhor custo-benefício!",
    priceInCents: 8000,
    durationMinutes: 75,
    images: [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80",
    ],
    categoryId: "acabamento",
  },
  {
    name: "Degradê",
    description:
      "Corte degradê moderno com máquina profissional e finalização impecável.",
    priceInCents: 5500,
    durationMinutes: 50,
    images: [
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80",
    ],
    categoryId: "cabelo",
  },
  {
    name: "Design de Sobrancelha",
    description:
      "Modelagem e design de sobrancelhas masculinas com pinça e navalha.",
    priceInCents: 2500,
    durationMinutes: 20,
    images: [
      "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&auto=format&fit=crop&q=80",
    ],
    categoryId: "sobrancelha",
  },
  {
    name: "Pezinho",
    description:
      "Acabamento profissional na nuca e contornos, garantindo um visual limpo e renovado.",
    priceInCents: 1500,
    durationMinutes: 15,
    images: [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80",
    ],
    categoryId: "acabamento",
  },
]

export const BRAZILIAN_CITIES = [
  { city: "São João de Meriti", state: "RJ", lat: -22.804, lng: -43.372 },
  { city: "Duque de Caxias", state: "RJ", lat: -22.785, lng: -43.311 },
  { city: "Maricá", state: "RJ", lat: -22.919, lng: -42.818 },
  { city: "Rio de Janeiro", state: "RJ", lat: -22.906, lng: -43.172 },
  { city: "Belford Roxo", state: "RJ", lat: -22.764, lng: -43.399 },
  { city: "Niterói", state: "RJ", lat: -22.883, lng: -43.103 },
  { city: "Mesquita", state: "RJ", lat: -22.794, lng: -43.432 },
  { city: "São Paulo", state: "SP", lat: -23.55, lng: -46.633 },
  { city: "Belo Horizonte", state: "MG", lat: -19.917, lng: -43.939 },
  { city: "Curitiba", state: "PR", lat: -25.429, lng: -49.271 },
  { city: "Porto Alegre", state: "RS", lat: -30.033, lng: -51.23 },
  { city: "Salvador", state: "BA", lat: -12.971, lng: -38.511 },
  { city: "Fortaleza", state: "CE", lat: -3.731, lng: -38.527 },
  { city: "Recife", state: "PE", lat: -8.053, lng: -34.881 },
  { city: "Brasília", state: "DF", lat: -15.794, lng: -47.882 },
]

// =====================================================
// CONFIGURAÇÃO
// =====================================================

const client = neon(env.DATABASE_URL)
const db = drizzle(client)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  baseDelay = 500,
): Promise<T> => {
  let lastError: Error | undefined
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      const isTransient =
        error?.message?.includes("fetch failed") ||
        error?.cause?.code === "ECONNRESET" ||
        error?.cause?.code === "ETIMEDOUT"
      if (!isTransient || attempt === maxRetries - 1) break
      const delay = baseDelay * Math.pow(2, attempt)
      await sleep(delay)
    }
  }
  throw lastError
}

const BARBERSHOP_IMAGES = [
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=800&auto=format&fit=crop&q=80",
]

const generateBarbershopName = () => {
  const prefixes = [
    "Barbearia",
    "Barbershop",
    "Estúdio",
    "Espaço",
    "Clube",
    "Lounge",
    "Ateliê",
  ]
  const names = [
    "Navalha de Ouro",
    "Cavalheiro",
    "Tradição",
    "Vintage",
    "Premium",
    "Clássica",
    "Moderna",
    "Urbana",
    "Royal",
    "Imperial",
    "Do Bairro",
    "Do Centro",
    "1920",
    "Old School",
    "Gentleman",
    "Mestre",
    "Nobre",
    "Elegance",
  ]
  const suffixes = ["", "Barbearia", "Barbershop", "Estilo", "Club", "House"]

  const prefix = faker.helpers.arrayElement(prefixes)
  const name = faker.helpers.arrayElement(names)
  const suffix = faker.helpers.arrayElement(suffixes)

  return suffix ? `${prefix} ${name} ${suffix}`.trim() : `${prefix} ${name}`
}

const generateBarbershopDescription = () => {
  const descriptions = [
    "Tradição e respeito. Cortes clássicos na tesoura e navalha, com atendimento personalizado e aquele cafézinho que não falta. Ambiente acolhedor para quem valoriza a verdadeira arte da barbearia.",
    "Espaço moderno e descolado. Especialistas em fades, degradês e visagismo. Equipamentos de ponta e produtos premium para a experiência completa do homem contemporâneo.",
    "O point do bairro há mais de 15 anos. Atendimento rápido, preço justo e aquela conversa boa de quem se conhece há anos. Cerveja gelada e futebol na TV nos dias de jogo.",
    "Barbearia boutique com foco em detalhes. Poltronas de couro legítimo, ambiente climatizado e silêncio para você relaxar enquanto cuida do visual com profissionais especializados.",
    "Estilo old school autêntico. Decoração vintage, máquinas antigas restauradas e mestres barbeiros com décadas de experiência. Aqui o tempo passa mais devagar.",
    "Espaço completo de autocuidado masculino. Além do corte e barba, oferecemos massagem capilar, limpeza de pele e tratamentos especializados. Seu momento de renovação.",
    "Atendimento familiar em ambiente descontraído. Especialistas em cortes infantis e masculinos, com paciência e técnica para todos os estilos e idades.",
    "Barbearia urbana com vibe jovem. Cortes modernos, atendimento ágil e preços acessíveis. Ideal para quem busca estilo sem complicação.",
  ]
  return faker.helpers.arrayElement(descriptions)
}

const generateServiceVariations = () => ({
  cabelo: [
    {
      name: "Corte Social",
      description:
        "Corte tradicional com tesoura, ideal para ambiente corporativo.",
      priceOffset: 0,
      durationOffset: 0,
    },
    {
      name: "Corte Degradê",
      description: "Degradê preciso com máquina, do clássico ao moderno.",
      priceOffset: 500,
      durationOffset: 5,
    },
    {
      name: "Corte Infantil",
      description:
        "Atendimento especial para crianças, com paciência e diversão.",
      priceOffset: -1000,
      durationOffset: -10,
    },
    {
      name: "Corte + Lavagem",
      description: "Corte profissional com lavagem relaxante e finalização.",
      priceOffset: 1000,
      durationOffset: 10,
    },
    {
      name: "Visagismo",
      description:
        "Análise facial personalizada para o corte que mais valoriza seus traços.",
      priceOffset: 2000,
      durationOffset: 15,
    },
  ],
  barba: [
    {
      name: "Barba Tradicional",
      description: "Aparar e desenhar com navalha e toalha quente.",
      priceOffset: 0,
      durationOffset: 0,
    },
    {
      name: "Barba com Toalha Quente",
      description:
        "Experiência completa com toalha quente, óleos essenciais e massagem.",
      priceOffset: 1500,
      durationOffset: 10,
    },
    {
      name: "Modelagem de Barba",
      description:
        "Desenho preciso e alinhamento dos contornos para um visual definido.",
      priceOffset: -500,
      durationOffset: -5,
    },
    {
      name: "Barba + Hidratação",
      description:
        "Cuidados completos com hidratação profunda para barbas longas.",
      priceOffset: 2000,
      durationOffset: 15,
    },
  ],
  acabamento: [
    {
      name: "Pezinho",
      description: "Acabamento profissional na nuca e laterais.",
      priceOffset: 0,
      durationOffset: 0,
    },
    {
      name: "Sobrancelha + Pezinho",
      description: "Combo de acabamento para um visual impecável.",
      priceOffset: 1000,
      durationOffset: 5,
    },
    {
      name: "Acabamento Premium",
      description: "Detalhes finais com navalha e produtos especiais.",
      priceOffset: 800,
      durationOffset: 5,
    },
  ],
  sobrancelha: [
    {
      name: "Design de Sobrancelha",
      description: "Modelagem com pinça e navalha para formato ideal.",
      priceOffset: 0,
      durationOffset: 0,
    },
    {
      name: "Sobrancelha + Barba",
      description: "Combo para harmonizar rosto e barba.",
      priceOffset: 1500,
      durationOffset: 10,
    },
  ],
  massagem: [
    {
      name: "Massagem Capilar",
      description: "Relaxamento do couro cabeludo com óleos essenciais.",
      priceOffset: 0,
      durationOffset: 0,
    },
    {
      name: "Massagem Facial",
      description: "Alívio de tensões e renovação para o rosto.",
      priceOffset: 500,
      durationOffset: 5,
    },
    {
      name: "Pacote Relax",
      description: "Massagem capilar + facial + toalha quente.",
      priceOffset: 2000,
      durationOffset: 15,
    },
  ],
  hidratacao: [
    {
      name: "Hidratação Simples",
      description: "Tratamento básico para cabelos ressecados.",
      priceOffset: 0,
      durationOffset: 0,
    },
    {
      name: "Hidratação Premium",
      description: "Tratamento profundo com produtos importados.",
      priceOffset: 2500,
      durationOffset: 15,
    },
    {
      name: "Reconstrução Capilar",
      description: "Recuperação intensiva para cabelos danificados.",
      priceOffset: 4000,
      durationOffset: 30,
    },
  ],
  combo: [
    {
      name: "Corte + Barba",
      description: "Combo clássico com desconto especial.",
      priceOffset: 0,
      durationOffset: 0,
    },
    {
      name: "Corte + Barba + Sobrancelha",
      description: "Pacote completo para renovação total do visual.",
      priceOffset: 2000,
      durationOffset: 15,
    },
    {
      name: "Experiência Premium",
      description: "Corte, barba com toalha quente, sobrancelha e massagem.",
      priceOffset: 4000,
      durationOffset: 30,
    },
    {
      name: "Pacote Mensal",
      description: "4 visitas mensais com preço especial para fidelidade.",
      priceOffset: -5000,
      durationOffset: 0,
    },
  ],
})

// =====================================================
// FUNÇÃO PRINCIPAL OTIMIZADA
// =====================================================

async function seed() {
  try {
    console.log("🧹 Limpando banco de dados...")
    await retryWithBackoff(() =>
      db.execute(
        sql`TRUNCATE TABLE ${reviewLike}, ${review}, ${booking}, ${barbershopHour}, ${barbershopStatus}, ${barbershopService}, ${barbershop}, ${category}, ${user} CASCADE`,
      ),
    )

    // 1. Categorias (já era paralelo via drizzle)
    console.log("📁 Criando categorias...")
    const insertedCategories = await retryWithBackoff(() =>
      db.insert(category).values(categoriesToInsert).returning(),
    )

    // 2. Usuários (batch único - já otimizado)
    console.log("👥 Criando 25 usuários...")
    const usersToInsert = Array.from({ length: 25 }).map(() => {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      const email = faker.internet.email({ firstName, lastName }).toLowerCase()
      return {
        name: `${firstName} ${lastName}`,
        email,
        password: bcryptUtil.hashSync("@Password123"),
        phone: faker.phone.number({ style: "national" }),
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + " " + lastName)}&size=150&background=${faker.color.rgb().replace("#", "")}&color=fff`,
        isActive: true,
        emailVerified: faker.date.past(),
      }
    })
    const insertedUsers = await retryWithBackoff(() =>
      db.insert(user).values(usersToInsert).returning(),
    )

    // 3. Barbearias (batch único - já otimizado)
    console.log("💈 Criando 18 barbearias...")
    const barbershopsToInsert = Array.from({ length: 18 }).map((_, i) => {
      const location = BRAZILIAN_CITIES[i % BRAZILIAN_CITIES.length]
      const baseName = generateBarbershopName()
      const slug = `${faker.helpers.slugify(baseName).toLowerCase()}-${faker.string.alphanumeric(6)}`
      const streetTypes = ["Rua", "Avenida", "Travessa", "Alameda", "Praça"]
      const neighborhoods = [
        "Centro",
        "Jardins",
        "Vila Mariana",
        "Tijuca",
        "Boa Viagem",
        "Savassi",
        "Batel",
        "Moinhos de Vento",
        "Copacabana",
        "Ipanema",
        "Pinheiros",
        "Moema",
      ]
      return {
        name: baseName,
        slug,
        description: generateBarbershopDescription(),
        image: BARBERSHOP_IMAGES[i % BARBERSHOP_IMAGES.length],
        ownerId: insertedUsers[i % insertedUsers.length].id,
        address: `${faker.helpers.arrayElement(streetTypes)} ${faker.location.street()}`,
        city: location.city,
        state: location.state,
        zipCode: `${faker.number.int({ min: 10000, max: 99999 })}-${faker.number.int({ min: 0, max: 999 })}`,
        streetNumber: faker.number.int({ min: 1, max: 2500 }).toString(),
        neighborhood: faker.helpers.arrayElement(neighborhoods),
        complement: faker.datatype.boolean({ probability: 0.3 })
          ? faker.helpers.arrayElement([
              "Sala 101",
              "Loja 5",
              "2º andar",
              "Fundos",
              null,
            ])
          : null,
        phone: faker.phone.number({ style: "national" }),
        email: `contato@${faker.helpers.slugify(baseName).toLowerCase().replace(/\s+/g, "")}.com.br`,
        website: faker.datatype.boolean({ probability: 0.6 })
          ? `https://www.${faker.helpers.slugify(baseName).toLowerCase().replace(/\s+/g, "")}.com.br`
          : null,
        latitude: (
          location.lat +
          faker.number.float({ min: -0.01, max: 0.01, fractionDigits: 6 })
        ).toFixed(6),
        longitude: (
          location.lng +
          faker.number.float({ min: -0.01, max: 0.01, fractionDigits: 6 })
        ).toFixed(6),
        isActive: faker.datatype.boolean({ probability: 0.95 }),
      }
    })
    const insertedBarbershops = await retryWithBackoff(() =>
      db.insert(barbershop).values(barbershopsToInsert).returning(),
    )

    // 4. Horários (batch por barbearia - já eficiente)
    console.log("🕐 Configurando horários...")
    const daysOfWeek = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ] as const
    for (const shop of insertedBarbershops) {
      const hours = daysOfWeek.map((day) => {
        const isSunday = day === "sunday"
        const isSaturday = day === "saturday"
        const openHour = isSunday ? 0 : faker.helpers.arrayElement([8, 9, 10])
        const closeHour = isSunday
          ? 0
          : isSaturday
            ? 18
            : faker.helpers.arrayElement([20, 21, 22])
        return {
          barbershopId: shop.id,
          dayOfWeek: day,
          openingTime: isSunday
            ? "00:00"
            : `${String(openHour).padStart(2, "0")}:00`,
          closingTime: isSunday
            ? "00:00"
            : `${String(closeHour).padStart(2, "0")}:00`,
          isOpen: !isSunday,
        }
      })
      await db.insert(barbershopHour).values(hours)
    }

    // 5. Status (batch único)
    console.log("📊 Definindo status inicial...")
    await db.insert(barbershopStatus).values(
      insertedBarbershops.map((shop) => ({
        barbershopId: shop.id,
        isOpen: shop.isActive && faker.datatype.boolean({ probability: 0.9 }),
        reason: null,
        closedUntil: null,
      })),
    )

    // 6. Serviços (batch por barbearia)
    console.log("✂️ Gerando serviços...")
    const serviceVariations = generateServiceVariations()
    let totalServices = 0

    for (const shop of insertedBarbershops) {
      const availableCategories = faker.helpers.arrayElements(
        insertedCategories,
        faker.number.int({ min: 3, max: 6 }),
      )
      const servicesToInsert: (typeof barbershopService.$inferInsert)[] = []

      for (const cat of availableCategories) {
        const variations =
          serviceVariations[cat.slug as keyof typeof serviceVariations] ||
          serviceVariations.cabelo
        const selected = faker.helpers.arrayElements(
          variations,
          faker.number.int({ min: 1, max: variations.length }),
        )
        for (const variation of selected) {
          const baseTemplate = serviceTemplate.find(
            (t) => t.categoryId === cat.slug,
          )
          if (!baseTemplate) continue
          servicesToInsert.push({
            name: variation.name,
            slug: `${faker.helpers.slugify(variation.name).toLowerCase()}-${faker.string.alphanumeric(5)}`,
            description: variation.description,
            image:
              baseTemplate.images[
                faker.number.int({
                  min: 0,
                  max: baseTemplate.images.length - 1,
                })
              ],
            durationMinutes: Math.max(
              10,
              baseTemplate.durationMinutes + variation.durationOffset,
            ),
            priceInCents: Math.max(
              1000,
              baseTemplate.priceInCents +
                variation.priceOffset +
                faker.number.int({ min: -300, max: 500 }),
            ),
            categoryId: cat.id,
            isActive: true,
            barbershopId: shop.id,
          })
        }
      }
      if (servicesToInsert.length > 0) {
        await db.insert(barbershopService).values(servicesToInsert)
        totalServices += servicesToInsert.length
      }
    }

    // 🔥 7. AGENDAMENTOS OTIMIZADOS
    console.log("📅 Criando agendamentos...")
    let totalBookings = 0
    const allBookings: any[] = []
    const bookingsBuffer: any[] = []
    const BATCH_SIZE = 100 

    const DAYS_RANGE = 14

    const BOOKING_PROB = { past: 0.5, today: 0.25, future: 0.15 }

    for (const shop of insertedBarbershops) {
      if (!shop.isActive) continue
      const shopServices = await db
        .select()
        .from(barbershopService)
        .where(eq(barbershopService.barbershopId, shop.id))
      if (shopServices.length === 0) continue

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7)

      for (let dayOffset = 0; dayOffset < DAYS_RANGE; dayOffset++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(currentDate.getDate() + dayOffset)
        const dayOfWeek = currentDate.getDay()
        if (dayOfWeek === 0) continue

        const isSaturday = dayOfWeek === 6
        const [openHour, closeHour] = isSaturday ? [8, 18] : [8, 20]

        for (const service of shopServices) {
          if (!service.isActive) continue
          let currentTime = new Date(currentDate)
          currentTime.setHours(openHour, 0, 0, 0)
          const closingTime = new Date(currentDate)
          closingTime.setHours(closeHour, 0, 0, 0)
          const serviceDurationMs = service.durationMinutes * 60 * 1000

          while (
            currentTime.getTime() + serviceDurationMs <=
            closingTime.getTime()
          ) {
            const now = new Date()
            const isPast = currentTime < now
            const isToday = currentTime.toDateString() === now.toDateString()

            // 🔽 Probabilidades reduzidas para volume mais controlado
            const bookingProbability = isPast
              ? BOOKING_PROB.past
              : isToday
                ? BOOKING_PROB.today
                : BOOKING_PROB.future

            if (faker.datatype.boolean({ probability: bookingProbability })) {
              const endTime = new Date(currentTime)
              endTime.setMinutes(endTime.getMinutes() + service.durationMinutes)
              const randomUser = faker.helpers.arrayElement(insertedUsers)
              const status =
                currentTime < now
                  ? faker.helpers.arrayElement([
                      "completed",
                      "completed",
                      "completed",
                      "cancelled",
                    ] as const)
                  : faker.helpers.arrayElement([
                      "confirmed",
                      "confirmed",
                      "confirmed",
                      "cancelled",
                    ] as const)

              bookingsBuffer.push({
                userId: randomUser.id,
                serviceId: service.id,
                barbershopId: shop.id,
                scheduledAt: currentTime,
                endTime,
                status,
                notes: null,
                cancelledAt:
                  status === "cancelled" ? faker.date.recent() : null,
              })

              // ⚡ INSERT EM BATCH COM .returning() PARA CAPTURAR IDS
              if (bookingsBuffer.length >= BATCH_SIZE) {
                const inserted = await db
                  .insert(booking)
                  .values(bookingsBuffer)
                  .returning()
                allBookings.push(...inserted)
                totalBookings += inserted.length
                bookingsBuffer.length = 0
              }
            }
            currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000)
          }
        }
      }
    }

    // Insert do buffer restante
    if (bookingsBuffer.length > 0) {
      const inserted = await db
        .insert(booking)
        .values(bookingsBuffer)
        .returning()
      allBookings.push(...inserted)
      totalBookings += inserted.length
    }

    console.log(`✅ ${totalBookings} agendamentos criados`)

    // 8. Avaliações (batch único - já eficiente)
    console.log("⭐ Gerando avaliações...")
    const reviewsToInsert: any[] = []
    const completedBookings = allBookings.filter(
      (b) => b.status === "completed",
    )
    const bookingsWithReview = faker.helpers.arrayElements(
      completedBookings,
      Math.min(Math.floor(completedBookings.length * 0.3), 50),
    )

    for (const bookingItem of bookingsWithReview) {
      const rating = faker.number.int({ min: 3, max: 5 })
      const hasComment = faker.datatype.boolean({ probability: 0.8 })
      let comment: string | null = null
      if (hasComment) {
        const compliments = [
          "Atendimento excepcional!",
          "Profissional muito atencioso.",
          "Corte perfeito!",
          "Ambiente agradável e limpo.",
          "Vou indicar para amigos!",
          "Melhor barbearia da região!",
          "Preço justo pela qualidade.",
          "Voltarei com certeza.",
        ]
        const details = [
          "A toalha quente fez toda a diferença.",
          "O cafézinho no final foi um toque especial.",
          "Demorou um pouco, mas valeu a pena.",
          "Recomendo agendar pelo app.",
        ]
        comment = faker.helpers.arrayElement(compliments)
        if (faker.datatype.boolean({ probability: 0.4 }))
          comment += " " + faker.helpers.arrayElement(details)
      }
      let response: string | null = null
      let respondedAt: Date | null = null
      if (hasComment && faker.datatype.boolean({ probability: 0.15 })) {
        response = faker.helpers.arrayElement([
          "Obrigado pela confiança! Esperamos vê-lo em breve.",
          "Que bom que gostou! Nosso time fica feliz.",
          "Agradecemos o feedback! Volte sempre.",
          "Sua satisfação é nossa prioridade. Até a próxima!",
        ])
        respondedAt = faker.date.between({
          from: bookingItem.scheduledAt,
          to: new Date(),
        })
      }
      reviewsToInsert.push({
        userId: bookingItem.userId,
        barbershopId: bookingItem.barbershopId,
        bookingId: bookingItem.id,
        rating,
        comment,
        response,
        respondedAt,
        createdAt: faker.date.between({
          from: bookingItem.scheduledAt,
          to: new Date(),
        }),
        updatedAt: new Date(),
      })
    }

    let insertedReviews: any[] = []
    if (reviewsToInsert.length > 0) {
      insertedReviews = await db
        .insert(review)
        .values(reviewsToInsert)
        .returning()

      // 9. Likes (batch único)
      console.log("👍 Adicionando likes...")
      const reviewLikesToInsert: any[] = []
      const usedPairs = new Set<string>()
      for (const reviewItem of insertedReviews) {
        const baseLikes = reviewItem.rating >= 4 ? 3 : 1
        const numLikes = faker.number.int({ min: 0, max: baseLikes + 2 })
        for (let i = 0; i < numLikes; i++) {
          const randomUser = faker.helpers.arrayElement(insertedUsers)
          const key = `${reviewItem.id}-${randomUser.id}`
          if (!usedPairs.has(key) && randomUser.id !== reviewItem.userId) {
            usedPairs.add(key)
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
        console.log(`   • ${reviewLikesToInsert.length} likes criados`)
      }
    }

    // 10. Resumo
    console.log("\n✅ Seed finalizado!")
    console.log(`\n📊 Resumo:`)
    console.log(`   • ${insertedCategories.length} categorias`)
    console.log(`   • ${insertedUsers.length} usuários`)
    console.log(`   • ${insertedBarbershops.length} barbearias`)
    console.log(`   • ~${totalServices} serviços`)
    console.log(`   • ${totalBookings} agendamentos`)
    console.log(`   • ${insertedReviews.length} avaliações`)
    console.log(`\n📍 Cidades atendidas:`)
    ;[
      ...new Set(insertedBarbershops.map((b) => `${b.city}-${b.state}`)),
    ].forEach((city) => console.log(`   • ${city}`))
  } catch (error: any) {
    console.error("❌ Erro crítico no seed:", error?.message || error)
    throw error
  }
}

seed()
