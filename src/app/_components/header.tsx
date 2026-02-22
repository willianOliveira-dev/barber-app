import { authOptions } from "../_lib/auth.lib"
import { getServerSession } from "next-auth"
import { categorySv } from "@/src/services/category.service"
import HeaderClient from "./header-client"

export async function Header() {
  const categories = await categorySv.getCategories()
  const session = await getServerSession(authOptions)
  const user = session ? session.user : undefined

  return <HeaderClient categories={categories} user={user} />
}
