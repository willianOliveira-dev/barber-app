import { z } from "zod"

export const signInSchema = z.object({
  email: z
    .email({ message: "E-mail inválido " })
    .min(1, { message: "E-mail é obrigatório" }),
  password: z
    .string()
    .min(1, { message: "Senha é obrigatória" })
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
    .regex(/[A-Z]/, {
      message: "A senha deve conter pelo menos uma letra maiúscula",
    })
    .regex(/[\W_]/, {
      message: "A senha deve conter pelo menos um caractere especial",
    }),
})
