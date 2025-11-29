// "use client"

// import { motion } from "framer-motion"
// import Link from "next/link"
// import { usePathname, useRouter } from "next/navigation"
// import { useState, useEffect } from "react"
// import { LanguageSwitcher } from "@/components/ui/language-switcher"
// import { ThemeToggle } from "@/components/ui/theme-toggle"
// import { Button } from "@/components/ui/button"
// import { useLanguage } from "@/contexts/language-context"
// import { useCart } from "@/contexts/cart-context"
// import { useAuth } from "@/contexts/auth-context"
// import { Home, MessageSquare, ShoppingBag, ShoppingCart, User, Leaf, LogOut, Stethoscope, Bell, Tractor } from "lucide-react"
// import { cn } from "@/lib/utils"

// export function Header() {
//   const { t } = useLanguage()
//   const { totalItems } = useCart()
//   const { isAuthenticated, logout } = useAuth()
//   const pathname = usePathname()
//   const router = useRouter()
//   const [appointmentsCount, setAppointmentsCount] = useState(0)
//   const [hasNewMessage, setHasNewMessage] = useState(false)

//   useEffect(() => {
//     if (isAuthenticated && typeof window !== "undefined") {
//       const savedAppointments = localStorage.getItem("agromind-appointments")
//       if (savedAppointments) {
//         try {
//           const appointments = JSON.parse(savedAppointments)
//           setAppointmentsCount(appointments.length)
//           const pendingWithMessage = appointments.filter(
//             (apt: any) => apt.hasMessage && apt.status === "pending"
//           )
//           setHasNewMessage(pendingWithMessage.length > 0)
//         } catch {
//           // ignore
//         }
//       }
//     }
//   }, [isAuthenticated, pathname])

//   const navItems = [
//     // { href: "/",  label: t("nav.home") },
//     { href: "/chat", icon: MessageSquare, label: t("nav.chat") },
//     { href: "/market", icon: ShoppingBag, label: t("nav.market") },
//     { href: "/specialists", icon: Stethoscope, label: t("nav.specialists") },
//     { href: "/farmers", icon: Tractor, label: t("nav.farmers") },
//     { href: "/cart", icon: ShoppingCart, label: t("nav.cart"), badge: totalItems },
//   ]

//   const handleLogout = () => {
//     logout()
//     router.push("/auth/login")
//   }

//   return (
//     <motion.header
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg"
//     >
//       <div className="container mx-auto flex h-16 items-center justify-between px-4">
//         <div className="flex items-center gap-4">
  

//           <Link href="/" className="flex items-center gap-2">
//             <motion.div
//               whileHover={{ rotate: 360 }}
//               transition={{ duration: 0.5 }}
//               className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white"
//             >
//               <Leaf className="h-6 w-6" />
//             </motion.div>
//             <span className="text-xl font-bold text-foreground">{t("common.appName")}</span>
//           </Link>
//         </div>

//         <nav className="hidden items-center gap-1 md:flex">
//           {navItems.map((item) => {
//             const isActive = pathname === item.href
//             return (
//               <Link key={item.href} href={item.href}>
//                 <motion.div
//                   className={cn(
//                     "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
//                     isActive ? "text-green-600" : "text-muted-foreground hover:text-foreground",
//                   )}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   {isActive && (
//                     <motion.div
//                       layoutId="nav-indicator"
//                       className="absolute inset-0 rounded-lg bg-green-600/10"
//                       transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//                     />
//                   )}
//                   <item.icon className="relative z-10 h-4 w-4" />
//                   <span className="relative z-10">{item.label}</span>
//                   {item.badge !== undefined && item.badge > 0 && (
//                     <motion.span
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white"
//                     >
//                       {item.badge}
//                     </motion.span>
//                   )}
//                 </motion.div>
//               </Link>
//             )
//           })}
//         </nav>

//         <div className="flex items-center gap-2">
//           <LanguageSwitcher />
//           <ThemeToggle />
       
