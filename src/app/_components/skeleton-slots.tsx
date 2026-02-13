import { Skeleton } from "./ui/skeleton"

export function SkeletonSlots() {
  return (
    <div className="flex items-center justify-center p-5">
      <div className="flex flex-row items-center gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-18 shrink-0 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
