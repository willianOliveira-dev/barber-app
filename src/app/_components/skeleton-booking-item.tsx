import { Card, CardContent } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

export function SkeletonBookingItem() {
  return (
    <Card className="min-w-full p-0">
      <CardContent className="flex justify-between p-0">
        <div className="flex flex-col gap-4 p-6">
          <Skeleton className="h-6 w-20 rounded-2xl bg-gray-500" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-48 bg-gray-500" />
            <div className="flex items-center gap-4">
              <Skeleton className="size-15 rounded-full bg-gray-500" />
              <Skeleton className="h-4 w-32 bg-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex min-w-25.5 flex-col items-center justify-center border-l-2 border-gray-400/10 p-6">
          <Skeleton className="mb-1 h-4 w-16 bg-gray-500" />
          <Skeleton className="mb-1 h-8 w-8 bg-gray-500" />
          <Skeleton className="h-4 w-12 bg-gray-500" />
        </div>
      </CardContent>
    </Card>
  )
}
