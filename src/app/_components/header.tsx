import { categoryRepo } from "@/src/repositories/category.repository"
import { HeaderClient } from "./header-client"

export async function Header() {
  const categories = await categoryRepo.findAll()
  return <HeaderClient categories={categories} />
}
