"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { colors, shadows, borderRadius } from "@/lib/designTokens"

interface BackButtonProps {
  text?: string
  onClick?: () => void
  variant?: "default" | "ghost" | "outline"
  className?: string
}

export function BackButton({ 
  text = "Quay lại", 
  onClick,
  variant = "ghost",
  className = ""
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.back()
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "default":
        return {
          backgroundColor: colors.primary,
          color: "white",
          border: "none",
        }
      case "outline":
        return {
          backgroundColor: "white",
          color: colors.primary,
          border: `1px solid ${colors.border}`,
        }
      case "ghost":
      default:
        return {
          backgroundColor: "transparent",
          color: colors.textPrimary,
          border: "none",
        }
    }
  }

  const variantStyles = getVariantStyles()

  return (
    <button
      onClick={handleClick}
      className={`group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${className}`}
      style={{
        ...variantStyles,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxShadow: variant === "outline" ? shadows.input : "none",
      }}
      onMouseEnter={(e) => {
        if (variant === "ghost") {
          e.currentTarget.style.backgroundColor = colors.primary
          e.currentTarget.style.color = "white"
          e.currentTarget.style.boxShadow = shadows.cardHover
          const arrow = e.currentTarget.querySelector('svg')
          if (arrow) arrow.style.color = "white"
        } else if (variant === "outline") {
          e.currentTarget.style.backgroundColor = colors.lightBlue
          e.currentTarget.style.borderColor = colors.primary
          e.currentTarget.style.boxShadow = shadows.card
        } else {
          e.currentTarget.style.opacity = "0.9"
          e.currentTarget.style.boxShadow = shadows.cardHover
        }
      }}
      onMouseLeave={(e) => {
        if (variant === "ghost") {
          e.currentTarget.style.backgroundColor = "transparent"
          e.currentTarget.style.color = colors.textPrimary
          e.currentTarget.style.boxShadow = "none"
          const arrow = e.currentTarget.querySelector('svg')
          if (arrow) arrow.style.color = colors.primary
        } else if (variant === "outline") {
          e.currentTarget.style.backgroundColor = "white"
          e.currentTarget.style.borderColor = colors.border
          e.currentTarget.style.boxShadow = shadows.input
        } else {
          e.currentTarget.style.opacity = "1"
          e.currentTarget.style.boxShadow = "none"
        }
      }}
    >
      <ArrowLeft 
        className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" 
        style={{ color: variant === "default" ? "white" : colors.primary }}
      />
      <span className="transition-colors duration-300">{text}</span>
    </button>
  )
}
