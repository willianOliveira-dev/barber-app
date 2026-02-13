import { InferSelectModel } from "drizzle-orm"
import { category } from "../schemas"

export type Category = InferSelectModel<typeof category>
