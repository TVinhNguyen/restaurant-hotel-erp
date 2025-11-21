import Link from "next/link"
import { colors } from "@/lib/designTokens"

export function Footer() {
  return (
    <footer className="bg-white border-t mt-20" style={{ borderColor: colors.border }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Về LuxStay
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
              <li className="cursor-pointer hover:opacity-70">
                <Link href="/about">Giới thiệu</Link>
              </li>
              <li className="cursor-pointer hover:opacity-70">
                <Link href="/contact">Liên hệ</Link>
              </li>
              <li className="cursor-pointer hover:opacity-70">Tuyển dụng</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Hỗ trợ
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
              <li className="cursor-pointer hover:opacity-70">Trung tâm hỗ trợ</li>
              <li className="cursor-pointer hover:opacity-70">Chính sách hoàn hủy</li>
              <li className="cursor-pointer hover:opacity-70">Điều khoản</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Đối tác
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
              <li className="cursor-pointer hover:opacity-70">Đăng ký khách sạn</li>
              <li className="cursor-pointer hover:opacity-70">Chương trình affiliate</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Theo dõi
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
              <li className="cursor-pointer hover:opacity-70">Facebook</li>
              <li className="cursor-pointer hover:opacity-70">Instagram</li>
              <li className="cursor-pointer hover:opacity-70">Twitter</li>
            </ul>
          </div>
        </div>
        <div
          className="border-t mt-8 pt-8 text-center text-sm"
          style={{ borderColor: colors.border, color: colors.textSecondary }}
        >
          © 2025 LuxStay. Premium Booking Platform.
        </div>
      </div>
    </footer>
  )
}








