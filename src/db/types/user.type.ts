import { InferSelectModel } from "drizzle-orm"
import { user } from "../schemas"

export type User = InferSelectModel<typeof user>
