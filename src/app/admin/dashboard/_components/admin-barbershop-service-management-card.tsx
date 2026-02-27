"use client"

import { useState } from "react"
import { Pencil, Trash2, Clock, Loader2, Eye, Delete } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/app/_components/ui/tooltip"
import { Button } from "@/src/app/_components/ui/button"
import { BarbershopServiceResult } from "@/src/db/types"
import { cn } from "@/src/app/_lib/utils.lib"
import { priceFormatter } from "@/src/app/_utils/price-formatter.util"
import { formatDuration } from "@/src/app/_utils/format-duration.util"
import Image from "next/image"
import Link from "next/link"
import { DeleteBarbershopServiceDialog } from "./delete-barbershop-service-dialog"

interface Props {
  service: BarbershopServiceResult
  barbershopSlug: string
  onEdit: (service: BarbershopServiceResult) => void
  onDelete?: (id: string) => void
}

export function AdminBarbershopServiceManagentCard({
  service,
  onEdit,
  onDelete,
  barbershopSlug,
}: Props) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!onDelete || deleting) return
    setDeleting(true)
    await onDelete(service.id)
    setDeleting(false)
  }

  return (
    <div className="group border-border bg-card hover:border-primary/20 relative flex flex-col gap-4 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center">
      <div className="bg-primary absolute top-1/2 left-0 hidden h-8 w-1 -translate-y-1/2 rounded-r-full opacity-0 transition-opacity group-hover:opacity-100 sm:block" />

      <div className="border-border bg-primary/5 relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border">
        <Image
          src={service.image || "/images/default.png"}
          alt={service.image ? service.name : "Sem Imagem"}
          fill
          className="rounded-xl object-cover"
        />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-foreground truncate text-sm font-semibold">
            {service.name}
          </p>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
              service.isActive
                ? "bg-green-500/10 text-green-500"
                : "bg-border text-muted-foreground",
            )}
          >
            {service.isActive ? "Ativo" : "Inativo"}
          </span>
        </div>
        {service.description && (
          <p className="text-muted-foreground line-clamp-1 text-xs">
            {service.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-primary text-sm font-bold">
            {priceFormatter.formatToPrice(service.priceInCents)}
          </span>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <Clock className="text-primary h-3 w-3" />
            {formatDuration(service.durationMinutes)}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 border-t pt-3 sm:border-0 sm:pt-0">
        {service.isActive && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/barbershops/${barbershopSlug}/services/${service.slug}`}
                className="border-border text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary flex h-9 w-9 flex-1 items-center justify-center rounded-lg border transition-all sm:flex-none"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Visualizar</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="border-border text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary flex h-9 w-9 flex-1 items-center justify-center rounded-lg border transition-all sm:flex-none"
              onClick={() => onEdit(service)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Editar</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <DeleteBarbershopServiceDialog
              handleDelete={handleDelete}
              deleting={deleting}
            />
          </TooltipTrigger>
          <TooltipContent>Excluir</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
