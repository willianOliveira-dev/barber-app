"use client"
import { toast } from "sonner"
import { Button } from "./ui/button"

interface CopyProps {
  message: string
}

export function Copy({ message }: CopyProps) {
  const handleCopy = (message: string): void => {
    toast.success("Copiado com sucesso!")
    window.navigator.clipboard.writeText(message)
  }
  return (
    <Button variant={"secondary"} onClick={() => handleCopy(message)}>
      Copiar
    </Button>
  )
}
