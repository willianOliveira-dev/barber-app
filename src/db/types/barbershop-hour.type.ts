import { InferSelectModel } from "drizzle-orm"
import { barbershopHour } from "../schemas"

export type BarbershopHour = InferSelectModel<typeof barbershopHour>
