import { Skeleton } from "@/components/ui/skeleton"
import { colors, borderRadius } from "@/lib/designTokens"

export default function HotelCardSkeleton() {
  return (
    <div
      className="bg-white overflow-hidden"
      style={{
        borderRadius: borderRadius.card,
        boxShadow: "0 4px 24px rgba(30, 64, 175, 0.08)",
      }}
    >
      <Skeleton className="w-full h-64" />
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex items-center gap-3 mb-4 pb-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <Skeleton className="h-3 w-12 mb-1" />
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

