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
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { colors, shadows, borderRadius } from "@/lib/designTokens"

const registerSchema = z.object({
  firstName: z.string().min(2, "Họ phải có ít nhất 2 ký tự"),
  lastName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Vui lòng nhập email hợp lệ"),
  phone: z.string()
    .min(8, "Số điện thoại phải có ít nhất 8 ký tự")
    .max(16, "Số điện thoại không được vượt quá 16 ký tự")
    .regex(/^[\+]?[0-9]{8,15}$/, "Vui lòng nhập số điện thoại hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "Bạn phải đồng ý với điều khoản và chính sách",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setError("")
    
    try {
      await authService.register(data)
      router.push("/login")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Đăng ký thất bại")
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
                Đăng Ký
              </h2>
              <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Tạo tài khoản mới
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Họ
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                              style={{ color: colors.primary }}
                            />
                            <Input
                              placeholder="Họ"
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
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Tên
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                              style={{ color: colors.primary }}
                            />
                            <Input
                              placeholder="Tên"
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
                </div>

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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Số điện thoại
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                          <Input
                            placeholder="+84 123 456 789"
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
                            placeholder="Tạo mật khẩu"
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Xác nhận mật khẩu
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                          <Input
                            placeholder="Xác nhận mật khẩu"
                            type={showConfirmPassword ? "text" : "password"}
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
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
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

                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Tôi đồng ý với{" "}
                          <a href="#" className="hover:opacity-70 transition-opacity" style={{ color: colors.primary }}>
                            Điều khoản dịch vụ
                          </a>{" "}
                          và{" "}
                          <a href="#" className="hover:opacity-70 transition-opacity" style={{ color: colors.primary }}>
                            Chính sách bảo mật
                          </a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

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
                      Đăng Ký
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: colors.border }}>
              <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="font-semibold hover:opacity-70 transition-opacity"
                  style={{ color: colors.primary }}
                >
                  Đăng nhập
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
