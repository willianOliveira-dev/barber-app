import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { isValidCEP, isValidPhone } from "@brazilian-utils/brazilian-utils"

const barbershopHourDaySchema = z.object({
  isOpen: z.boolean(),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
})

const barbershopStatusSchema = z.object({
  isOpen: z.boolean(),
  reason: z.string().optional(),
  closedUntil: z.date().optional(),
})

const barbershopHoursSchema = z.object({
  monday: barbershopHourDaySchema,
  tuesday: barbershopHourDaySchema,
  wednesday: barbershopHourDaySchema,
  thursday: barbershopHourDaySchema,
  friday: barbershopHourDaySchema,
  saturday: barbershopHourDaySchema,
  sunday: barbershopHourDaySchema,
})

const barbershopFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres" })
    .max(150, { message: "O nome deve ter no máximo 150 caracteres" })
    .nonempty({ message: "O nome é obrigatório" }),
  image: z
    .union([
      z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Máximo 5MB",
      }),
      z
        .instanceof(File)
        .refine(
          (file) =>
            ["image/jpeg", "image/png", "image/webp"].includes(file.type),
          {
            message: "Use JPG, PNG ou WebP",
          },
        ),
      z.string(),
      z.undefined(),
      z.null(),
    ])
    .optional(),
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
    .length(2, { message: "O estado deve ter 2 caracteres" })
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
  isActive: z.boolean(),
  hours: barbershopHoursSchema.optional(),
  status: barbershopStatusSchema.optional(),
})

export type NewBarbershopFormData = z.infer<typeof barbershopFormSchema>

export function useNewBarbershopForm(
  defaultValues?: Partial<NewBarbershopFormData>,
) {
  return useForm<NewBarbershopFormData>({
    resolver: zodResolver(barbershopFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      image: undefined,
      description: "",
      address: "",
      city: "",
      isActive: true,
      state: "",
      zipCode: "",
      streetNumber: "",
      neighborhood: "",
      complement: "",
      phone: "",
      email: "",
      website: "",
      hours: {
        monday: { isOpen: false, openingTime: "", closingTime: "" },
        tuesday: { isOpen: false, openingTime: "", closingTime: "" },
        wednesday: { isOpen: false, openingTime: "", closingTime: "" },
        thursday: { isOpen: false, openingTime: "", closingTime: "" },
        friday: { isOpen: false, openingTime: "", closingTime: "" },
        saturday: { isOpen: false, openingTime: "", closingTime: "" },
        sunday: { isOpen: false, openingTime: "", closingTime: "" },
      },
      status: {
        isOpen: true,
        reason: "",
        closedUntil: undefined,
      },
    },
  })
}
