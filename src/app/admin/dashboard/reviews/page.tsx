import { MessageSquare } from "lucide-react"
import { AdminReviewCard } from "../_components/admin-review-card"
import { getAdminReviewsAction } from "./_actions/get-barbershop-reviews.action"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/app/_lib/auth.lib"

export default async function AdminReviewsPage() {
  const session = await getServerSession(authOptions)
  const barbershop = await barbershopRepo.findByOwnerId(session!.user.id)
  const response = await getAdminReviewsAction()

  const reviews =
    response.success && "data" in response ? response.data.reviews : []

  const pendingCount = reviews.filter((r) => !r.response).length

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
              {pendingCount} aguardando resposta
            </p>
          </div>
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
            <MessageSquare className="text-primary h-5 w-5" />
          </div>
        </div>
      </section>

      <section className="px-5 py-8 lg:px-8 xl:px-12">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <MessageSquare className="text-muted-foreground h-8 w-8" />
            <p className="text-muted-foreground text-sm">
              Nenhuma avaliação ainda
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <AdminReviewCard
                key={review.id}
                review={review}
                barbershopName={barbershop?.name ?? ""}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
