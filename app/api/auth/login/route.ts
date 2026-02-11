import { NextRequest } from "next/server"
import { ApiResponse } from "../../_common/http/api-response"
import {
  HttpErrorCode,
  HttpStatusCode,
} from "../../_common/http/enums/http-status.enum"
import { loginSchema } from "./_zod/login.schema"
import { userRepo } from "@/src/repositories/user.repository"
import { bcryptUtil } from "@/app/_utils/bcrypt.util"
import { revalidatePath } from "next/cache"

export async function POST(req: NextRequest) {
  console.log("POST /api/auth/login")
  const body = await req.json()

  const loginParsed = await loginSchema.safeParseAsync(body)

  if (!loginParsed.success) {
    return ApiResponse.fail(
      "Erro de autenticação",
      loginParsed.error.issues.map((issue) => issue.message).join(", "),
      HttpErrorCode.BadRequest,
      "api/auth/login",
      "POST",
    )
  }

  const { email, password } = loginParsed.data

  if (!email || !password) {
    return ApiResponse.fail(
      "Erro de autenticação",
      "E-mail e senha são obrigatórios",
      HttpErrorCode.BadRequest,
      "api/auth/login",
      "POST",
    )
  }

  const user = await userRepo.findByEmail(email)

  if (!user) {
    return ApiResponse.fail(
      "Erro de autenticação",
      "Usuário não encontrado",
      HttpErrorCode.NotFound,
      "api/auth/login",
      "POST",
    )
  }

  const passwordIsValid = await bcryptUtil.compareAsync(password, user.password)

  if (!passwordIsValid) {
    return ApiResponse.fail(
      "Erro de autenticação",
      "Senha inválida",
      HttpErrorCode.Unauthorized,
      "api/auth/login",
      "POST",
    )
  }

  revalidatePath("/login")

  const { password: _password, ...userWithoutPassword } = user

  return ApiResponse.success(
    userWithoutPassword,
    "Autenticação realizada com sucesso",
    HttpStatusCode.OK,
    "api/auth/login",
    "POST",
  )
}
