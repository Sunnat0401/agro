"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import translations from "@/data/translations.json"

export type Language = "uz" | "ru" | "en"

type TranslationValue = string | { [key: string]: TranslationValue }
type Translations = typeof translations

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("uz")

  useEffect(() => {
    const savedLang = localStorage.getItem("agromind-language") as Language
    if (savedLang && ["uz", "ru", "en"].includes(savedLang)) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("agromind-language", lang)
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split(".")
      let value: TranslationValue = translations[language] as unknown as TranslationValue

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = (value as Record<string, TranslationValue>)[k]
        } else {
          return key
        }
      }

      if (typeof value !== "string") {
        return key
      }

      if (params) {
        return Object.entries(params).reduce(
          (str, [paramKey, paramValue]) => str.replace(`{${paramKey}}`, String(paramValue)),
          value,
        )
      }

      return value
    },
    [language],
  )

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
