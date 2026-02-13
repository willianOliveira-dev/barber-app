import { InferSelectModel } from "drizzle-orm"
import { barbershop } from "../schemas"

export type Barbershop = InferSelectModel<typeof barbershop>
