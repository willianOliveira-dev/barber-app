import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { isValidCEP, isValidPhone } from "@brazilian-utils/brazilian-utils"

const barbershopHourDaySchema = z.object({
  isOpen: z.boolean(),
  openingTime: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Use o formato HH:MM",
    })
    .or(z.literal("")),
  closingTime: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Use o formato HH:MM",
    })
    .or(z.literal("")),
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
  image: z.string().optional(),
  description: z.string().optional(),
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

export function useNewBarbershopForm() {
  return useForm<NewBarbershopFormData>({
    resolver: zodResolver(barbershopFormSchema),
    defaultValues: {
      name: "",
      image: "",
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
        monday: { isOpen: false, openingTime: "00:00", closingTime: "00:00" },
        tuesday: { isOpen: false, openingTime: "00:00", closingTime: "00:00" },
        wednesday: {
          isOpen: false,
          openingTime: "00:00",
          closingTime: "00:00",
        },
        thursday: { isOpen: false, openingTime: "00:00", closingTime: "00:00" },
        friday: { isOpen: false, openingTime: "00:00", closingTime: "00:00" },
        saturday: { isOpen: false, openingTime: "00:00", closingTime: "00:00" },
        sunday: { isOpen: false, openingTime: "00:00", closingTime: "00:00" },
      },

      status: {
        isOpen: true,
        reason: "",
        closedUntil: undefined,
      },
    },
    mode: "onChange",
  })
}
