"use client"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { Calendar } from "./ui/calendar"

export function BookingCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date)
  }

  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      selected={date}
      onSelect={handleDateSelect}
      locale={ptBR}
      animate={true}
      className="flex-1 capitalize"
    />
  )
}
