import { InferSelectModel } from "drizzle-orm"
import { availableTimeSlot } from "../schemas"

export type AvailableTimeSlot = InferSelectModel<typeof availableTimeSlot>
