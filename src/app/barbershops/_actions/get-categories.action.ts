"use server"

import { categoryRepo } from "@/src/repositories/category.repository"
import { ActionResponse } from "../../_common/http/response/action.response"

export async function getCategories() {
  try {
    const categories = await categoryRepo.findAll()

    return ActionResponse.success({
      message: "Categorias buscadas com sucesso",
      statusCode: 200,
      data: categories,
    })
  } catch (error) {
    console.error("[getCategories] Error: ", error)
    return ActionResponse.fail({
      error: "INTERNAL_ERROR",
      message: "Erro ao buscar categorias",
      statusCode: 500,
    })
  }
}
