import { Card, CardContent } from "./ui/card"
import { Menu } from "./menu"
import { categoryRepo } from "@/src/repositories/category.repository"
import Image from "next/image"
import Link from "next/link"

export async function Header() {
  const categories = await categoryRepo.findAll()

  return (
    <header>
      <Card className="rounded-t-none border-0">
        <CardContent className="bg-card flex flex-row items-center justify-between">
          <Link href="/">
            <Image
              alt="Razor Barber"
              src="/logo.webp"
              width={180}
              height={22}
            />
          </Link>
          <Menu categories={categories} />
        </CardContent>
      </Card>
    </header>
  )
}
