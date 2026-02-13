import { z } from "zod"

export const signInSchema = z.object({
  email: z
    .email({ message: "E-mail inválido " })
    .min(1, { message: "E-mail é obrigatório" }),
  password: z.string().min(1, { message: "Senha é obrigatória" }),
})
