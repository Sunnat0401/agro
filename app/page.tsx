"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, ShoppingBag, Leaf, Sparkles, ArrowRight, Stethoscope, Tractor } from "lucide-react"
import Link from "next/link"
import MarketPage from "./market/page"

export default function HomePage() {
  const { isAuthenticated, step } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated && step !== "home") {
      router.push("/auth/login")
    }
  }, [isAuthenticated, step, router])

  if (!isAuthenticated) {
    return null
  }

  const features = [
    {
      icon: MessageSquare,
      title: t("nav.chat"),
      description: t("chat.subtitle"),
      href: "/chat",
      color: "bg-green-600",
    },
    {
      icon: ShoppingBag,
      title: t("nav.market"),
      description: t("market.allProducts"),
      href: "/market",
      color: "bg-emerald-600",
    },
    {
      icon: Stethoscope,
      title: t("nav.specialists"),
      description: t("specialists.subtitle"),
      href: "/specialists",
      color: "bg-blue-600",
    },
    {
      icon: Tractor,
      title: t("nav.farmers"),
      description: t("farmers.subtitle"),
      href: "/farmers",
      color: "bg-amber-600",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pb-24 pt-8 md:pb-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-emerald-700 p-8 text-white md:p-12"
        >
          <div className="relative z-10 max-w-2xl 
          ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Agriculture</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4 text-balance text-3xl font-bold md:text-5xl"
            >
              {t("common.welcome")} {t("common.appName")}!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-pretty text-lg text-white/90"
            >
              {t("chat.subtitle")}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Link href="/chat">
                <Button size="lg" className="gap-2 bg-white text-green-700 hover:bg-white/90">
                  {t("nav.chat")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-white/10"
          />
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute bottom-4 right-4 md:bottom-8 md:right-8"
          >
            <Leaf className="h-24 w-24 text-white/20 md:h-40 md:w-40" />
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Link href={feature.href}>
                <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
                  <CardContent className="flex items-center gap-6 p-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${feature.color} text-white shadow-lg`}
                    >
                      <feature.icon className="h-8 w-8" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="mb-1 text-xl font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.section>

        {/* Quick Stats */}
        {/* <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {[
            { value: "500+", label: "Products" },
            { value: "24/7", label: "AI Support" },
            { value: "5", label: "Offices" },
            { value: "1hr", label: "Delivery" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-green-600 md:text-3xl">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.section> */}
        <MarketPage/>
      </main>
      <MobileNav />
    </div>
  )
}
