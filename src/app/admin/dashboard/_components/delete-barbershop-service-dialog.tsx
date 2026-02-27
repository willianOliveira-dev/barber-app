import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/app/_components/ui/alert-dialog"
import { FaRegCalendarTimes } from "react-icons/fa"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/src/app/_components/ui/field"
import { Textarea } from "@/src/app/_components/ui/textarea"

import { Button } from "@/src/app/_components/ui/button"

import { Trash2, Loader2 } from "lucide-react"
interface DeleteBarbershopServiceDialogProps {
  handleDelete: () => void
  deleting: boolean
}

export function DeleteBarbershopServiceDialog({
  handleDelete,
  deleting,
}: DeleteBarbershopServiceDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="border-border text-muted-foreground hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive h-9 w-9 flex-1 rounded-lg border transition-all sm:flex-none"
        >
          {deleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <FaRegCalendarTimes />
          </AlertDialogMedia>
          <AlertDialogTitle> Deletar serviço </AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esse serviço? Essa ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            Confirmar
          </AlertDialogAction>
          <AlertDialogCancel>Voltar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
