"use server"

import { z } from "zod"
import { ActionResponse } from "@/src/app/_common/http/response/action.response"
import { authOptions } from "@/src/app/_lib/auth.lib"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { getServerSession } from "next-auth"
import { isValidCEP, isValidPhone } from "@brazilian-utils/brazilian-utils"
import { getCoordsFromAddress } from "@/src/app/_utils/get-coords-from-address.util"
import { revalidatePath } from "next/cache"
import { UpdateBarbershopData as UpdateBarbershop } from "@/src/db/types"
import { validateOpeningBeforeClosing } from "@/src/app/_utils/validate-opening-before-closing.util"
import { uploadToCloudinary } from "@/src/app/_lib/cloudinary.lib"
import { notFound } from "next/navigation"
import slugify from "slugify"

const dayOfWeekEnum = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
])

const barbershopHourSchema = z
  .object({
    dayOfWeek: dayOfWeekEnum,
    openingTime: z
      .string()
      .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Horário inválido. Use o formato HH:MM",
      })
      .or(z.literal("")),
    closingTime: z
      .string()
      .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Horário inválido. Use o formato HH:MM",
      })
      .or(z.literal("")),
    isOpen: z.boolean().default(false),
  })
  .refine(validateOpeningBeforeClosing, {
    message: "O horário de fechamento deve ser maior que o de abertura",
    path: ["closingTime"],
  })

const barbershopStatusSchema = z.object({
  isOpen: z.boolean(),
  reason: z.string().optional(),
  closedUntil: z.date().optional(),
})

const updateBarbershopSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "O nome deve ter no mínimo 3 caracteres" })
      .max(150, { message: "O nome deve ter no máximo 150 caracteres" })
      .optional(),
    slug: z.string().optional(),
    description: z
      .string()
      .min(100, { message: "A descrição deve ter no mínimo 100 caracteres" })
      .max(4000, { message: "A descrição deve ter no máximo 4000 caracteres" })
      .optional()
      .or(z.literal("")),
    address: z
      .string()
      .min(3, { message: "O endereço deve ter no mínimo 3 caracteres" })
      .max(255, { message: "O endereço deve ter no máximo 255 caracteres" })
      .optional(),
    city: z
      .string()
      .min(3, { message: "A cidade deve ter no mínimo 3 caracteres" })
      .max(100, { message: "A cidade deve ter no máximo 100 caracteres" })
      .optional(),
    state: z
      .string()
      .length(2, { message: "O estado deve ter 2 caracteres" })
      .toUpperCase()
      .optional(),
    zipCode: z
      .string()
      .refine(isValidCEP, { message: "CEP inválido" })
      .optional(),
    streetNumber: z
      .string()
      .min(1, { message: "O número deve ter no mínimo 1 caractere" })
      .max(20, { message: "O número deve ter no máximo 20 caracteres" })
      .optional(),
    neighborhood: z.string().optional(),
    complement: z.string().optional(),
    phone: z
      .string()
      .refine(isValidPhone, { message: "Número de telefone inválido" })
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .email({ message: "Email inválido" })
      .optional()
      .or(z.literal("")),
    website: z
      .string()
      .url({ message: "URL inválida" })
      .optional()
      .or(z.literal("")),
    isActive: z.boolean().optional(),
    hours: z.array(barbershopHourSchema).optional(),
    status: barbershopStatusSchema.optional(),
  })
  .transform((data) => {
    if (data.name) {
      const baseSlug = slugify(data.name, { lower: true, strict: true })
      const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`
      return { ...data, slug: uniqueSlug }
    }
    return data
  })

export type UpdateBarbershopData = z.infer<typeof updateBarbershopSchema>

interface UpdateBarbershopActionParams {
  barbershopId: string
  data: UpdateBarbershopData
  imageFormData: FormData
}

export async function updateBarbershopAction({
  barbershopId,
  data,
  imageFormData,
}: UpdateBarbershopActionParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      console.error("[updateBarbershopAction] Usuário não autenticado")
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    if (session.user.role !== "barber") {
      console.error("[updateBarbershopAction] Usuário não é barbeiro")
      return ActionResponse.fail({
        error: "USER_FORBIDDEN",
        message: "Você não tem permissão para atualizar uma barbearia",
        statusCode: 403,
      })
    }

    const safeParse = updateBarbershopSchema.safeParse(data)

    if (!safeParse.success) {
      return ActionResponse.fail({
        error: "INVALID_DATA",
        message: safeParse.error.issues[0].message,
        statusCode: 400,
      })
    }

    const { hours, status, ...barbershopData } = safeParse.data

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
          folder: "barbershops",
          buffer,
          publicId: barbershopData.slug ?? barbershopId,
        })
        imageUrl = secure_url
      } catch (error) {
        console.error(
          "[updateBarbershopAction] Erro ao fazer upload da imagem",
          error,
        )
        return ActionResponse.fail({
          error: "INTERNAL_ERROR",
          message: "Erro ao fazer upload da imagem",
          statusCode: 500,
        })
      }
    }

    let coords: { latitude: string | null; longitude: string | null } = {
      latitude: null,
      longitude: null,
    }
    const hasAddressChange =
      barbershopData.address ||
      barbershopData.city ||
      barbershopData.state ||
      barbershopData.zipCode

    if (hasAddressChange) {
      const result = await getCoordsFromAddress({
        address: barbershopData.address ?? "",
        streetNumber: barbershopData.streetNumber,
        city: barbershopData.city ?? "",
        state: barbershopData.state ?? "",
        zipCode: barbershopData.zipCode ?? "",
        neighborhood: barbershopData.neighborhood,
      })
      coords = {
        latitude: result.latitude ?? null,
        longitude: result.longitude ?? null,
      }
    }

    const barbershop: UpdateBarbershop = {
      ...barbershopData,
      ...(hasAddressChange && {
        latitude: coords.latitude ?? null,
        longitude: coords.longitude ?? null,
      }),
      ...(imageUrl !== null && { image: imageUrl }),
    }

    const updatedBarbershop = await barbershopRepo.update(
      barbershopId,
      barbershop,
      hours ?? [],
      status ?? { isOpen: true },
    )

    if (!updatedBarbershop) {
      console.error("[updateBarbershopAction] Barbearia não encontrada")
      notFound()
    }

    revalidatePath("/")
    revalidatePath("/barbershops")
    revalidatePath("/admin/barbershops")
    revalidatePath(`/barbershops/${updatedBarbershop.slug}`)

    return ActionResponse.success({
      message: "Barbearia atualizada com sucesso",
      statusCode: 200,
      data: {
        barbershopId: updatedBarbershop.id,
        slug: updatedBarbershop.slug,
      },
    })
  } catch (error) {
    console.error("[updateBarbershopAction]", error)
    return ActionResponse.fail({
      error: "INTERNAL_SERVER_ERROR",
      message: "Erro ao atualizar barbearia",
      statusCode: 500,
    })
  }
}
