"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface SavedContextType {
  savedItems: string[]
  addSaved: (id: string) => void
  removeSaved: (id: string) => void
  toggleSaved: (id: string) => void
  isSaved: (id: string) => boolean
}

const SavedContext = createContext<SavedContextType | undefined>(undefined)

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [savedItems, setSavedItems] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("agromind-saved")
    if (saved) {
      try {
        setSavedItems(JSON.parse(saved))
      } catch {
        localStorage.removeItem("agromind-saved")
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("agromind-saved", JSON.stringify(savedItems))
    }
  }, [savedItems, mounted])

  const addSaved = useCallback((id: string) => {
    setSavedItems((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const removeSaved = useCallback((id: string) => {
    setSavedItems((prev) => prev.filter((item) => item !== id))
  }, [])

  const toggleSaved = useCallback((id: string) => {
    setSavedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }, [])

  const isSaved = useCallback(
    (id: string) => {
      return savedItems.includes(id)
    },
    [savedItems],
  )

  return (
    <SavedContext.Provider value={{ savedItems, addSaved, removeSaved, toggleSaved, isSaved }}>
      {children}
    </SavedContext.Provider>
  )
}

export function useSaved() {
  const context = useContext(SavedContext)
  if (!context) {
    throw new Error("useSaved must be used within a SavedProvider")
  }
  return context
}
