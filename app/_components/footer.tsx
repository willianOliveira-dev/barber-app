import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card flex items-center justify-center border-t p-4">
      <div className="flex flex-col items-center justify-center gap-1.5 text-sm text-gray-400">
        <p>&copy; 2026 Copyrigth RazerBarber</p>
        <span className="hidden">|</span>
        <p className="flex items-center gap-1">
          Feito com <Heart className="fill-red-400 text-red-400" /> por
          <a
            className="hover:text-primary font-semibold transition-colors duration-300"
            target="_blank"
            href="https://github.com/willianOliveira-dev"
          >
            Willian
          </a>
        </p>
      </div>
    </footer>
  )
}
