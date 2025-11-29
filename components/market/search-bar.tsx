"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useLanguage()
  const [isFocused, setIsFocused] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex items-center rounded-xl border transition-all ${
        isFocused ? "border-green-600 ring-2 ring-green-600/20" : "border-border"
      }`}
    >
      <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={t("common.search")}
        className="h-12 border-0 bg-transparent pl-12 pr-10 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      {value && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={() => onChange("")}
          className="absolute right-3 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </motion.button>
      )}
    </motion.div>
  )
}
