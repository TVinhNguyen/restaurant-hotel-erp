"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, SlidersHorizontal, Building2 } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import HotelCard from "@/components/HotelCard"
import PropertiesListSkeleton from "@/components/skeletons/PropertiesListSkeleton"
import { propertiesService, type Property } from "@/lib/services/properties"
import { colors, shadows, borderRadius } from "@/lib/designTokens"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [showFilters, setShowFilters] = useState(true)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  useEffect(() => {
    loadProperties()
  }, [page, selectedType])

  const loadProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      const params: { page: number; limit: number; type?: string } = {
        page,
        limit: 10,
      }
      if (selectedType) {
        params.type = selectedType
      }
      const response = await propertiesService.getProperties(params)
      console.log("Properties response:", response)
      console.log("Properties data:", response.data)
      console.log("Properties count:", response.data?.length)
      setProperties(response.data || [])
      setTotal(response.total || 0)
    } catch (err) {
      console.error("Failed to load properties:", err)
      setError(err instanceof Error ? err.message : "Failed to load properties")
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilter = () => {
    setPage(1) // Reset to first page when filter changes
    loadProperties()
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
          <div className="flex items-center justify-between mb-4">
            <div className="animate-slide-in-left">
              <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                Khách sạn
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
            {loading ? (
              <PropertiesListSkeleton count={10} />
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
            <Card>
              <CardContent className="p-6 text-center">
                <p style={{ color: colors.textSecondary }}>Không tìm thấy khách sạn</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {properties.map((property, index) => (
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
