"use client"

import { Button } from "./ui/button"

interface CopyProps {
  message: string
}

export function Copy({ message }: CopyProps) {
  const handleCopy = (message: string): void => {
    window.navigator.clipboard.writeText(message)
  }
  return (
    <Button variant={"secondary"} onClick={() => handleCopy(message)}>
      Copiar
    </Button>
  )
}
