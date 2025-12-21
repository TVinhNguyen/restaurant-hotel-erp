"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, EyeOff, Lock, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { authService } from "@/lib/auth"
import { colors, shadows, borderRadius } from "@/lib/designTokens"
import { showToast } from "@/lib/toast"

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    oldPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!oldPassword) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu hiện tại"
    }

    if (!newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới"
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự"
    } else if (newPassword === oldPassword) {
      newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới"
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await authService.changePassword({
        currentPassword: oldPassword,
        newPassword,
        confirmPassword,
      })

      showToast.success("Đổi mật khẩu thành công!")
      
      // Clear form
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
      
      // Redirect to profile after 1.5 seconds
      setTimeout(() => {
        router.push("/profile")
      }, 1500)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Đổi mật khẩu thất bại"
      showToast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Header />

      <div className="max-w-md mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 mb-6 hover:opacity-70 transition-opacity"
          style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại trang cá nhân</span>
        </Link>

        <Card
          className="border-0"
          style={{
            boxShadow: shadows.card,
            borderRadius: borderRadius.card,
          }}
        >
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: colors.lightBlue }}
              >
                <Lock className="w-8 h-8" style={{ color: colors.primary }} />
              </div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                Đổi mật khẩu
              </h1>
              <p
                className="text-sm"
                style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                Cập nhật mật khẩu mới để bảo mật tài khoản của bạn
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Old Password */}
              <div>
                <Label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Mật khẩu hiện tại <span style={{ color: '#E53E3E' }}>*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value)
                      if (errors.oldPassword) {
                        setErrors({ ...errors, oldPassword: undefined })
                      }
                    }}
                    className="pr-12"
                    style={{
                      borderRadius: borderRadius.input,
                      borderColor: errors.oldPassword ? '#E53E3E' : colors.border,
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                    placeholder="Nhập mật khẩu hiện tại"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                    style={{ color: colors.textSecondary }}
                  >
                    {showOldPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.oldPassword && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: '#E53E3E', fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {errors.oldPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <Label
                  htmlFor="newPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Mật khẩu mới <span style={{ color: '#E53E3E' }}>*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      if (errors.newPassword) {
                        setErrors({ ...errors, newPassword: undefined })
                      }
                    }}
                    className="pr-12"
                    style={{
                      borderRadius: borderRadius.input,
                      borderColor: errors.newPassword ? '#E53E3E' : colors.border,
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                    style={{ color: colors.textSecondary }}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: '#E53E3E', fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Xác nhận mật khẩu mới <span style={{ color: '#E53E3E' }}>*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (errors.confirmPassword) {
                        setErrors({ ...errors, confirmPassword: undefined })
                      }
                    }}
                    className="pr-12"
                    style={{
                      borderRadius: borderRadius.input,
                      borderColor: errors.confirmPassword ? '#E53E3E' : colors.border,
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                    placeholder="Nhập lại mật khẩu mới"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                    style={{ color: colors.textSecondary }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: '#E53E3E', fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: borderRadius.button,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Đổi mật khẩu
                  </div>
                )}
              </Button>
            </form>

            {/* Security Tips */}
            <div
              className="mt-6 p-4 rounded-lg"
              style={{ backgroundColor: colors.lightBlue }}
            >
              <p
                className="text-xs font-medium mb-2"
                style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                💡 Mẹo bảo mật:
              </p>
              <ul
                className="text-xs space-y-1"
                style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                <li>• Sử dụng mật khẩu mạnh với ít nhất 8 ký tự</li>
                <li>• Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                <li>• Không sử dụng thông tin cá nhân dễ đoán</li>
                <li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
