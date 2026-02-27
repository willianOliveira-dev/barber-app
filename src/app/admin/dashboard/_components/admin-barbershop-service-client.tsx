"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AdminBarbershopServiceList } from "./admin-barbershop-service-list"
import { NewBarbershopServiceFormData } from "../barbershops/_hooks/use-new-barbershop-service-form.hook"
import { createBarbershopServiceAction } from "../barbershops/_actions/create-barbershop-service.action"
import type {
  BarbershopServiceResult,
  Category,
  PaginationMeta,
} from "@/src/db/types"
import { priceFormatter } from "@/src/app/_utils/price-formatter.util"
import { updateBarbershopServiceAction } from "../barbershops/_actions/update-barbershop-service.action"
import { deleteBarbershopServiceAction } from "../barbershops/_actions/delete-barbershop-service.action"

interface Props {
  services: BarbershopServiceResult[]
  barbershopId: string
  barbershopSlug: string
  categories: Category[]
  pagination: PaginationMeta
}

export function AdminBarbershopServicesClient({
  services,
  barbershopId,
  barbershopSlug,
  categories,
  pagination,
}: Props) {
  const router = useRouter()
  const imageFormData = new FormData()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleCreate = async (data: NewBarbershopServiceFormData) => {
    setIsLoading(true)
    const durationMinutes =
      Number(data.duration.hour) * 60 + Number(data.duration.minute)

    const priceInCents = priceFormatter.formatToCents(data.price)

    if (data.image && data.image instanceof File) {
      imageFormData.append("image", data.image)
    }

    const result = await createBarbershopServiceAction({
      data: {
        name: data.name,
        slug: data.name,
        barbershopId,
        durationMinutes,
        priceInCents,
        categoryId: data.categoryId,
        description: data.description,
        isActive: data.isActive,
      },
      imageFormData,
    })

    result.success ? toast.success(result.message) : toast.error(result.message)

    setIsLoading(false)
    if (result.success) router.refresh()
  }

  const handleUpdate = async (
    id: string,
    data: NewBarbershopServiceFormData,
  ) => {
    setIsLoading(true)
    const durationMinutes =
      Number(data.duration.hour) * 60 + Number(data.duration.minute)

    const priceInCents = priceFormatter.formatToCents(data.price)

    if (data.image && data.image instanceof File) {
      imageFormData.append("image", data.image)
    }

    const result = await updateBarbershopServiceAction({
      serviceId: id,
      data: {
        name: data.name,
        slug: data.name,
        categoryId: data.categoryId,
        description: data.description,
        isActive: data.isActive,
        durationMinutes,
        priceInCents,
      },
      imageFormData,
    })

    result.success ? toast.success(result.message) : toast.error(result.message)

    setIsLoading(false)
    if (result.success) router.refresh()
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    const result = await deleteBarbershopServiceAction(id)
    result.success ? toast.success(result.message) : toast.error(result.message)
    setIsLoading(false)
    if (result.success) router.refresh()
  }

  return (
    <AdminBarbershopServiceList
      services={services}
      barbershopSlug={barbershopSlug}
      categories={categories}
      pagination={pagination}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      isLoading={isLoading}
    />
  )
}
