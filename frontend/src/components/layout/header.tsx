"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { authService, type User } from "@/lib/auth"
import Link from "next/link"
import { User as UserIcon, LogOut, Settings, Hotel, Menu, X } from "lucide-react"
import { colors } from "@/lib/designTokens"

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const loadUser = async () => {
    if (authService.isAuthenticated()) {
      try {
        const userData = await authService.getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("Failed to load user:", error)
        setUser(null)
        authService.logout()
      }
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadUser()
  }, [pathname])

  useEffect(() => {
    const handleStorageChange = () => {
      loadUser()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('user-login', handleStorageChange)
    window.addEventListener('user-logout', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('user-login', handleStorageChange)
      window.removeEventListener('user-logout', handleStorageChange)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
      setUser(null)
      window.dispatchEvent(new Event('user-logout'))
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header 
      className="bg-white border-b sticky top-0 z-50 backdrop-blur-sm bg-white/95 transition-all"
      style={{ borderColor: colors.border }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity group">
            <div 
              className="p-2 rounded-xl transition-all group-hover:shadow-lg" 
              style={{ backgroundColor: colors.primary }}
            >
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                LuxStay
              </h1>
              <p className="text-xs font-medium" style={{ color: colors.accent, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                PREMIUM STAYS
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Trang chủ
            </Link>
            <Link
              href="/properties"
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Khách sạn
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Giới thiệu
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Liên hệ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all hover:shadow-lg"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {user.name || "User"}
                    </span>
                  </Button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" style={{ color: colors.textSecondary }} />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white transition-all hover:shadow-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Đăng nhập</span>
                </Button>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" style={{ color: colors.textPrimary }} />
              ) : (
                <Menu className="w-6 h-6" style={{ color: colors.textPrimary }} />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t space-y-2" style={{ borderColor: colors.border }}>
            <Link
              href="/"
              className="block w-full text-left px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
              style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href="/properties"
              className="block w-full text-left px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
              style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Khách sạn
            </Link>
            <Link
              href="/about"
              className="block w-full text-left px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
              style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Giới thiệu
            </Link>
            <Link
              href="/contact"
              className="block w-full text-left px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
              style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Liên hệ
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block w-full text-left px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
                  style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tài khoản
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
                  style={{ color: colors.accent, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block w-full text-left px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
                style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}




