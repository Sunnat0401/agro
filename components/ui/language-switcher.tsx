// "use client"

// import { motion } from "framer-motion"
// import { useLanguage, type Language } from "@/contexts/language-context"
// import { cn } from "@/lib/utils"

// const languages: { code: Language; label: string; flag: string }[] = [
//   { code: "uz", label: "O'z", flag: "🇺🇿" },
//   { code: "ru", label: "Ру", flag: "🇷🇺" },
//   { code: "en", label: "En", flag: "🇬🇧" },
// ]

// export function LanguageSwitcher() {
//   const { language, setLanguage } = useLanguage()

//   return (
//     <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
//       {languages.map((lang) => (
//         <motion.button
//           key={lang.code}
//           onClick={() => setLanguage(lang.code)}
//           className={cn(
//             "relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
//             language === lang.code ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
//           )}
//           whileTap={{ scale: 0.95 }}
//         >
//           {language === lang.code && (
//             <motion.div
//               layoutId="language-indicator"
//               className="absolute inset-0 rounded-full bg-primary"
//               transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//             />
//           )}
//           <span className="relative z-10 flex items-center gap-1">
//             <span>{lang.flag}</span>
//             <span className="hidden sm:inline">{lang.label}</span>
//           </span>
//         </motion.button>
//       ))}
//     </div>
//   )
// }
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage, type Language } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "uz", label: "O'z", flag: "🇺🇿" },
  { code: "ru", label: "Ру", flag: "🇷🇺" },
  { code: "en", label: "En", flag: "🇬🇧" },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find((lang) => lang.code === language)

  // Tashqariga bosilganda dropdownni yopish
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium transition-colors",
          "hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        )}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10 flex items-center gap-1.5">
          <span className="text-sm">{currentLanguage?.flag}</span>
          <span className="hidden sm:inline">{currentLanguage?.label}</span>
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3 w-3" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1 min-w-[100px] origin-top-right rounded-xl bg-secondary p-1 shadow-lg border"
          >
            <div className="space-y-0.5">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:bg-accent",
                    language === lang.code
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}