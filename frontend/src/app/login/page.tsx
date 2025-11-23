"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { colors, shadows, borderRadius } from "@/lib/designTokens"

const loginSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError("")
    
    try {
      await authService.login(data)
      window.dispatchEvent(new Event('user-login'))
      router.push("/")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Đăng nhập thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Header />

      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-3xl" style={{ boxShadow: shadows.cardHover }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Đăng Nhập
              </h2>
              <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Chào mừng quay lại
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                          <Input
                            placeholder="Nhập email"
                            type="email"
                            className="pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                            style={{
                              borderColor: colors.border,
                              boxShadow: shadows.input,
                              borderRadius: borderRadius.input,
                            }}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Mật khẩu
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                          <Input
                            placeholder="Nhập mật khẩu"
                            type={showPassword ? "text" : "password"}
                            className="pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                            style={{
                              borderColor: colors.border,
                              boxShadow: shadows.input,
                              borderRadius: borderRadius.input,
                            }}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" style={{ color: colors.textSecondary }} />
                            ) : (
                              <Eye className="h-4 w-4" style={{ color: colors.textSecondary }} />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-end">
                  <Link
                    href="/contact"
                    className="text-sm hover:opacity-70 transition-opacity"
                    style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.button,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  {isLoading ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      Đăng Nhập
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: colors.border }}>
              <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="font-semibold hover:opacity-70 transition-opacity"
                  style={{ color: colors.primary }}
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
