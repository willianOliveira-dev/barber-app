import { priceFormatter } from "@/src/app/_utils/price-formatter.util"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const barbershopServiceFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres" })
    .max(150, { message: "O nome deve ter no máximo 150 caracteres" })
    .nonempty({ message: "O nome é obrigatório" }),
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
  categoryId: z.string().nonempty({ message: "A categoria é obrigatória" }),
  duration: z
    .object({
      hour: z.string().optional(),
      minute: z.string().optional(),
    })
    .superRefine(({ hour, minute }, ctx) => {
      if (!hour && !minute) {
        ctx.addIssue({
          code: "custom",
          message: "Hora ou min não podem ser vazios juntos",
          path: ["hour"],
        })
      }
    }),
  price: z
    .string()
    .nonempty({ message: "O preço é obrigatório" })
    .refine(priceFormatter.validatePrice, {
      message: "O preço deve ser maior que 0",
    }),
  isActive: z.boolean().optional(),
})

export type NewBarbershopServiceFormData = z.infer<
  typeof barbershopServiceFormSchema
>

export function useNewBarbershopServiceForm() {
  return useForm<NewBarbershopServiceFormData>({
    resolver: zodResolver(barbershopServiceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      image: undefined,
      categoryId: "",
      duration: {
        hour: "0",
        minute: "",
      },
      price: "",
      isActive: true,
    },
  })
}
