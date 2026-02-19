"use client"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { cn } from "../_lib/utils.lib"

interface CopyProps {
  message: string
}

export function Copy({ message }: CopyProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false)

  useEffect(() => {
    const id = setTimeout(() => {
      setIsCopied(false)
    }, 1500)

    return () => clearTimeout(id)
  }, [isCopied])

  const handleCopy = (message: string): void => {
    toast.success("Copiado com sucesso!")
    setIsCopied(true)
    window.navigator.clipboard.writeText(message)
  }
  return (
    <Button
      className="relative min-w-20 overflow-hidden transition-all duration-300"
      variant={"secondary"}
      onClick={() => handleCopy(message)}
    >
      <span
        className={cn(
          "flex items-center justify-center transition-all duration-300",
          isCopied ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100",
        )}
      >
        Copiar
      </span>

      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-300",
          isCopied ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        Copiado!
      </span>
    </Button>
  )
}
