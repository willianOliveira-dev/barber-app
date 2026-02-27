"use server"

import { ActionResponse } from "@/src/app/_common/http/response/action.response"
import { authOptions } from "@/src/app/_lib/auth.lib"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { barbershopServiceRepo } from "@/src/repositories/barbershop-service.repository"
import { uploadToCloudinary } from "@/src/app/_lib/cloudinary.lib"
import { type CreateBarbershopServiceData as CreateBarbershopService } from "@/src/db/types"
import slugify from "slugify"

const createBarbershopServiceSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "O nome deve ter no mínimo 3 caracteres" })
      .max(150, { message: "O nome deve ter no máximo 150 caracteres" })
      .nonempty({ message: "O nome é obrigatório" }),
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
      .min(1, { message: "O preço deve ser maior que zero" }),
    durationMinutes: z.number().min(1, {
      message: "A duração deve ser maior que zero",
    }),
    barbershopId: z.uuid().nonempty({ message: "A barbearia é obrigatória" }),
    categoryId: z.uuid().nonempty({ message: "A categoria é obrigatória" }),
    isActive: z.boolean().default(true).optional(),
  })
  .transform((data) => {
    const baseSlug = slugify(data.name, { lower: true, strict: true })
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`
    return { ...data, slug: uniqueSlug }
  })

type CreateBarbershopServiceData = z.infer<typeof createBarbershopServiceSchema>

interface CreateBarbershopServiceActionParams {
  data: CreateBarbershopServiceData
  imageFormData: FormData
}

export async function createBarbershopServiceAction({
  data,
  imageFormData,
}: CreateBarbershopServiceActionParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      console.error("[createBarbershopServiceAction] Usuário não autenticado")
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    if (session.user.role !== "barber") {
      console.error("[createBarbershopServiceAction] Usuário não é barbeiro")
      return ActionResponse.fail({
        error: "USER_FORBIDDEN",
        message: "Você não tem permissão para criar um serviço",
        statusCode: 403,
      })
    }

    const safeParse = createBarbershopServiceSchema.safeParse(data)

    if (!safeParse.success) {
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
          "[createBarbershopServiceAction] Erro ao fazer upload da imagem",
          error,
        )
        return ActionResponse.fail({
          error: "INTERNAL_ERROR",
          message: "Erro ao fazer upload da imagem",
          statusCode: 500,
        })
      }
    }

    const barbershopService: CreateBarbershopService = {
      ...barbershopServiceData,
      ...(imageUrl !== null && { image: imageUrl }),
    }

    const createBarbershopService =
      await barbershopServiceRepo.create(barbershopService)

    revalidatePath("/admin/barbershops/*/services")

    return ActionResponse.success({
      message: "Serviço criado com sucesso",
      statusCode: 201,
      data: createBarbershopService,
    })
  } catch (error) {
    console.error("[createBarbershopServiceAction]", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao criar serviço",
      statusCode: 500,
    })
  }
}
