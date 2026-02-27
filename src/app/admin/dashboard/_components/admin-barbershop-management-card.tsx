"use client"

import { Card } from "@/src/app/_components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/src/app/_components/ui/tooltip"
import { cn } from "@/src/app/_lib/utils.lib"
import { Eye, Pencil, Scissors, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { type BarbershopOwnerResult } from "@/src/db/types"
import { DeleteBarbershopDialog } from "./delete-barbershop-dialog"
import { useState } from "react"
import { deleteBarbershopAction } from "../barbershops/_actions/delete-barbershop.action"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function AdminBarbershopManagementCard({
  barbershop,
}: {
  barbershop: BarbershopOwnerResult
}) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const result = await deleteBarbershopAction(barbershop.id)
    result.success ? toast.success(result.message) : toast.error(result.message)
    if (result.success) router.refresh()
    setDeleting(false)
  }

  return (
    <TooltipProvider>
      <Card className="group border-border bg-card hover:border-primary/30 relative flex flex-col gap-4 rounded-2xl border p-4 transition-all duration-300 hover:shadow-lg sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-4">
          <div className="border-border bg-primary/5 group-hover:bg-primary/10 relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border transition-colors">
            <Image
              src={barbershop.image || "/images/default.png"}
              alt={barbershop.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2">
              <p className="text-foreground truncate text-sm font-semibold">
                {barbershop.name}
              </p>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  barbershop.isActive
                    ? "bg-green-500/10 text-green-500"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {barbershop.isActive ? "Ativa" : "Inativa"}
              </span>
            </div>
            <p className="text-muted-foreground truncate text-xs">
              {barbershop.address}{" "}
              {barbershop.streetNumber && `, ${barbershop.streetNumber}`} -{" "}
              {barbershop.state}
            </p>
            <p className="text-primary/70 text-xs font-medium">
              {barbershop.servicesCount} serviços
            </p>
          </div>
        </div>

        <div className="border-border flex items-center gap-2 border-t pt-2 sm:ml-auto sm:border-0 sm:pt-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/barbershops/${barbershop.slug}`}
                className="border-border text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary flex h-9 w-9 flex-1 items-center justify-center rounded-lg border transition-all sm:flex-none"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Visualizar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/admin/dashboard/barbershops/${barbershop.slug}/services`}
                className="border-border text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary flex h-9 flex-2 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs transition-all sm:flex-none"
              >
                <Scissors className="h-4 w-4" />
                <span className="font-medium">Serviços</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Serviços</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/admin/dashboard/barbershops/${barbershop.slug}/edit`}
                className="border-border text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary flex h-9 w-9 flex-1 items-center justify-center rounded-lg border transition-all sm:flex-none"
              >
                <Pencil className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <DeleteBarbershopDialog
                handleDelete={handleDelete}
                deleting={deleting}
              />
            </TooltipTrigger>
            <TooltipContent>Excluir</TooltipContent>
          </Tooltip>
        </div>

        <div className="bg-primary absolute top-1/2 left-0 hidden h-8 w-1 -translate-y-1/2 rounded-r-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block" />
      </Card>
    </TooltipProvider>
  )
}
