"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

interface ChatContextType {
  messages: Message[]
  addMessage: (content: string, role: "user" | "assistant") => void
  clearMessages: () => void
  isTyping: boolean
  setIsTyping: (typing: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const savedMessages = localStorage.getItem("agromind-chat")
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch {
        localStorage.removeItem("agromind-chat")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("agromind-chat", JSON.stringify(messages))
  }, [messages])

  const addMessage = useCallback((content: string, role: "user" | "assistant") => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      role,
      content,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, newMessage])
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        clearMessages,
        isTyping,
        setIsTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
