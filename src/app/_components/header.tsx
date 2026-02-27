import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth.lib"
import HeaderClient from "./header-client"
import { getCategories } from "../barbershops/_actions/get-categories.action"

export async function Header() {
  const session = await getServerSession(authOptions)
  const user = session ? session.user : undefined
  const categoriesResponse = await getCategories()

  return (
    <HeaderClient
      user={user}
      categories={
        categoriesResponse.success && "data" in categoriesResponse
          ? categoriesResponse.data
          : []
      }
    />
  )
}
