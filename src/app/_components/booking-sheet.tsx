import { BookingCalendar } from "./booking-calendar"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"

export function BookingSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="sm">
          Fazer Reserva
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Fazer Reserva</SheetTitle>
        </SheetHeader>
        <div className="flex justify-center p-5">
          <BookingCalendar />
        </div>
      </SheetContent>
    </Sheet>
  )
}
