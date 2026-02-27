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
import { TbBuildingOff } from "react-icons/tb"
import { Button } from "@/src/app/_components/ui/button"

import { Trash2, Loader2, AlertCircle } from "lucide-react"
interface DeleteBarbershopDialogProps {
  handleDelete: () => void
  deleting: boolean
}

export function DeleteBarbershopDialog({
  handleDelete,
  deleting,
}: DeleteBarbershopDialogProps) {
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
            <TbBuildingOff />
          </AlertDialogMedia>
          <AlertDialogTitle> Deletar barbearia </AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir essa barbearia? Essa ação não pode
            ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            Confirmar
          </AlertDialogAction>
          <AlertDialogCancel>Voltar</AlertDialogCancel>
        </AlertDialogFooter>
        <p className="text-muted-foreground mt-2 flex items-center gap-2 text-[9px] font-semibold tracking-[0.18em] opacity-25">
          <span>
            <AlertCircle className="text-amber-400" size={16} />
          </span>
          Antes de deletar, certifaca-se de não ter nenhum agendamento em
          andamento vinculado a esta barbearia.
        </p>
      </AlertDialogContent>
    </AlertDialog>
  )
}
