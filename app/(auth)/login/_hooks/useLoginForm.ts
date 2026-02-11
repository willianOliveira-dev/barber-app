import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const loginFormSchema = z.object({
  email: z
    .email({ message: "E-mail inválido" })
    .nonempty({ message: "E-mail é obrigatório" }),
  password: z
    .string({ message: "Senha é obrigatória" })
    .nonempty({ message: "Senha é obrigatória" }),
})

export type LoginFormData = z.infer<typeof loginFormSchema>

export function useLoginForm() {
  return useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
}
