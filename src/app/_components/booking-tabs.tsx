"use client"

import { useState } from "react"
import { CalendarCheck, CircleCheckBig } from "lucide-react"
import { FaRegCalendarXmark } from "react-icons/fa6"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { useBookings } from "../bookings/_hooks/use-bookings"
import { BookingList } from "./booking-list"
import { type BookingStatus } from "@/src/repositories/booking.repository"
import { twMerge } from "tailwind-merge"

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

  const tabs = [
    {
      value: "confirmed",
      label: "Confirmados",
      icon: CalendarCheck,
      count: confirmedBookings.data.length,
    },
    {
      value: "completed",
      label: "Concluídos",
      icon: CircleCheckBig,
      count: completedBookings.data.length,
    },
    {
      value: "cancelled",
      label: "Cancelados",
      icon: FaRegCalendarXmark,
      count: cancelledBookings.data.length,
    },
  ]

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="border-border bg-card grid h-auto w-full grid-cols-3 gap-1 rounded-xl border p-1">
        {tabs.map(({ value, label, icon: Icon, count }) => {
          const isActive = activeTab === value
          return (
            <TabsTrigger
              key={value}
              value={value}
              className={twMerge(
                "flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-all",
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none",
                "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground",
              )}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
              {count > 0 && (
                <span
                  className={twMerge(
                    "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  {count}
                </span>
              )}
            </TabsTrigger>
          )
        })}
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
