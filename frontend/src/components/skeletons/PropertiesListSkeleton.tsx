import { Skeleton } from "@/components/ui/skeleton"
import HotelCardSkeleton from "./HotelCardSkeleton"

interface PropertiesListSkeletonProps {
  count?: number
}

export default function PropertiesListSkeleton({ count = 6 }: PropertiesListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <HotelCardSkeleton key={index} />
      ))}
    </div>
  )
}

