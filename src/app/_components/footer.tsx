import { Heart } from "lucide-react"
import Link from "next/link"
import { FaScissors } from "react-icons/fa6"

export function Footer() {
  return (
    <footer className="border-border bg-card border-t">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-4 px-5 py-6 sm:flex-row lg:px-8 xl:px-12">
        <div className="text-muted-foreground flex items-center gap-2">
          <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-md">
            <FaScissors className="text-primary h-3 w-3" />
          </div>
          <span className="text-xs font-medium">&copy; 2026 RazorBarber</span>
        </div>

        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          Feito com <Heart className="h-3.5 w-3.5 fill-red-400 text-red-400" />{" "}
          por{" "}
          <Link
            href="https://github.com/willianOliveira-dev"
            target="_blank"
            className="text-foreground hover:text-primary font-semibold transition-colors"
          >
            Willian
          </Link>
        </p>
      </div>
    </footer>
  )
}
