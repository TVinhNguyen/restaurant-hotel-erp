import { Skeleton } from "@/components/ui/skeleton"
import { colors, borderRadius } from "@/lib/designTokens"

export default function PropertyDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Image Gallery */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <Skeleton className="w-full h-[700px] rounded-xl" />
        </div>
        <div className="col-span-1 space-y-4">
          <Skeleton className="w-full h-32 rounded-xl" />
          <Skeleton className="w-full h-32 rounded-xl" />
          <Skeleton className="w-full h-32 rounded-xl" />
        </div>
      </div>

      {/* Property Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Tabs */}
          <div className="space-y-4">
            <div className="flex gap-4 border-b">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-32 w-full" />
          </div>

          {/* Rooms */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 border rounded-xl">
                <div className="flex gap-6">
                  <Skeleton className="w-48 h-32 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2">
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
            ))}
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="p-6 border rounded-xl sticky top-24">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-32 w-full mb-4 rounded-lg" />
            <div className="space-y-3 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

