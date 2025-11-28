"use client"

import { useState, useEffect, useRef } from "react"
import { colors, shadows } from "@/lib/designTokens"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { showToast } from "@/lib/toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    setFormData({ name: "", email: "", subject: "", message: "" })
    showToast.success("Cảm ơn bạn đã liên hệ!", "Chúng tôi sẽ phản hồi sớm nhất.")
  }

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Header />
      <div
        className="relative h-80 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/3944650/pexels-photo-3944650.jpeg?auto=compress&cs=tinysrgb&w=1920)",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col justify-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl text-white/90" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Chúng tôi luôn sẵn lòng lắng nghe từ bạn
                    </p>
                  </div>
                </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl text-center scroll-reveal opacity-0 translate-y-10" style={{ boxShadow: shadows.card, animationDelay: "0.1s" }}>
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.lightBlue }}
            >
              <Phone className="w-8 h-8" style={{ color: colors.primary }} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Gọi cho chúng tôi
            </h3>
            <p className="mb-2" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Hỗ trợ 24/7
            </p>
            <a href="tel:02439123456" className="font-semibold hover:opacity-70" style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              +84 (24) 3912 3456
            </a>
          </div>

          <div className="bg-white p-8 rounded-2xl text-center scroll-reveal opacity-0 translate-y-10" style={{ boxShadow: shadows.card, animationDelay: "0.2s" }}>
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.lightBlue }}
            >
              <Mail className="w-8 h-8" style={{ color: colors.primary }} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Email chúng tôi
            </h3>
            <p className="mb-2" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Trả lời trong 24 giờ
            </p>
            <a
              href="mailto:support@luxstay.vn"
              className="font-semibold hover:opacity-70"
              style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              support@luxstay.vn
            </a>
          </div>

          <div className="bg-white p-8 rounded-2xl text-center scroll-reveal opacity-0 translate-y-10" style={{ boxShadow: shadows.card, animationDelay: "0.3s" }}>
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.lightBlue }}
            >
              <MapPin className="w-8 h-8" style={{ color: colors.primary }} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Địa chỉ
            </h3>
            <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Tầng 10, Tòa nhà ABC
              <br />
              Hà Nội, Việt Nam
                    </p>
                  </div>
                </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="scroll-reveal opacity-0 translate-y-10">
            <h2 className="text-3xl font-bold mb-6" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Gửi tin nhắn cho chúng tôi
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: colors.border, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  required
                />
                  </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: colors.border, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  required
                />
                </div>

                  <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Chủ đề
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: colors.border, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  required
                />
                  </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Tin nhắn
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 h-32"
                  style={{ borderColor: colors.border, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  required
                />
                </div>

              <button
                type="submit"
                className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                <Send className="w-4 h-4" />
                Gửi tin nhắn
              </button>
            </form>
          </div>

          <div className="scroll-reveal opacity-0 translate-y-10" style={{ animationDelay: "0.2s" }}>
            <img
              src="https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800"
              alt="Liên hệ"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
