import { MessageSquare } from "lucide-react"
import { AdminReviewCard } from "../_components/admin-review-card"

const reviews = [
  {
    id: "1",
    user: "Lucas Mendes",
    rating: 5,
    comment: "Atendimento excelente, saí muito satisfeito!",
    service: "Corte + Barba",
    barbershop: "Razor Centro",
    date: "20 fev 2026",
    response: null,
  },
  {
    id: "2",
    user: "Pedro Alves",
    rating: 3,
    comment: "Demorou um pouco mais que o esperado.",
    service: "Corte Social",
    barbershop: "Razor Pinheiros",
    date: "19 fev 2026",
    response: null,
  },
  {
    id: "3",
    user: "João Silva",
    rating: 5,
    comment: "Melhor barbearia da cidade!",
    service: "Degradê",
    barbershop: "Razor Sul",
    date: "18 fev 2026",
    response: "Obrigado pela avaliação, João! Ficamos felizes em atendê-lo.",
  },
]

export default function AdminReviewsPage() {
  return (
    <div className="mx-auto max-w-screen-2xl">
      <section className="border-border border-b px-5 py-8 lg:px-8 xl:px-12">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
              Comunidade
            </p>
            <h1 className="text-2xl leading-tight font-bold lg:text-3xl">
              Comentá<span className="text-primary">rios</span>
            </h1>
            <p className="text-muted-foreground text-xs">
              {reviews.filter((r) => !r.response).length} aguardando resposta
            </p>
          </div>
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
            <MessageSquare className="text-primary h-5 w-5" />
          </div>
        </div>
      </section>

      <section className="px-5 py-8 lg:px-8 xl:px-12">
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <AdminReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>
    </div>
  )
}
