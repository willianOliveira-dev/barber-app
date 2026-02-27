"use server"

import { z } from "zod"
import { ActionResponse } from "@/src/app/_common/http/response/action.response"
import { authOptions } from "@/src/app/_lib/auth.lib"
import { barbershopRepo } from "@/src/repositories/barbershop.repository"
import { getServerSession } from "next-auth"
import { isValidCEP, isValidPhone } from "@brazilian-utils/brazilian-utils"
import { getCoordsFromAddress } from "@/src/app/_utils/get-coords-from-address.util"
import { revalidatePath } from "next/cache"
import { CreateBarbershopData as CreateBarbershop } from "@/src/db/types"
import { validateOpeningBeforeClosing } from "@/src/app/_utils/validate-opening-before-closing.util"
import { uploadToCloudinary } from "@/src/app/_lib/cloudinary.lib"
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

const createBarbershopSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "O nome deve ter no mínimo 3 caracteres" })
      .max(150, { message: "O nome deve ter no máximo 150 caracteres" })
      .nonempty({ message: "O nome é obrigatório" }),
    slug: z.string().nonempty({ message: "O slug é obrigatório" }),
    description: z
      .string()
      .min(100, {
        message: "A descrição deve ter no mínimo 100 caracteres",
      })
      .max(4000, {
        message: "A descrição deve ter no máximo 4000 caracteres",
      })
      .optional()
      .or(z.literal("")),
    address: z
      .string()
      .min(3, { message: "O endereço deve ter no mínimo 3 caracteres" })
      .max(255, { message: "O endereço deve ter no máximo 255 caracteres" })
      .nonempty({ message: "O endereço é obrigatório" }),
    city: z
      .string()
      .min(3, { message: "A cidade deve ter no mínimo 3 caracteres" })
      .max(100, { message: "A cidade deve ter no máximo 100 caracteres" })
      .nonempty({ message: "A cidade é obrigatória" }),
    state: z
      .string()
      .length(2, { message: "O estado deve ter no mínimo 2 caracteres" })
      .toUpperCase()
      .nonempty({ message: "O estado é obrigatório" }),
    zipCode: z
      .string()
      .refine(isValidCEP, {
        message: "CEP inválido",
      })
      .nonempty({ message: "O CEP é obrigatório" }),
    streetNumber: z
      .string()
      .min(1, { message: "O número deve ter no mínimo 1 caractere" })
      .max(20, { message: "O número deve ter no máximo 20 caracteres" })
      .optional(),
    neighborhood: z.string().optional(),
    complement: z.string().optional(),
    phone: z
      .string()
      .refine(isValidPhone, {
        message: "Número de telefone inválido",
      })
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
    isActive: z.boolean().default(true).optional(),
    hours: z
      .array(barbershopHourSchema)
      .optional()
      .default([
        {
          dayOfWeek: "monday",
          openingTime: "",
          closingTime: "",
          isOpen: false,
        },
        {
          dayOfWeek: "tuesday",
          openingTime: "",
          closingTime: "",
          isOpen: false,
        },
        {
          dayOfWeek: "wednesday",
          openingTime: "",
          closingTime: "",
          isOpen: false,
        },
        {
          dayOfWeek: "thursday",
          openingTime: "",
          closingTime: "",
          isOpen: false,
        },
        {
          dayOfWeek: "friday",
          openingTime: "",
          closingTime: "",
          isOpen: false,
        },
        {
          dayOfWeek: "saturday",
          openingTime: "",
          closingTime: "",
          isOpen: false,
        },
        {
          dayOfWeek: "sunday",
          openingTime: "",
          closingTime: "",
          isOpen: false,
        },
      ]),
    status: barbershopStatusSchema.optional().default({
      isOpen: true,
      reason: "",
      closedUntil: undefined,
    }),
  })

  .transform((data) => {
    const baseSlug = slugify(data.name, { lower: true, strict: true })
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`
    return { ...data, slug: uniqueSlug }
  })

export type CreateBarbershopData = z.infer<typeof createBarbershopSchema>

interface CreateBarbershopActionParams {
  data: CreateBarbershopData
  imageFormData: FormData
}

export async function createBarbershopAction({
  data,
  imageFormData,
}: CreateBarbershopActionParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      console.error("[createBarbershopAction] Usuário não autenticado")
      return ActionResponse.fail({
        error: "USER_UNAUTHENTICATED",
        message: "Usuário não autenticado",
        statusCode: 401,
      })
    }

    if (session.user.role !== "barber") {
      console.error("[createBarbershopAction] Usuário não é barbeiro")
      return ActionResponse.fail({
        error: "USER_FORBIDDEN",
        message: "Você não tem permissão para criar uma barbearia",
        statusCode: 403,
      })
    }

    const safeParse = createBarbershopSchema.safeParse(data)

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
          publicId: barbershopData.slug,
        })
        imageUrl = secure_url
      } catch (error) {
        console.error(
          "[createBarbershopAction] Erro ao fazer upload da imagem",
          error,
        )
        return ActionResponse.fail({
          error: "INTERNAL_ERROR",
          message: "Erro ao fazer upload da imagem",
          statusCode: 500,
        })
      }
    }

    const coords = await getCoordsFromAddress({
      address: barbershopData.address,
      streetNumber: barbershopData.streetNumber,
      city: barbershopData.city,
      state: barbershopData.state,
      zipCode: barbershopData.zipCode,
      neighborhood: barbershopData.neighborhood,
    })

    const barbershop: CreateBarbershop = {
      ...barbershopData,
      ownerId: session.user.id,
      latitude: coords.latitude ?? null,
      longitude: coords.longitude ?? null,
      ...(imageUrl !== null && { image: imageUrl }),
    }

    const createdBarbershop = await barbershopRepo.create(
      barbershop,
      hours,
      status,
    )

    revalidatePath("/")
    revalidatePath("/barbershops")
    revalidatePath("/admin/barbershops")

    return ActionResponse.success({
      message: "Barbearia criada com sucesso",
      statusCode: 201,
      data: {
        barbershopId: createdBarbershop.id,
        slug: createdBarbershop.slug,
      },
    })
  } catch (error) {
    console.error("[createBarbershopAction]", error)
    return ActionResponse.fail({
      error: "INTERNAL_SERVER_ERROR",
      message: "Erro ao criar barbearia",
      statusCode: 500,
    })
  }
}
