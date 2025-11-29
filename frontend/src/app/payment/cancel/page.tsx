"use client"

import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowRight } from "lucide-react"
import { colors, shadows, borderRadius } from "@/lib/designTokens"

export default function PaymentCancelPage() {
  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Header />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div
          className="bg-white p-8 text-center"
          style={{
            borderRadius: borderRadius.card,
            boxShadow: shadows.card,
          }}
        >
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
            style={{ backgroundColor: "#FEE2E2" }}
          >
            <XCircle className="w-16 h-16" style={{ color: "#DC2626" }} />
          </div>

          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: colors.textPrimary, fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Thanh toán chưa thành công
          </h1>

          <p
            className="text-sm mb-6"
            style={{ color: colors.textSecondary, fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Bạn đã hủy thanh toán trên cổng PayOS. Đơn đặt phòng hiện chưa được xác nhận.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/booking" className="flex-1">
              <Button
                className="w-full py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: borderRadius.button,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                Thử thanh toán lại
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/properties" className="flex-1">
              <Button
                variant="outline"
                className="w-full py-4 font-semibold rounded-xl transition-all"
                style={{
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  borderRadius: borderRadius.button,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                Về trang khách sạn
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}


