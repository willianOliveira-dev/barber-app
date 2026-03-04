import OpenAI from "openai"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { env } from "@/src/config/env"
import { reviewRepo } from "@/src/repositories/review.repository"
import { getServerSession } from "next-auth"

const groq = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
})

interface RunBarbershopBotParams {
  userMessage: string
  barbershopId: string
  conversationHistory: { role: "user" | "assistant"; content: string }[]
}

export async function runBarbershopBot({
  userMessage,
  barbershopId,
  conversationHistory,
}: RunBarbershopBotParams) {
  const session = await getServerSession()
  const barbershop = await barbershopRepo.findById(barbershopId)
  const reviewContext =
    await reviewRepo.findBarbershopReviewContext(barbershopId)
  const { services } =
    await barbershopRepo.findServicesByBarbershop(barbershopId)

  const userText =
    session && session.user
      ? `Usuário: ${session.user.name} (${session.user.email}), ID: ${session.user.id}, Celular: ${session.user.phone ?? "Não informado"}`
      : "Usuário não identificado"

  const reviewContextText = reviewContext
    .map((r) => `Avaliação de ${r.rating}/5 - ${r.user.name}: ${r.comment}`)
    .join("\n")

  const hoursText = barbershop?.hours
    .map((hour) =>
      hour.isOpen
        ? `${hour.dayOfWeek}: ${hour.openingTime} às ${hour.closingTime}`
        : `${hour.dayOfWeek}: Fechado`,
    )
    .join("\n")

  const servicesText = services
    .map(
      (s) =>
        `- ${s.name}: R$${(s.priceInCents / 100).toFixed(2)}, duração:${s.durationMinutes} min:${s.description ? ` — ${s.description} - categoria:${s.category}` : ""}`,
    )
    .join("\n")

  const systemPrompt = `
You are the Official Assistant of the barbershop "${barbershop?.name}".

Your role is to provide accurate and verified information to customers in a natural, human-like, and professional way, similar to a real chat conversation.

Customer Context:
${userText}

Important:
- Use customer information only if strictly necessary.
- Do not expose sensitive data unless explicitly requested.
- Do not assume additional details based on the customer information.

Tone:
- Polite
- Professional
- Clear
- Concise
- Natural
- Objective

Always respond in Brazilian Portuguese (PT-BR).
Never respond in English.
If the user asks for another language, respond exactly:
[HUMAN_REQUIRED]

On the first message of the conversation, briefly introduce yourself:
Greet the user, say you are the official assistant of ${barbershop?.name}, and ask how you can help.
Do not repeat the introduction after the first message.

Use ONLY the official data provided below.
Do not invent information.
Do not estimate.
Do not assume missing details.
Do not infer context.
If the requested information is not explicitly available in the provided data, respond exactly:
[HUMAN_REQUIRED]

If the user wants to schedule an appointment, respond exactly:
"Os agendamentos devem ser realizados exclusivamente pelo aplicativo oficial da barbearia."
Do not simulate bookings.
Do not confirm availability.
Do not collect personal data.

If asked about reviews or reputation, use only the provided feedback summary.
Do not mention ratings, averages, stars, or number of reviews.
Do not generate testimonials.

Keep answers short and conversational.
Avoid rigid formatting, bullet lists, or structured blocks.
Write as if chatting with a real customer.

Official Data:

General Information:
Name: ${barbershop?.name}
Address: ${barbershop?.address}
Neighborhood: ${barbershop?.neighborhood}
City/State: ${barbershop?.city} - ${barbershop?.state}
ZIP: ${barbershop?.zipCode}
Complement: ${barbershop?.complement ?? "Not provided"}
Phone: ${barbershop?.phone ?? "Not provided"}
Email: ${barbershop?.email ?? "Not provided"}
Website: ${barbershop?.website ?? "Not provided"}

Opening Hours:
${hoursText}

Services:
${servicesText}

Review Summary:
${reviewContextText}
`

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    max_tokens: 1024,
    messages: [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: userMessage },
    ],
  })

  const reply = response.choices[0].message.content?.trim() ?? ""
  const requiresHuman = reply.includes("[HUMAN_REQUIRED]")

  return {
    reply: requiresHuman
      ? "Vou te conectar com um de nossos atendentes. Aguarde um momento!"
      : reply,
    requiresHuman,
  }
}
