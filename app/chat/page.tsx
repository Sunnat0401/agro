"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useChat } from "@/contexts/chat-context"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ChatMessage } from "@/components/chat/chat-message"
import { ChatInput } from "@/components/chat/chat-input"
import { QuickPrompts } from "@/components/chat/quick-prompts"
import { Button } from "@/components/ui/button"
import { generateAIResponse } from "@/utils/ai-response"
import { Bot, Trash2 } from "lucide-react"

export default function ChatPage() {
  const { isAuthenticated } = useAuth()
  const { t, language } = useLanguage()
  const { messages, addMessage, clearMessages, isTyping, setIsTyping } = useChat()
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router, mounted])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSend = async (content: string) => {
    addMessage(content, "user")
    setIsTyping(true)

    try {
      const response = await generateAIResponse(content, language)
      addMessage(response, "assistant")
    } catch (error) {
      addMessage("Sorry, an error occurred. Please try again.", "assistant")
    } finally {
      setIsTyping(false)
    }
  }

  if (!mounted || !isAuthenticated) {
    return null
  }

  const showQuickPrompts = messages.length === 0

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="container mx-auto flex flex-1 flex-col px-4 pb-24 pt-4 md:pb-4">
        {/* Chat Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{t("chat.title")}</h1>
              <p className="text-sm text-muted-foreground">{t("chat.subtitle")}</p>
            </div>
          </div>
          {messages.length > 0 && (
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={clearMessages}
                className="text-muted-foreground hover:text-destructive bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card/50 p-4">
          <AnimatePresence mode="popLayout">
            {showQuickPrompts ? (
              <motion.div
                key="quick-prompts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-600/10"
                >
                  <Bot className="h-10 w-10 text-green-600" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-2 text-xl font-semibold text-foreground"
                >
                  {t("chat.title")}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8 max-w-md text-center text-muted-foreground"
                >
                  {t("chat.greeting")}
                </motion.p>
                <QuickPrompts onSelect={handleSend} />
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-4"
              >
                {messages.map((message) => (
                  <ChatMessage key={message.id} role={message.role} content={message.content} />
                ))}
                {isTyping && <ChatMessage role="assistant" content="" isTyping />}
                <div ref={messagesEndRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="mt-4">
          <ChatInput onSend={handleSend} isLoading={isTyping} />
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
