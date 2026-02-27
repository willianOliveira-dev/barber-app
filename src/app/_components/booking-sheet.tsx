"use client"

import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import {
  Sheet, SheetContent, SheetFooter,
  SheetHeader, SheetTitle, SheetTrigger,
} from "./ui/sheet"
import { cn } from "../_lib/utils.lib"
import { addDays, format } from "date-fns"
import { getAvailableSlotsAction, type SlotOutput } from "../barbershops/_actions/get-available-slots.action"
import { toast } from "sonner"
import { type BarbershopService } from "@/src/db/types"
import { SkeletonSlots } from "./skeleton-slots"
import { BookingSummary } from "./booking-summary"

interface BookingSheetClientProps {
  service: BarbershopService
  barbershopName: string
  barbershopIsOpen: boolean
}

export function BookingSheet({ service, barbershopName, barbershopIsOpen }: BookingSheetClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [slots, setSlots] = useState<SlotOutput[]>([])
  const [selectedSlot, setSelectedSlot] = useState<SlotOutput | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)

  const fetchSlots = async (date: Date) => {
    setIsLoadingSlots(true)
    setSelectedSlot(undefined)

    const response = await getAvailableSlotsAction({
      barbershopId: service.barbershopId,
      serviceId: service.id,
      date,
    })

    if (!response.success || !("data" in response)) {
      toast.error(response.message ?? "Erro ao buscar horários disponíveis")
      setSlots([])
      setIsLoadingSlots(false)
      return
    }

    setSlots(response.data.slots)
    setIsLoadingSlots(false)
  }

  useEffect(() => {
    if (isOpen) fetchSlots(selectedDate)
  }, [isOpen])

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    setSelectedDate(date)
    if (isOpen) fetchSlots(date)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button disabled={!barbershopIsOpen} variant="secondary" size="sm">
          Fazer Reserva
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll [&::-webkit-scrollbar]:hidden">
        <SheetHeader>
          <SheetTitle>Fazer Reserva</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 p-4">
          <div className="flex items-center justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={[{ before: new Date() }, { after: addDays(new Date(), 30) }]}
              locale={ptBR}
              className="flex-1 capitalize"
            />
          </div>

          <div className="bg-border h-px" />

          {isLoadingSlots ? (
            <SkeletonSlots />
          ) : (
            <div className="flex items-center justify-center p-5">
              <div className="relative flex flex-row items-center gap-2 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
                {slots.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Nenhum horário disponível para esta data
                  </p>
                ) : (
                  slots.map((slot, i) => {
                    const isActive = selectedSlot?.startTime.getTime() === slot.startTime.getTime()

                    return (
                      <Button
                        key={i}
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedSlot(slot)}
                        variant={isActive ? "default" : "secondary"}
                        className={cn(
                          "flex h-auto flex-col rounded-full py-2",
                          !slot.isAvailable && "cursor-not-allowed opacity-50",
                        )}
                      >
                        <span className="text-sm font-bold">
                          {format(slot.startTime, "HH:mm", { locale: ptBR })}
                        </span>
                      </Button>
                    )
                  })
                )}
              </div>
            </div>
          )}

          {selectedSlot && <div className="bg-border h-px" />}

          {selectedSlot && (
            <div className="flex items-center justify-center">
              <BookingSummary
                barbershopName={barbershopName}
                serviceName={service.name}
                date={selectedDate}
                scheduledTime={selectedSlot.startTime}
                servicePrice={service.priceInCents}
              />
            </div>
          )}
        </div>

        {selectedSlot && (
          <SheetFooter>
            <Button className="w-full">Confirmar</Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}