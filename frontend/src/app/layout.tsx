import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import { ChatBot } from '@/components/chat/ChatBot'
import './globals.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: 'LuxStay',
  description: 'Hệ thống quản lý khách sạn và nhà hàng - Property Management System',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <ChatBot />
        <Toaster 
          position="top-right" 
          theme="dark"
          toastOptions={{
            style: {
              background: '#1F2937',
              color: '#FFFFFF',
              borderRadius: '8px',
              border: 'none',
            },
            className: 'sonner-toast',
          }}
          closeButton
        />
      </body>
    </html>
  )
}
