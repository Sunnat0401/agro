"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  isLoading?: boolean
}

export function ChatInput({ onSend, disabled, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled && !isLoading) {
      onSend(message.trim())
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="flex items-end gap-2 rounded-2xl border border-border bg-background p-2 shadow-lg"
    >
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("chat.placeholder")}
        disabled={disabled || isLoading}
        className="min-h-[44px] max-h-[150px] flex-1 resize-none border-0 bg-transparent p-2 focus-visible:ring-0 focus-visible:ring-offset-0"
        rows={1}
      />
      <motion.div whileTap={{ scale: 0.9 }}>
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || disabled || isLoading}
          className="h-11 w-11 shrink-0 rounded-xl bg-green-600 hover:bg-green-700"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </motion.div>
    </motion.form>
  )
}
