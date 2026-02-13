import { BookingSheetClient } from "./booking-sheet-client"
import { type BarbershopService } from "@/src/db/types"

interface BookingSheetProps {
  service: BarbershopService
  barbershopName: string
}

export async function BookingSheet({
  service,
  barbershopName,
}: BookingSheetProps) {
  return (
    <BookingSheetClient barbershopName={barbershopName} service={service} />
  )
}
