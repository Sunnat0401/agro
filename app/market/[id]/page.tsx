"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { useSaved } from "@/contexts/saved-context"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ProductCard } from "@/components/market/product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/utils/format"
import productsData from "@/data/products.json"
import { ArrowLeft, Star, ShoppingCart, Check, Plus, Minus, Heart } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { isAuthenticated } = useAuth()
  const { t, language } = useLanguage()
  const { addItem, getItemQuantity, updateQuantity } = useCart()
  const { isSaved, toggleSaved } = useSaved()
  const [mounted, setMounted] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const router = useRouter()

  const product = productsData.products.find((p) => p.id === id)
  const quantity = getItemQuantity(id)
  const saved = isSaved(id)

  const relatedProducts = productsData.products
    .filter((p) => p.id !== id && p.category === product?.category)
    .slice(0, 4)

  const youMayLike = productsData.products.filter((p) => p.id !== id && p.category !== product?.category).slice(0, 4)

  // Generate multiple images for demo
  const images = product
    ? [
        product.image,
        `/placeholder.svg?height=400&width=400&query=${product.name.en} detail`,
        `/placeholder.svg?height=400&width=400&query=${product.name.en} packaging`,
      ]
    : []

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router, mounted])

  if (!mounted || !isAuthenticated) {
    return null
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex flex-1 items-center justify-center px-4">
          <p className="text-lg text-muted-foreground">{t("common.noResults")}</p>
        </main>
        <MobileNav />
      </div>
    )
  }

  const category = productsData.categories.find((c) => c.id === product.category)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="container mx-auto flex-1 px-4 pb-24 pt-4 md:pb-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-4">
          <Link
            href="/market"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Link>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={images[activeImage] || "/placeholder.svg"}
                        alt={product.name[language]}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                  {!product.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <span className="rounded-full bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground">
                        {t("market.outOfStock")}
                      </span>
                    </div>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleSaved(product.id)}
                    className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                      saved
                        ? "bg-red-500 text-white"
                        : "bg-white/80 text-muted-foreground hover:bg-white hover:text-red-500"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
                  </motion.button>
                </div>
              </CardContent>
            </Card>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {images.map((img, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-square w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === index ? "border-green-600" : "border-transparent"
                  }`}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`${product.name[language]} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Category & Rating */}
            <div className="flex items-center gap-4">
              {category && (
                <span className="rounded-full bg-green-600/10 px-3 py-1 text-sm font-medium text-green-600">
                  {category.icon} {category.name[language]}
                </span>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">{product.name[language]}</h1>

            {/* Description */}
            <p className="text-muted-foreground">{product.description[language]}</p>

            {/* Price */}
            <div className="text-3xl font-bold text-green-600">{formatPrice(product.price)}</div>

            {/* Add to Cart */}
            {quantity > 0 ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl border border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(id, quantity - 1)}
                    className="h-12 w-12 rounded-r-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="flex h-12 w-16 items-center justify-center text-lg font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(id, quantity + 1)}
                    className="h-12 w-12 rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Link href="/cart" className="flex-1">
                  <Button className="h-12 w-full gap-2 bg-green-600 text-lg hover:bg-green-700">
                    <Check className="h-5 w-5" />
                    {t("market.inCart")}
                  </Button>
                </Link>
              </div>
            ) : (
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => addItem(id)}
                  disabled={!product.inStock}
                  className="h-14 w-full gap-2 bg-green-600 text-lg hover:bg-green-700"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {t("market.addToCart")}
                </Button>
              </motion.div>
            )}

            {/* Product Features */}
            <Card>
              <CardContent className="grid grid-cols-2 gap-4 p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{t("market.categories")}</p>
                  <p className="font-medium">{category?.name[language]}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{t("market.quantity")}</p>
                  <p className={`font-medium ${product.inStock ? "text-green-600" : "text-destructive"}`}>
                    {product.inStock ? t("market.inCart") : t("market.outOfStock")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="mb-6 text-xl font-bold text-foreground">{t("market.relatedProducts")}</h2>
            <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.section>
        )}

        {youMayLike.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="mb-6 text-xl font-bold text-foreground">{t("market.youMayAlsoLike")}</h2>
            <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {youMayLike.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.section>
        )}
      </main>

      <MobileNav />
    </div>
  )
}
