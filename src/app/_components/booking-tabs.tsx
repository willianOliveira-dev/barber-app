"use client"
import { CalendarCheck, CircleCheckBig } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { FaRegCalendarXmark } from "react-icons/fa6"
import { useState } from "react"
import { useBookings } from "../bookings/_hooks/use-bookings"
import { BookingList } from "./booking-list"
import { type BookingStatus } from "@/src/repositories/booking.repository"

export function BookignsTabs() {
  const [activeTab, setActiveTab] = useState<BookingStatus>("confirmed")

  const confirmedBookings = useBookings({
    status: "confirmed",
    autoLoad: activeTab === "confirmed",
  })
  const completedBookings = useBookings({
    status: "completed",
    autoLoad: false,
  })
  const cancelledBookings = useBookings({
    status: "cancelled",
    autoLoad: false,
  })

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as typeof activeTab)
    if (tab === "completed" && completedBookings.data.length === 0) {
      completedBookings.refresh()
    }
    if (tab === "cancelled" && cancelledBookings.data.length === 0) {
      cancelledBookings.refresh()
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList variant="line" className="w-full">
        <TabsTrigger value="confirmed">
          <span>
            <CalendarCheck size={16} />
          </span>
          Confirmados
        </TabsTrigger>
        <TabsTrigger value="completed">
          <span>
            <CircleCheckBig size={16} />
          </span>
          Concluídos
        </TabsTrigger>
        <TabsTrigger value="cancelled">
          <span>
            <FaRegCalendarXmark size={16} />
          </span>
          Cancelados
        </TabsTrigger>
      </TabsList>

      <TabsContent value="confirmed" className="mt-6">
        <BookingList bookings={confirmedBookings} />
      </TabsContent>

      <TabsContent value="completed" className="mt-6">
        <BookingList bookings={completedBookings} />
      </TabsContent>

      <TabsContent value="cancelled" className="mt-6">
        <BookingList bookings={cancelledBookings} />
      </TabsContent>
    </Tabs>
  )
}
