"use client"

import { useState } from "react"
import { Plus, Scissors } from "lucide-react"
import { Button } from "@/src/app/_components/ui/button"
import { AppPagination } from "@/src/app/_components/pagination"
import { AdminBarbershopServiceManagentCard } from "./admin-barbershop-service-management-card"
import { AdminBarbershopServiceDialog } from "./admin-barbershop-service-dialog"
import { NewBarbershopServiceFormData } from "../barbershops/_hooks/use-new-barbershop-service-form.hook"
import {
  BarbershopServiceResult,
  Category,
  PaginationMeta,
} from "@/src/db/types"

type DialogMode = "create" | "edit" | null

interface AdminBarbershopServiceListProps {
  services: BarbershopServiceResult[]
  barbershopSlug: string
  categories: Category[]
  pagination: PaginationMeta
  onCreate: (data: NewBarbershopServiceFormData) => Promise<void>
  onUpdate?: (id: string, data: NewBarbershopServiceFormData) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  isLoading?: boolean
}

export function AdminBarbershopServiceList({
  services,
  categories,
  pagination,
  onCreate,
  onUpdate,
  onDelete,
  isLoading,
  barbershopSlug,
}: AdminBarbershopServiceListProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [selectedService, setSelectedService] =
    useState<BarbershopServiceResult | null>(null)

  const openCreate = () => {
    setSelectedService(null)
    setDialogMode("create")
    setDialogOpen(true)
  }
  const openEdit = (service: BarbershopServiceResult) => {
    setSelectedService(service)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          {pagination.total} {pagination.total === 1 ? "serviço" : "serviços"}
        </p>
        <Button size="sm" className="gap-2 rounded-xl" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Novo serviço
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="border-border bg-card flex flex-col items-center gap-3 rounded-2xl border py-16 text-center">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
            <Scissors className="text-primary h-6 w-6" />
          </div>
          <p className="text-foreground text-sm font-semibold">
            Nenhum serviço cadastrado
          </p>
          <Button size="sm" className="gap-2 rounded-xl" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Criar primeiro
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {services.map((s) => (
            <AdminBarbershopServiceManagentCard
              key={s.id}
              service={s}
              barbershopSlug={barbershopSlug}
              onEdit={openEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-auto pt-4">
          <AppPagination meta={pagination} />
        </div>
      )}

      <AdminBarbershopServiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        categories={categories}
        service={selectedService}
        onCreate={onCreate}
        onUpdate={onUpdate}
        isLoading={isLoading}
      />
    </div>
  )
}
