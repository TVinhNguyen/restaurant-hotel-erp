"use client"

import { useEffect, useRef } from "react"
import { colors, shadows } from "@/lib/designTokens"
import { Award, Users, Globe, Heart } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"

export default function AboutPage() {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Scroll reveal animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          entry.target.classList.remove("opacity-0", "translate-y-10")
        }
      })
    }, observerOptions)

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(() => {
      // Observe all elements with scroll-reveal class
      const scrollRevealElements = document.querySelectorAll('.scroll-reveal')
      scrollRevealElements.forEach((element) => {
        element.classList.add("transition-all", "duration-700", "ease-out")
        observer.observe(element)
      })

      // Also observe refs
      sectionsRef.current.forEach((section) => {
        if (section) {
          section.classList.add("transition-all", "duration-700", "ease-out")
          observer.observe(section)
        }
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [])

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Header />
      <div
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1920)",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col justify-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Về LuxStay
            </h1>
            <p className="text-xl text-white/90" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Đặc quyền du lịch, được cá nhân hóa cho bạn
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="scroll-reveal opacity-0 translate-y-10">
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Câu chuyện của chúng tôi
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              LuxStay được thành lập với một sứ mệnh đơn giản: làm cho việc đặt phòng khách sạn và các dịch vụ du lịch
              trở nên dễ dàng, đáng tin cậy và sang trọng.
            </p>
            <p className="mb-4 leading-relaxed" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Với hơn 1,000+ khách sạn và resort được tuyển chọn tại Việt Nam, chúng tôi cam kết cung cấp trải nghiệm
              tuyệt vời nhất cho mỗi lần nghỉ dưỡng của bạn.
            </p>
            <p className="leading-relaxed" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Từ những bãi biển tuyệt đẹp đến những khu núi xanh mát, chúng tôi là người bạn đồng hành trong mỗi chuyến
              đi của bạn.
            </p>
          </div>
          <div className="scroll-reveal opacity-0 translate-y-10" style={{ animationDelay: "0.2s" }}>
            <img
              src="https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Về LuxStay"
              className="w-full h-96 object-cover rounded-2xl"
            />
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center scroll-reveal opacity-0 translate-y-10" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Tại sao chọn LuxStay?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl text-center scroll-reveal opacity-0 translate-y-10" style={{ boxShadow: shadows.card, animationDelay: "0.1s" }}>
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.lightBlue }}
              >
                <Globe className="w-8 h-8" style={{ color: colors.primary }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Phạm vi toàn cầu
              </h3>
              <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>Hơn 1,000 khách sạn chất lượng cao trên toàn Việt Nam</p>
            </div>

            <div className="bg-white p-8 rounded-2xl text-center scroll-reveal opacity-0 translate-y-10" style={{ boxShadow: shadows.card, animationDelay: "0.2s" }}>
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.lightBlue }}
              >
                <Award className="w-8 h-8" style={{ color: colors.primary }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Chất lượng được đảm bảo
              </h3>
              <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>Tất cả khách sạn đều được kiểm duyệt và xếp hạng</p>
            </div>

            <div className="bg-white p-8 rounded-2xl text-center scroll-reveal opacity-0 translate-y-10" style={{ boxShadow: shadows.card, animationDelay: "0.3s" }}>
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.lightBlue }}
              >
                <Heart className="w-8 h-8" style={{ color: colors.primary }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Dịch vụ tuyệt vời
              </h3>
              <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>Hỗ trợ khách hàng 24/7 bằng tiếng Việt</p>
            </div>

            <div className="bg-white p-8 rounded-2xl text-center scroll-reveal opacity-0 translate-y-10" style={{ boxShadow: shadows.card, animationDelay: "0.4s" }}>
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.lightBlue }}
              >
                <Users className="w-8 h-8" style={{ color: colors.primary }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Cộng đồng lớn
              </h3>
              <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>Hơn 1 triệu người đã tin tưởng LuxStay</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-12 rounded-2xl scroll-reveal opacity-0 translate-y-10" style={{ boxShadow: shadows.cardHover }}>
          <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Hãy bắt đầu hành trình của bạn ngay hôm nay
          </h2>
          <p className="text-center mb-8" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Khám phá những điểm đến tuyệt vời và tạo những kỷ niệm không thể quên
          </p>
          <div className="flex justify-center">
            <Link href="/">
              <button
                className="px-8 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer"
                style={{ backgroundColor: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                Khám phá ngay
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
