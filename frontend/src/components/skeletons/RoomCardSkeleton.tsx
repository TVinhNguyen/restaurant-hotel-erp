import { Skeleton } from "@/components/ui/skeleton"
import { borderRadius } from "@/lib/designTokens"

export default function RoomCardSkeleton() {
  return (
    <div className="p-6 border rounded-xl">
      <div className="flex gap-6">
        <Skeleton className="w-48 h-32 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <div className="text-right">
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

