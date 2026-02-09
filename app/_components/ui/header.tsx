import Image from "next/image"
import { Card, CardContent } from "./card"
import { Button } from "./button"
import { MenuIcon } from "lucide-react"

export function Header() {
  return (
    <header>
      <Card className="rounded-t-none border-0">
        <CardContent className="bg-card flex flex-row items-center justify-between">
          <Image alt="Razor Barber" src="/logo.png" width={160} height={22} />
          <Button variant="outline" size="icon">
            <MenuIcon />
          </Button>
        </CardContent>
      </Card>
    </header>
  )
}
