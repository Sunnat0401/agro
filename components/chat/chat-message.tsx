"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  isTyping?: boolean
}

export function ChatMessage({ role, content, isTyping }: ChatMessageProps) {
  const isUser = role === "user"

  // Parse markdown-like formatting
  const formatContent = (text: string) => {
    const lines = text.split("\n")
    return lines.map((line, i) => {
      // Bold text
      line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

      // Bullet points
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <div key={i} className="flex gap-2 py-0.5">
            <span className="text-green-600">•</span>
            <span dangerouslySetInnerHTML={{ __html: line.slice(2) }} />
          </div>
        )
      }

      // Numbered list
      const numberedMatch = line.match(/^(\d+)\.\s(.*)/)
      if (numberedMatch) {
        return (
          <div key={i} className="flex gap-2 py-0.5">
            <span className="text-green-600 font-medium">{numberedMatch[1]}.</span>
            <span dangerouslySetInnerHTML={{ __html: numberedMatch[2] }} />
          </div>
        )
      }

      // Regular line
      if (line.trim()) {
        return <p key={i} className="py-0.5" dangerouslySetInnerHTML={{ __html: line }} />
      }
      return <br key={i} />
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-green-600 text-white" : "bg-secondary text-foreground",
        )}
      >
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </motion.div>

      {/* Message Bubble */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser ? "rounded-tr-sm bg-green-600 text-white" : "rounded-tl-sm bg-secondary text-foreground",
        )}
      >
        {isTyping ? (
          <div className="flex items-center gap-1.5 py-1">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
              className="h-2 w-2 rounded-full bg-current"
            />
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
              className="h-2 w-2 rounded-full bg-current"
            />
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
              className="h-2 w-2 rounded-full bg-current"
            />
          </div>
        ) : (
          <div className="text-sm leading-relaxed">{formatContent(content)}</div>
        )}
      </motion.div>
    </motion.div>
  )
}
