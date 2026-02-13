import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface AuthCardProps {
  label: string
  linkMessage: string
  linkHref: string
}

export function AuthActionCard({
  label,
  linkMessage,
  linkHref,
}: AuthCardProps) {
  return (
    <Link href={linkHref}>
      <Card className="hover:bg-secondary/85 block transition-all duration-300">
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span>
                <Image
                  alt="Máquina de barbear"
                  src="/shaver-barber.svg"
                  width={24}
                  height={24}
                />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-gray-400">{label}</p>
                <p className="text-primary hover:text-primary/85 font-semibold">
                  {" "}
                  {linkMessage}
                </p>
              </div>
            </div>
            <span>
              <ArrowRight className="text-gray-400" size={24} />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
