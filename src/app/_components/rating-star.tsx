import { RiStarSmileFill } from "react-icons/ri"
import { cn } from "../_lib/utils.lib"

export function RatingStar({
  rating,
  size = "md",
}: {
  rating: number
  size?: "sm" | "md" | "lg"
}) {
  const dim =
    size === "lg" ? "h-4 w-4" : size === "md" ? "h-3.5 w-3.5" : "h-3 w-3"
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <RiStarSmileFill
          key={i}
          className={cn(
            dim,
            i < rating ? "text-primary" : "text-muted-foreground",
          )}
        />
      ))}
    </div>
  )
}
