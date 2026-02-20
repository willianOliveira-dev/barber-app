import { categoryRepo } from "@/src/repositories/category.repository"
import { HeaderClient } from "./header-client"
import { authOptions } from "../_lib/auth.lib"
import { getServerSession } from "next-auth"

export async function Header() {
  const categories = await categoryRepo.findAll()
  const session = await getServerSession(authOptions)
  const user = session ? session.user : undefined

  return <HeaderClient categories={categories} user={user} />
}
