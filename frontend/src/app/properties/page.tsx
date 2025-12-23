"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, SlidersHorizontal, Building2, MapPin, Calendar, Users } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import HotelCard from "@/components/HotelCard"
import PropertiesListSkeleton from "@/components/skeletons/PropertiesListSkeleton"
import { propertiesService, type Property } from "@/lib/services/properties"
import { colors, shadows, borderRadius } from "@/lib/designTokens"
import type { SearchParams } from "@/components/SearchHero"

// Normalize text function for Vietnamese search
const normalizeText = (text: string = '') => {
  return text
    .toLowerCase()
    .normalize('NFD')                 // Tách dấu
    .replace(/[\u0300-\u036f]/g, '') // Xoá dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filteringCapacity, setFilteringCapacity] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [showFilters, setShowFilters] = useState(true)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null)
  const [roomTypesCache, setRoomTypesCache] = useState<Map<string, any[]>>(new Map())

  useEffect(() => {
    loadProperties()
    // Load search params from localStorage
    const storedParams = localStorage.getItem("search_params")
    if (storedParams) {
      try {
        const params = JSON.parse(storedParams)
        setSearchParams(params)
      } catch (err) {
        console.error("Failed to parse search params:", err)
      }
    }
  }, [page, selectedType])

  // Apply filters when properties or searchParams change
  useEffect(() => {
    const runFilters = async () => {
      await applyFilters()
    }
    runFilters()
  }, [properties, searchParams])

  const loadProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      const params: { page: number; limit: number; type?: string } = {
        page,
        limit: 100, // Load more to filter client-side
      }
      if (selectedType) {
        params.type = selectedType
      }
      const response = await propertiesService.getProperties(params)
      
      const enrichedProperties = await Promise.all(
        (response.data || []).map(async (property) => {
          try {
            // Check cache first
            let roomTypes = roomTypesCache.get(property.id)
            
            if (!roomTypes) {
              roomTypes = await propertiesService.getRoomTypes(property.id)
              // Cache it
              setRoomTypesCache(prev => new Map(prev).set(property.id, roomTypes || []))
            }
            
            // Calculate min price from room types
            const minPrice = roomTypes && roomTypes.length > 0
              ? Math.min(...roomTypes.map(rt => {
                  const price = typeof rt.basePrice === 'string' ? parseFloat(rt.basePrice) : rt.basePrice
                  return isNaN(price) ? 0 : price
                }).filter(p => p > 0))
              : undefined

            return {
              ...property,
              basePrice: minPrice ?? undefined,
            }
          } catch (err) {
            console.error(`Failed to enrich property ${property.name}:`, err)
            return property
          }
        })
      )
      
      setProperties(enrichedProperties)
    } catch (err) {
      console.error("Failed to load properties:", err)
      setError(err instanceof Error ? err.message : "Failed to load properties")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = async () => {
    try {
      let filtered = [...properties]

      // 🔍 Search theo location (like mobile app)
      if (searchParams?.location) {
        const searchNormalized = normalizeText(searchParams.location)

        filtered = filtered.filter(prop => {
          const fields = [
            prop.name,
            prop.city,
            prop.country,
            prop.address,
          ]

          return fields.some(field =>
            normalizeText(field || '').includes(searchNormalized)
          )
        })
      }

      // 👥 Filter theo số khách (check room capacity)
      if (searchParams && (searchParams.adults + searchParams.children) > 0) {
        setFilteringCapacity(true)
        const totalGuests = searchParams.adults + searchParams.children
        
        console.log(`🔍 Filtering ${filtered.length} properties for ${totalGuests} guests`)
        
        // Load room types cho tất cả properties (parallel)
        const results = await Promise.allSettled(
          filtered.map(async (prop) => {
            // Check cache first
            if (roomTypesCache.has(prop.id)) {
              const roomTypes = roomTypesCache.get(prop.id)!
              const hasCapacity = roomTypes.some(rt => {
                const maxOccupancy = rt.maxOccupancy || 0
                return maxOccupancy >= totalGuests
              })
              return hasCapacity ? prop : null
            }

            // Load from API
            try {
              const roomTypes = await propertiesService.getRoomTypes(prop.id)
              
              // Cache result
              setRoomTypesCache(prev => new Map(prev).set(prop.id, roomTypes))
              
              const hasCapacity = roomTypes.some(rt => {
                const maxOccupancy = rt.maxOccupancy || 0
                return maxOccupancy >= totalGuests
              })
              
              return hasCapacity ? prop : null
            } catch (err) {
              console.error(`Failed to load room types for ${prop.name}:`, err)
              // Keep property if API fails (better UX)
              return prop
            }
          })
        )

        filtered = results.reduce<Property[]>((acc, result) => {
          if (result.status === 'fulfilled' && result.value !== null) {
            acc.push(result.value)
          }
          return acc
        }, [])

        console.log(`✅ Found ${filtered.length} properties with capacity for ${totalGuests} guests`)
      }

      setFilteredProperties(filtered)
      setTotal(filtered.length)
    } finally {
      setFilteringCapacity(false)
    }
  }

  const clearSearch = () => {
    localStorage.removeItem("search_params")
    setSearchParams(null)
    applyFilters()
  }

  const handleApplyFilter = () => {
    setPage(1) // Reset to first page when filter changes
    loadProperties()
  }

  const getPropertyTypeText = () => {
    const typeMap: Record<string, string> = {
      'Hotel': 'khách sạn',
      'Resort': 'resort',
      'Apartment': 'căn hộ',
      'Villa': 'villa',
    }
    return selectedType ? typeMap[selectedType] || 'khách sạn' : 'khách sạn'
  }


  return (
    <div className="min-h-screen page-transition relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10 gradient-bg" />
      
      <div className="relative z-10">
        <Header />

      <div
        className="bg-white border-b py-6"
        style={{
          borderColor: colors.border,
          boxShadow: shadows.input,
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Search Summary */}
          {searchParams && (
            <div className="mb-6 p-4 rounded-xl animate-slide-in-left" style={{ backgroundColor: colors.lightBlue }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Kết quả tìm kiếm
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1" style={{ color: colors.textSecondary }}>
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{searchParams.location}</span>
                    </div>
                    {searchParams.checkIn && searchParams.checkOut && (
                      <div className="flex items-center gap-1" style={{ color: colors.textSecondary }}>
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(searchParams.checkIn).toLocaleDateString('vi-VN')} - {new Date(searchParams.checkOut).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1" style={{ color: colors.textSecondary }}>
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{searchParams.adults + searchParams.children} khách</span>
                      {searchParams.adults > 0 && (
                        <span className="text-xs ml-1">
                          ({searchParams.adults} người lớn{searchParams.children > 0 ? `, ${searchParams.children} trẻ em` : ''})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={clearSearch}
                  className="text-sm px-3 py-1 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: 'white', color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div className="animate-slide-in-left">
              <h1 className="text-3xl font-bold mb-2 capitalize" style={{ color: colors.textPrimary }}>
                {selectedType ? getPropertyTypeText() : 'Khách sạn'}
              </h1>
              <p style={{ color: colors.textSecondary }}>
                {total} kết quả tìm thấy
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50 transition-colors animate-slide-in-right cursor-pointer"
              style={{ borderColor: colors.border }}
            >
              <SlidersHorizontal className="w-5 h-5" style={{ color: colors.primary }} />
              <span className="font-medium" style={{ color: colors.textPrimary }}>
                Bộ lọc
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span style={{ color: colors.textSecondary }}>
              Tìm thấy <strong style={{ color: colors.textPrimary }}>{total} kết quả</strong>
            </span>
            <div className="flex-1" />
            <select
              className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                borderRadius: borderRadius.input,
              }}
            >
              <option>Phổ biến nhất</option>
              <option>Giá thấp đến cao</option>
              <option>Giá cao đến thấp</option>
              <option>Đánh giá cao nhất</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {showFilters && (
            <aside className="lg:col-span-1 animate-slide-in-left">
              <div
                className="bg-white p-6 sticky top-24"
                style={{
                  borderRadius: borderRadius.card,
                  boxShadow: shadows.card,
                }}
              >
                <h3 className="text-lg font-bold mb-6" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Lọc kết quả
                </h3>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5" style={{ color: colors.primary }} />
                    <span className="font-semibold" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Loại khách sạn
                    </span>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="propertyType"
                        className="w-4 h-4"
                        checked={selectedType === null}
                        onChange={() => setSelectedType(null)}
                      />
                      <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Tất cả
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="propertyType"
                        className="w-4 h-4"
                        checked={selectedType === "Hotel"}
                        onChange={() => setSelectedType("Hotel")}
                      />
                      <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Khách sạn
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="propertyType"
                        className="w-4 h-4"
                        checked={selectedType === "Resort"}
                        onChange={() => setSelectedType("Resort")}
                      />
                      <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Resort
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="propertyType"
                        className="w-4 h-4"
                        checked={selectedType === "Apartment"}
                        onChange={() => setSelectedType("Apartment")}
                      />
                      <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Căn hộ
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="propertyType"
                        className="w-4 h-4"
                        checked={selectedType === "Villa"}
                        onChange={() => setSelectedType("Villa")}
                      />
                      <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Villa
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleApplyFilter}
                  className="w-full py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer"
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.button,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  Áp dụng
                </button>
              </div>
            </aside>
          )}

          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {(loading || filteringCapacity) ? (
              <>
                {filteringCapacity && searchParams && (
                  <div className="mb-4 p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: colors.lightBlue }}>
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: colors.primary }} />
                    <span style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Đang kiểm tra phòng phù hợp với {searchParams.adults + searchParams.children} khách...
                    </span>
                  </div>
                )}
                <PropertiesListSkeleton count={10} />
              </>
          ) : error ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="mb-4" style={{ color: colors.textPrimary }}>{error}</p>
                <Button onClick={loadProperties} style={{ backgroundColor: colors.primary }}>
                  Thử lại
                </Button>
              </CardContent>
            </Card>
          ) : properties.length === 0 ? (
            <div className="p-12 rounded-xl text-center" style={{ backgroundColor: colors.lightBlue }}>
              <p className="text-lg" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Không tìm thấy {getPropertyTypeText()}
              </p>
            </div>
          ) : (searchParams && filteredProperties.length === 0) ? (
            <div className="p-12 rounded-xl text-center" style={{ backgroundColor: colors.lightBlue }}>
              <p className="text-lg mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Không tìm thấy {getPropertyTypeText()}
              </p>
              <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Thử thay đổi bộ lọc hoặc tìm kiếm với điều kiện khác
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(searchParams ? filteredProperties : properties).map((property, index) => (
                  <HotelCard key={property.id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {total > 10 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                      style={{ borderColor: colors.border, color: colors.textSecondary }}
                    >
                      Trước
                    </button>
                    {Array.from({ length: Math.min(5, Math.ceil(total / 10)) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className="px-4 py-2 rounded-xl font-semibold transition-colors cursor-pointer"
                          style={{
                            backgroundColor: page === pageNum ? colors.primary : "transparent",
                            color: page === pageNum ? "white" : colors.textPrimary,
                            borderColor: colors.border,
                            border: page === pageNum ? "none" : `1px solid ${colors.border}`,
                          }}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= Math.ceil(total / 10)}
                      className="px-4 py-2 border rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                      style={{ borderColor: colors.border, color: colors.textSecondary }}
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          </div>
        </div>
      </div>

        <Footer />
      </div>
    </div>
  )
}
