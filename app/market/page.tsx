
"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ProductCard } from "@/components/market/product-card"
import { CategoryFilter } from "@/components/market/category-filter"
import { SearchBar } from "@/components/market/search-bar"
import productsData from "@/data/products.json"
import { ShoppingBag } from "lucide-react"

export default function MarketPage() {
  const { isAuthenticated } = useAuth()
  const { t, language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showHeader, setShowHeader] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Bosh sahifada Header ni ko'rsatmaslik uchun useEffect
  useEffect(() => {
    if (pathname === "/") {
      setShowHeader(false)
    } else {
      setShowHeader(true)
    }
  }, [pathname])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router, mounted])

  const filteredProducts = useMemo(() => {
    return productsData.products.filter((product) => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory
      const matchesSearch =
        !searchQuery ||
        product.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description[language].toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery, language])

  if (!mounted || !isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header faqat bosh sahifa emasligida ko'rinadi */}
      {showHeader && <Header />}

      <main className="container mx-auto flex-1 px-4 pb-24 pt-4 md:pb-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("market.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} {t("market.allProducts").toLowerCase()}
            </p>
          </div>
        </motion.div>

        {/* Search */}
        <div className="mb-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Categories */}
        <div className="mb-6">
          <CategoryFilter
            categories={productsData.categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
       <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">{t("common.noResults")}</p>
          </motion.div>
        )}
      </main>

      <MobileNav />
    </div>
  )
}