//                   {isAuthenticated && (
//             <Link href="/profile">
//               <motion.div
//                 className={cn(
//                   "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors",
//                   pathname === "/profile"
//                     ? "bg-green-600 text-white"
//                     : "bg-secondary text-muted-foreground hover:bg-green-100 hover:text-green-600",
//                 )}
//                 whileTap={{ scale: 0.9 }}
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <User className="h-5 w-5" />
//                 {hasNewMessage && (
//                   <motion.span
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
//                   >
//                     !
//                   </motion.span>
//                 )}
//                 {appointmentsCount > 0 && !hasNewMessage && (
//                   <motion.span
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white"
//                   >
//                     {appointmentsCount}
//                   </motion.span>
//                 )}
//               </motion.div>
//             </Link>
//           )}
//         </div>
//       </div>
//     </motion.header>
//   )
// }
"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { MessageSquare, ShoppingBag, ShoppingCart, User, Leaf, Stethoscope, Tractor } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const { t } = useLanguage()
  const { totalItems } = useCart()
  const { isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [appointmentsCount, setAppointmentsCount] = useState(0)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Ekran o'lchamini kuzatish
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    if (typeof window !== "undefined") {
      checkScreenSize()
      window.addEventListener('resize', checkScreenSize)
      return () => window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

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
    { href: "/chat", icon: MessageSquare, label: t("nav.chat") },
    { href: "/market", icon: ShoppingBag, label: t("nav.market") },
    { href: "/specialists", icon: Stethoscope, label: t("nav.specialists") },
    { href: "/farmers", icon: Tractor, label: t("nav.farmers") },
    { href: "/cart", icon: ShoppingCart, label: t("nav.cart"), badge: totalItems },
  ]

  const profileItem = {
    href: "/profile", 
    icon: User, 
    label: t("nav.profile"), 
    badge: hasNewMessage ? "!" : appointmentsCount > 0 ? appointmentsCount : undefined 
  }

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo - faqat 1024px+ da ko'rinadi */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white"
              >
                <Leaf className="h-6 w-6" />
              </motion.div>
              <span className="text-xl font-bold text-foreground lg:inline">
                {t("common.appName")}
              </span>
            </Link>
          </div>

          {/* Desktop navigation - faqat 1024px+ da ko'rinadi */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-green-600" : "text-muted-foreground hover:text-foreground",
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg bg-green-600/10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <item.icon className="relative z-10 h-4 w-4" />
                    <span className="relative z-10">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white"
                        >
                          {item.badge}
                        </motion.span>
                      )}
                  </motion.div>
                </Link>
              )
            })}
          </nav>

          {/* Controls - Theme va Language har doim ko'rinadi, Profile faqat 1024px+ da */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
           
            {/* Profile faqat 1024px dan katta ekranlarda headerga */}
            {isAuthenticated && !isMobile && (
              <Link href="/profile">
                <motion.div
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                    pathname === "/profile"
                      ? "bg-green-600 text-white"
                      : "bg-secondary text-muted-foreground hover:bg-green-100 hover:text-green-600",
                  )}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <User className="h-5 w-5" />
                  {hasNewMessage && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                    >
                      !
                    </motion.span>
                  )}
                  {appointmentsCount > 0 && !hasNewMessage && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white"
                    >
                      {appointmentsCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            )}
          </div>
        </div>
      </motion.header>

      {/* Bottom Navigation Bar - 1024px dan kichik ekranlarda */}
      {isMobile && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-lg lg:hidden"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-around py-3">
              {[...navItems, profileItem].map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} className="flex-1">
                    <motion.div
                      className={cn(
                        "relative flex flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium transition-colors",
                        isActive ? "text-green-600" : "text-muted-foreground hover:text-foreground",
                      )}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="relative">
                        <item.icon className="h-5 w-5" />
                        {item.badge !== undefined && item.badge > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={cn(
                              "absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white",
                              item.badge === "!" 
                                ? "bg-red-500" 
                                : "bg-green-600"
                            )}
                          >
                            {item.badge}
                          </motion.span>
                        )}
                      </div>
                      <span className="text-[10px]">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="bottom-nav-indicator"
                          className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-green-600"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </>
  )
}