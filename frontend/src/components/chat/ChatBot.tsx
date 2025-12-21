"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, MessageCircle, Bot, User as UserIcon } from "lucide-react"
import { colors } from "@/lib/designTokens"
import { Button } from "@/components/ui/button"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://34.151.224.213:4000/api'

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi là trợ lý AI của LuxStay. Tôi có thể giúp gì cho bạn?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE}/v1/gemini/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "Xin lỗi, tôi không thể trả lời câu hỏi này.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 animate-bounce"
          style={{ backgroundColor: colors.primary }}
          aria-label="Mở chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border"
             style={{ borderColor: colors.border }}>
          {/* Header */}
          <div
            className="p-4 rounded-t-2xl flex items-center justify-between"
            style={{ backgroundColor: colors.primary }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">LuxStay AI Assistant</h3>
                <p className="text-xs text-white/80">Trợ lý ảo của bạn</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Đóng chat"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor:
                      message.sender === "bot" ? colors.lightBlue : colors.primary,
                  }}
                >
                  {message.sender === "bot" ? (
                    <Bot className="w-4 h-4" style={{ color: colors.primary }} />
                  ) : (
                    <UserIcon className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[70%] p-3 rounded-2xl ${
                    message.sender === "user"
                      ? "rounded-tr-none"
                      : "rounded-tl-none"
                  }`}
                  style={{
                    backgroundColor:
                      message.sender === "bot" ? colors.background : colors.primary,
                    color: message.sender === "bot" ? colors.textPrimary : "white",
                  }}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p
                    className="text-xs mt-1"
                    style={{
                      color:
                        message.sender === "bot"
                          ? colors.textSecondary
                          : "rgba(255,255,255,0.7)",
                    }}
                  >
                    {message.timestamp.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.lightBlue }}
                >
                  <Bot className="w-4 h-4" style={{ color: colors.primary }} />
                </div>
                <div
                  className="p-3 rounded-2xl rounded-tl-none"
                  style={{ backgroundColor: colors.background }}
                >
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t" style={{ borderColor: colors.border }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }}
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 rounded-xl text-white transition-all"
                style={{ backgroundColor: colors.primary }}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs mt-2 text-center" style={{ color: colors.textSecondary }}>
              Powered by Gemini AI
            </p>
          </div>
        </div>
      )}
    </>
  )
}
