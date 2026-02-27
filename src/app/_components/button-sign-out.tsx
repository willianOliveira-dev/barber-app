import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"

export function ButtonSignOut() {
  const handleSignOutClick = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <Button
      onClick={handleSignOutClick}
      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full items-center justify-start gap-3 rounded-lg bg-transparent text-sm font-medium transition-all"
    >
      <LogOut className="h-4 w-4" />
      Sair da conta
    </Button>
  )
}
