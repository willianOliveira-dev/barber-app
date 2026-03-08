// admin-review-card.tsx
"use client"

import { useState } from "react"
import {
  MessageSquareQuote,
  Send,
  CheckCircle2,
  Loader2,
  Star as StarIcon,
} from "lucide-react"
import { cn } from "../../../_lib/utils.lib"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { replyReviewAction } from "../reviews/_actions/reply-review.action"

interface AdminReviewCardProps {
  review: {
    id: string
    rating: number
    comment: string | null
    response: string | null
    createdAt: Date
    user: {
      name: string | null
      image: string | null
    }
    booking: {
      service: {
        name: string
      }
    } | null
  }
  barbershopName: string
}

function Star({ filled }: { filled?: boolean }) {
  return (
    <StarIcon
      className={cn(
        "inline-block h-2.5 w-2.5 fill-current",
        filled ? "text-yellow-400" : "text-muted-foreground",
      )}
    />
  )
}

export function AdminReviewCard({
  review,
  barbershopName,
}: AdminReviewCardProps) {
  const [response, setResponse] = useState(review.response ?? "")
  const [saved, setSaved] = useState(!!review.response)
  const [editing, setEditing] = useState(!review.response)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!response.trim()) return
    setLoading(true)

    const result = await replyReviewAction({
      reviewId: review.id,
      response,
    })

    if (!result.success) {
      toast.error(result.message ?? "Erro ao responder avaliação")
      setLoading(false)
      return
    }

    toast.success("Resposta enviada com sucesso")
    setSaved(true)
    setEditing(false)
    setLoading(false)
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border">
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold">
              {review.user.name?.[0] ?? "?"}
            </div>
            <div>
              <p className="text-foreground text-sm font-semibold">
                {review.user.name ?? "Usuário"}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} filled={i < review.rating} />
                  ))}
                </div>
                <span className="text-muted-foreground text-[10px]">
                  {format(new Date(review.createdAt), "dd MMM yyyy", {
                    locale: ptBR,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1">
            <span className="text-muted-foreground text-xs">
              {barbershopName}
            </span>
            {review.booking?.service && (
              <span className="border-border bg-background/50 text-muted-foreground rounded-full border px-2 py-0.5 text-[10px]">
                {review.booking.service.name}
              </span>
            )}
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {review.comment ?? "Sem comentário"}
        </p>
      </div>

      <div className="border-border bg-background/30 border-t p-5">
        <div className="mb-3 flex items-center gap-2">
          <MessageSquareQuote className="text-primary h-3.5 w-3.5" />
          <p className="text-foreground text-xs font-semibold">
            Resposta da barbearia
          </p>
          {saved && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-primary ml-auto text-[10px] hover:underline"
            >
              Editar
            </button>
          )}
        </div>

        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              rows={3}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Escreva uma resposta para o cliente..."
              className="border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:ring-primary/20 w-full resize-none rounded-xl border px-3 py-2.5 text-sm focus:ring-1 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              {saved && (
                <button
                  onClick={() => setEditing(false)}
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={loading || !response.trim()}
                className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                {loading ? "Enviando..." : "Responder"}
              </button>
            </div>
          </div>
        ) : (
          <div className="border-border bg-card/50 flex items-start gap-2 rounded-xl border p-3">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-400" />
            <p className="text-muted-foreground text-xs leading-relaxed">
              {response}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
