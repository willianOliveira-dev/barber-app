import { Card, CardContent } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

export function SkeletonBookingItem() {
  return (
    <Card className="min-w-full p-0">
      <CardContent className="flex justify-between p-0">
        <div className="flex flex-col gap-3 p-4 sm:gap-4 sm:p-6">
          <Skeleton className="h-5 w-16 rounded-2xl bg-gray-500 sm:h-6 sm:w-20" />
          <div className="space-y-3 sm:space-y-4">
            <Skeleton className="h-5 w-32 bg-gray-500 sm:h-6 sm:w-48" />
            <div className="flex items-center gap-3 sm:gap-4">
              <Skeleton className="size-10 rounded-full bg-gray-500 sm:size-15" />
              <Skeleton className="h-3.5 w-24 bg-gray-500 sm:h-4 sm:w-32" />
            </div>
          </div>
        </div>

        <div className="flex min-w-20 flex-col items-center justify-center border-l-2 border-gray-400/10 p-4 sm:min-w-25.5 sm:p-6">
          <Skeleton className="mb-1 h-3 w-12 bg-gray-500 sm:h-4 sm:w-16" />
          <Skeleton className="mb-1 h-6 w-6 bg-gray-500 sm:h-8 sm:w-8" />
          <Skeleton className="h-3 w-10 bg-gray-500 sm:h-4 sm:w-12" />
        </div>
      </CardContent>
    </Card>
  )
}
