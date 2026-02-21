import { categoryRepo } from "@/src/repositories/category.repository"
import { authOptions } from "../_lib/auth.lib"
import { getServerSession } from "next-auth"
import HeaderClient from "./header-client"


export async function Header() {
  const categories = await categoryRepo.findAll()
  const session = await getServerSession(authOptions)
  const user = session ? session.user : undefined

  return <HeaderClient categories={categories} user={user} />
}
