"use client"

import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { cn } from "../_lib/utils.lib"
import { format } from "date-fns"
import { getAvailableSlotsAction } from "../barbershops/_actions/get-available-slots.action"
import { Card, CardContent } from "./ui/card"
import { priceFormat } from "../_utils/price-format.util"
import { toast } from "sonner"
import { type BarbershopService } from "@/src/db/types"
import { SkeletonSlots } from "./skeleton-slots"

interface BookingSheetClientProps {
  service: BarbershopService
  barbershopName: string
}

type Slots = {
  id?: string
  startTime: Date
  endTime: Date
  isAvailable: boolean
}

export function BookingSheetClient({
  service,
  barbershopName,
}: BookingSheetClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [slots, setSlots] = useState<Slots[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Date | undefined>(undefined)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false)

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedSlot(undefined)
  }

  useEffect(() => {
    const fetchSlots = async () => {
      if (!isOpen) return
      setIsLoadingSlots(true)
      try {
        const availableSlots = await getAvailableSlotsAction({
          barbershopId: service.barbershopId,
          serviceId: service.id,
          date: selectedDate ?? new Date(),
        })
        setSlots(availableSlots.slots)
      } catch (error) {
        console.log(error)
        toast.error("Erro ao buscar horários disponíveis")
      } finally {
        setIsLoadingSlots(false)
      }
    }
    fetchSlots()
  }, [isOpen, service.barbershopId, service.id])

  useEffect(() => {
    const fetchSlots = async () => {
      if (!isOpen || !selectedDate) return
      setIsLoadingSlots(true)
      setSelectedSlot(undefined)

      try {
        const availableSlots = await getAvailableSlotsAction({
          barbershopId: service.barbershopId,
          serviceId: service.id,
          date: selectedDate,
        })
        setSlots(availableSlots.slots)
      } catch (error) {
        console.error("Erro ao buscar slots:", error)
      } finally {
        setIsLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [isOpen, selectedDate, service.barbershopId, service.id])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="sm">
          Fazer Reserva
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Fazer Reserva</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              locale={ptBR}
              className="flex-1 capitalize"
            />
          </div>

          <div className="bg-border h-px" />

          {isLoadingSlots ? (
            <SkeletonSlots />
          ) : (
            selectedDate && (
              <div className="flex items-center justify-center p-5">
                <div className="flex flex-row items-center gap-2 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
                  {slots.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Nenhum horário disponível para esta data
                    </p>
                  ) : (
                    slots.map((slot, i) => {
                      const isActive = slot.startTime === selectedSlot
                      console.log(isActive)
                      return (
                        <Button
                          disabled={!slot.isAvailable}
                          key={i}
                          onClick={() => setSelectedSlot(slot.startTime)}
                          variant={isActive ? "default" : "secondary"}
                          className={cn(
                            "flex h-auto flex-col rounded-full py-2",
                            !slot.isAvailable &&
                              "cursor-not-allowed bg-red-400/50",
                          )}
                        >
                          <span className="text-sm font-bold">
                            {format(slot.startTime, "HH:mm", {
                              locale: ptBR,
                            })}
                          </span>
                        </Button>
                      )
                    })
                  )}
                </div>
              </div>
            )
          )}

          {selectedDate && <div className="bg-border h-px" />}

          {selectedSlot && selectedDate && (
            <div className="flex items-center justify-center">
              <Card className="w-full">
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="font-semibold">
                        {priceFormat.formatToPrice(service.priceInCents)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-gray-400">Data</p>
                      <p className="text-gray-400">
                        {format(selectedDate, "dd 'de' MMMM", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-gray-400">Horário</p>
                      <p className="text-gray-400">
                        {format(selectedSlot, "HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-gray-400">Barbearia</p>
                      <p className="line-clamp-1 text-gray-400">
                        {barbershopName}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {selectedSlot && selectedDate && (
          <SheetFooter>
            <Button>Confirmar</Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
