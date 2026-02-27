"use server"

import { authOptions } from "./_lib/auth.lib"
import { getServerSession } from "next-auth"
import HomeClient from "./_components/home-client"
import { getCategories } from "./barbershops/_actions/get-categories.action"
import { getRecommendedBarbershops } from "./barbershops/_actions/get-recommended-barbershops.action"
import { getPopularBarbershops } from "./barbershops/_actions/get-popular-barbershops.action"
import { getLatestUserBookings } from "./barbershops/_actions/get-latest-user-bookings.action"

export default async function Home() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const [catRes, recommendedRes, popularRes] = await Promise.all([
    getCategories(),
    getRecommendedBarbershops({ limit: 8 }),
    getPopularBarbershops({ limit: 4 }),
  ])

  const latestBookings = user?.id
    ? await getLatestUserBookings({ userId: user.id })
    : null

  return (
    <HomeClient
      user={user}
      categories={catRes.success && "data" in catRes ? catRes.data : []}
      recommendedBarbershops={
        recommendedRes.success && "data" in recommendedRes
          ? recommendedRes.data
          : []
      }
      popularBarbershops={
        popularRes.success && "data" in popularRes ? popularRes.data : []
      }
      latestBookings={
        latestBookings?.success && "data" in latestBookings
          ? latestBookings.data
          : []
      }
    />
  )
}
