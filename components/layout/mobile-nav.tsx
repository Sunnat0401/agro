"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Home, MessageSquare, ShoppingBag, ShoppingCart, User, Stethoscope, Bell, Tractor } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const { t } = useLanguage()
  const { totalItems } = useCart()
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  const [appointmentsCount, setAppointmentsCount] = useState(0)
  const [hasNewMessage, setHasNewMessage] = useState(false)

  useEffect(() => {
    if (isAuthenticated && typeof window !== "undefined") {
      const savedAppointments = localStorage.getItem("agromind-appointments")
      if (savedAppointments) {
        try {
          const appointments = JSON.parse(savedAppointments)
          setAppointmentsCount(appointments.length)
          const pendingWithMessage = appointments.filter(
            (apt: any) => apt.hasMessage && apt.status === "pending"
          )
          setHasNewMessage(pendingWithMessage.length > 0)
        } catch {
          // ignore
        }
      }
    }
  }, [isAuthenticated, pathname])

  const navItems = [
    { href: "/", icon: Home, label: t("nav.home") },
    { href: "/chat", icon: MessageSquare, label: t("nav.chat") },
    { href: "/market", icon: ShoppingBag, label: t("nav.market") },
    { href: "/specialists", icon: Stethoscope, label: t("nav.specialists") },
    { href: "/farmers", icon: Tractor, label: t("nav.farmers") },
    { href: "/cart", icon: ShoppingCart, label: t("nav.cart"), badge: totalItems },
    {
      href: "/profile",
      icon: User,
      label: t("nav.profile"),
      badge: appointmentsCount,
      hasNewMessage,
    },
  ]

  // Hide on auth pages
  if (pathname.startsWith("/auth")) {
    return null
  }

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-lg md:hidden"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                className={cn(
                  "flex flex-col items-center gap-1 py-2",
                  isActive ? "text-green-600" : "text-muted-foreground",
                )}
                whileTap={{ scale: 0.9 }}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {item.hasNewMessage && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
                    >
                      !
                    </motion.span>
                  )}
                  {item.badge !== undefined && item.badge > 0 && !item.hasNewMessage && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}
