import Link from "next/link"
import { Bed, Utensils, CreditCard, Star } from "lucide-react"
import { colors } from "@/lib/designTokens"

export function Footer() {
  return (
    <footer className="bg-white border-t mt-20" style={{ borderColor: colors.border }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Sứ mệnh của chúng tôi */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Sứ mệnh của chúng tôi
          </h3>
          <p className="text-base leading-relaxed max-w-4xl" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Mang đến trải nghiệm đặt phòng và ẩm thực tuyệt vời nhất, kết nối bạn với những địa điểm sang trọng và dịch vụ đẳng cấp. 
            Chúng tôi cam kết mang lại sự hài lòng tối đa cho mọi khách hàng.
          </p>
        </div>

        {/* Tính năng nổi bật */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Tính năng nổi bật
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Đặt phòng dễ dàng */}
            <div className="text-center p-6 rounded-2xl transition-all hover:shadow-lg" style={{ backgroundColor: colors.background }}>
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.lightBlue }}
              >
                <Bed className="w-8 h-8" style={{ color: colors.primary }} />
              </div>
              <h4 className="font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Đặt phòng dễ dàng
            </h4>
              <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Tìm và đặt phòng khách sạn chỉ trong vài thao tác đơn giản
              </p>
            </div>

            {/* Nhà hàng đẳng cấp */}
            <div className="text-center p-6 rounded-2xl transition-all hover:shadow-lg" style={{ backgroundColor: colors.background }}>
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.lightBlue }}
              >
                <Utensils className="w-8 h-8" style={{ color: colors.primary }} />
          </div>
              <h4 className="font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Nhà hàng đẳng cấp
            </h4>
              <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Khám phá và đặt bàn tại các nhà hàng cao cấp
              </p>
            </div>

            {/* Thanh toán an toàn */}
            <div className="text-center p-6 rounded-2xl transition-all hover:shadow-lg" style={{ backgroundColor: colors.background }}>
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.lightBlue }}
              >
                <CreditCard className="w-8 h-8" style={{ color: colors.primary }} />
          </div>
              <h4 className="font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Thanh toán an toàn
            </h4>
              <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Hỗ trợ phương thức thanh toán tiện lợi và bảo mật
              </p>
            </div>

            {/* Ưu đãi hấp dẫn */}
            <div className="text-center p-6 rounded-2xl transition-all hover:shadow-lg" style={{ backgroundColor: colors.background }}>
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.lightBlue }}
              >
                <Star className="w-8 h-8" style={{ color: colors.primary }} />
          </div>
              <h4 className="font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Ưu đãi hấp dẫn
            </h4>
              <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Nhận ngay các chương trình khuyến mãi độc quyền
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="border-t pt-8 text-center text-sm"
          style={{ borderColor: colors.border, color: colors.textSecondary }}
        >
          © 2025 LuxStay. Đã đăng ký bản quyền.
        </div>
      </div>
    </footer>
  )
}








