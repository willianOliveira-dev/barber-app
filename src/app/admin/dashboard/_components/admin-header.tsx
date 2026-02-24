import { getServerSession } from "next-auth"
import { authOptions } from "../../../_lib/auth.lib"
import { AdminHeaderClient } from "./admin-header-client"

export async function AdminHeader() {
  const session = await getServerSession(authOptions)
  return <AdminHeaderClient user={session?.user} />
}
