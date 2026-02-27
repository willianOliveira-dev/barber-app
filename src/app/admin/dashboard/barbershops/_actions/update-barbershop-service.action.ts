"use server"

import { ActionResponse } from "@/src/app/_common/http/response/action.response"
import { authOptions } from "@/src/app/_lib/auth.lib"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import slugify from "slugify"
import {
  UpdateBarbershopServiceData as UpdateBarbershopService,
  type BarbershopService,
} from "@/src/db/types"
import { notFound } from "next/navigation"
import { uploadToCloudinary } from "@/src/app/_lib/cloudinary.lib"
import { barbershopServiceRepo } from "@/src/repositories/barbershop-service.repository"

const updateBarbershopServiceSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "O nome deve ter no mínimo 3 caracteres" })
      .max(150, { message: "O nome deve ter no máximo 150 caracteres" })
      .optional(),
    slug: z.string().nonempty({ message: "O slug é obrigatório" }),
    description: z
      .string()
      .min(50, {
        message: "A descrição deve ter no mínimo 50 caracteres",
      })
      .max(400, {
        message: "A descrição deve ter no máximo 400 caracteres",
      })
      .optional()
      .or(z.literal("")),
    priceInCents: z
      .number({ message: "O preço deve ser um número" })
      .min(1, { message: "O preço deve ser maior que zero" })
      .optional(),
    durationMinutes: z
      .number()
      .min(1, {
        message: "A duração deve ser maior que zero",
      })
      .optional(),
    barbershopId: z.uuid().optional(),
    categoryId: z.uuid().optional(),
    isActive: z.boolean().optional(),
  })
  .transform((data) => {
    if (data.name) {
      const baseSlug = slugify(data.name, { lower: true, strict: true })
      const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`
      return { ...data, slug: uniqueSlug }
    }
    return data
  })

export type UpdateBarbershopServiceData = z.infer<
  typeof updateBarbershopServiceSchema
>

interface UpdateBarbershopServiceActionParams {
  serviceId: string
  data: UpdateBarbershopServiceData
  imageFormData: FormData
}

export async function updateBarbershopServiceAction({
  serviceId,
  data,
  imageFormData,
}: UpdateBarbershopServiceActionParams) {
  let service: BarbershopService | null

  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      console.error("[updateBarbershopServiceAction] Usuário não autenticado")
      return ActionResponse.fail({
        error: "UNAUTHORIZED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    if (session.user.role !== "barber") {
      console.error("[updateBarbershopServiceAction] Usuário não é barbeiro")
      return ActionResponse.fail({
        error: "USER_FORBIDDEN",
        message: "Você não tem permissão para atualizar um serviço",
        statusCode: 403,
      })
    }

    const safeParse = updateBarbershopServiceSchema.safeParse(data)

    if (!safeParse.success) {
      console.error("[updateBarbershopServiceAction] Dados inválidos")
      return ActionResponse.fail({
        error: "INVALID_DATA",
        message: safeParse.error.issues[0].message,
        statusCode: 400,
      })
    }

    const barbershopServiceData = safeParse.data
    let imageUrl: string | null = null

    const imageFile = imageFormData.get("image") as File | null
    if (imageFile && imageFile.size > 0) {
      const MAX_FILE_SIZE = 5 * 1024 * 1024
      try {
        if (imageFile.size > MAX_FILE_SIZE) {
          return ActionResponse.fail({
            error: "FILE_TOO_LARGE",
            message: "A imagem deve ter no máximo 5MB",
            statusCode: 400,
          })
        }
        const buffer = Buffer.from(await imageFile.arrayBuffer())

        const { secure_url } = await uploadToCloudinary({
          folder: "services",
          buffer,
          publicId: barbershopServiceData.slug,
        })

        imageUrl = secure_url
      } catch (error) {
        console.error(
          "[updateBarbershopServiceAction] Erro ao fazer upload da imagem",
          error,
        )
        return ActionResponse.fail({
          error: "INTERNAL_ERROR",
          message: "Erro ao fazer upload da imagem",
          statusCode: 500,
        })
      }
    }

    const barbershopService: UpdateBarbershopService = {
      ...barbershopServiceData,
      ...(imageUrl !== null && { image: imageUrl }),
    }

    service = await barbershopServiceRepo.update(serviceId, barbershopService)
  } catch (error) {
    console.error("[updateBarbershopServiceAction]", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao atualizar serviço",
      statusCode: 500,
    })
  }

  if (!service) {
    console.error("[updateBarbershopServiceAction] Serviço não encontrado")
    notFound()
  }

  revalidatePath("/admin/dashboard/barbershops/*/services")

  return ActionResponse.success({
    message: "Serviço atualizado com sucesso",
    statusCode: 200,
    data: null,
  })
}
