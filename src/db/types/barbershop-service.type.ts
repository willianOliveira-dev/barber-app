import { InferSelectModel } from "drizzle-orm"
import { barbershopService } from "../schemas"

export type BarbershopService = InferSelectModel<typeof barbershopService>
