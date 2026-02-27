"use client"

import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/app/_components/ui/dialog"
import { Pencil, Plus } from "lucide-react"
import {
  useNewBarbershopServiceForm,
  NewBarbershopServiceFormData,
} from "../barbershops/_hooks/use-new-barbershop-service-form.hook"
import { AdminBarbershopServiceForm } from "./admin-barbershop-service-form"
import { BarbershopServiceResult } from "@/src/db/types"
import { Form } from "@/src/app/_components/ui/form"
import { priceFormatter } from "@/src/app/_utils/price-formatter.util"

interface AdminBarbershopServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit" | null
  categories: Array<{ id: string; name: string }>
  service?: BarbershopServiceResult | null
  onCreate: (data: NewBarbershopServiceFormData) => Promise<void>
  onUpdate?: (id: string, data: NewBarbershopServiceFormData) => Promise<void>
  isLoading?: boolean
}

export function AdminBarbershopServiceDialog({
  open,
  onOpenChange,
  mode,
  categories,
  service,
  onCreate,
  onUpdate,
  isLoading,
}: AdminBarbershopServiceDialogProps) {
  const isEdit = mode === "edit"
  const form = useNewBarbershopServiceForm()

  useEffect(() => {
    if (!open) {
      form.reset()
      return
    }
    if (isEdit && service) {
      form.reset({
        name: service.name,
        description: service.description ?? "",
        image: service.image ?? undefined,
        categoryId: service.category?.id,
        duration: {
          hour: Math.floor(service.durationMinutes / 60).toString(),
          minute: (service.durationMinutes % 60).toString(),
        },
        price: priceFormatter.formatToPrice(service.priceInCents),
        isActive: service.isActive,
      })
    } else if (mode === "create") {
      form.reset({
        name: "",
        description: "",
        image: "",
        categoryId: "",
        duration: { hour: "", minute: "" },
        price: "",
        isActive: true,
      })
    }
  }, [open, mode, isEdit, service, form])

  const handleSubmit = async (data: NewBarbershopServiceFormData) => {
    if (isEdit && service?.id && onUpdate) {
      await onUpdate(service.id, data)
    } else {
      await onCreate(data)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card flex flex-col gap-0 overflow-y-auto rounded-2xl border p-0 sm:max-w-lg">
        <DialogHeader className="border-border gap-0 border-b px-5 pt-4 pb-0">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              {isEdit ? (
                <Pencil className="text-primary h-4 w-4" />
              ) : (
                <Plus className="text-primary h-4 w-4" />
              )}
            </div>
            <div>
              <DialogTitle className="text-sm font-semibold uppercase">
                {isEdit ? "Editar serviço" : "Novo serviço"}
              </DialogTitle>
              {service && (
                <DialogDescription className="text-muted-foreground text-xs">
                  {service.name}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 pt-2">
          <Form {...form}>
            <AdminBarbershopServiceForm
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
              isLoading={isLoading}
            />
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
