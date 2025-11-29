"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface CartItem {
  id: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (id: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (id: string) => number
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem("agromind-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch {
        localStorage.removeItem("agromind-cart")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("agromind-cart", JSON.stringify(items))
  }, [items])

  const addItem = useCallback((id: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        return prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { id, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id))
    } else {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const getItemQuantity = useCallback(
    (id: string): number => {
      return items.find((item) => item.id === id)?.quantity || 0
    },
    [items],
  )

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
