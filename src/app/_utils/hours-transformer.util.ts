import { NewBarbershopFormData } from "../admin/dashboard/barbershops/_hooks/use-new-barbershop-form.hook"

type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"

type BarbershopHourPayload = {
  dayOfWeek: DayOfWeek
  openingTime: string
  closingTime: string
  isOpen: boolean
}

export class HoursTransformer {
  transformHoursForSubmit(
    hours: NewBarbershopFormData["hours"],
  ): BarbershopHourPayload[] {
    if (!hours || typeof hours !== "object" || Array.isArray(hours)) return []

    return Object.entries(hours).map(([dayOfWeek, dayData]) => ({
      dayOfWeek: dayOfWeek as DayOfWeek,
      openingTime: dayData?.openingTime || "00:00",
      closingTime: dayData?.closingTime || "00:00",
      isOpen: dayData?.isOpen ?? false,
    }))
  }

  transformHoursForEdit(
    hoursArray: BarbershopHourPayload[] | undefined,
  ): NonNullable<NewBarbershopFormData["hours"]> {
    const defaultHours: NonNullable<NewBarbershopFormData["hours"]> = {
      monday: { isOpen: false, openingTime: "", closingTime: "" },
      tuesday: { isOpen: false, openingTime: "", closingTime: "" },
      wednesday: { isOpen: false, openingTime: "", closingTime: "" },
      thursday: { isOpen: false, openingTime: "", closingTime: "" },
      friday: { isOpen: false, openingTime: "", closingTime: "" },
      saturday: { isOpen: false, openingTime: "", closingTime: "" },
      sunday: { isOpen: false, openingTime: "", closingTime: "" },
    }

    if (!hoursArray?.length) return defaultHours

    const hoursObj: Partial<NonNullable<NewBarbershopFormData["hours"]>> = {}

    hoursArray.forEach((hour) => {
      if (hour?.dayOfWeek) {
        hoursObj[hour.dayOfWeek] = {
          isOpen: hour.isOpen,
          openingTime: hour.openingTime || "",
          closingTime: hour.closingTime || "",
        }
      }
    })

    return { ...defaultHours, ...hoursObj }
  }
}

export const hoursTransformer = new HoursTransformer()
