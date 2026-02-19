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
} from "./ui/alert-dialog"
import { FaRegCalendarTimes } from "react-icons/fa"
import { Field, FieldDescription, FieldLabel } from "./ui/field"
import { Textarea } from "./ui/textarea"

import { Button } from "./ui/button"

export function CancelBookingDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Cancelar reserva
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <FaRegCalendarTimes />
          </AlertDialogMedia>
          <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja cancelar esse agendamento?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <Field>
            <FieldLabel htmlFor="textarea-message">
              Motivo do cancelamento
            </FieldLabel>
            <FieldDescription>Digite sua mensagem abaixo</FieldDescription>
            <Textarea
              id="textarea-message"
              placeholder="Ex: Compromisso pessoal, etc."
            />
          </Field>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction variant="destructive">Confirmar</AlertDialogAction>
          <AlertDialogCancel>Voltar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
