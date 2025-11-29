"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/utils/format"
import productsData from "@/data/products.json"
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, UserPlus } from "lucide-react"

export default function CartPage() {
  const { isAuthenticated, setRedirectTo } = useAuth()
  const { t, language } = useLanguage()
  const { items, updateQuantity, removeItem, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const cartProducts = items
    .map((item) => {
      const product = productsData.products.find((p) => p.id === item.id)
      return product ? { ...product, quantity: item.quantity } : null
    })
    .filter(Boolean) as ((typeof productsData.products)[0] & { quantity: number })[]

  const totalPrice = cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0)

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setRedirectTo("/checkout")
      router.push("/auth/login")
    } else {
      router.push("/checkout")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="container mx-auto flex-1 px-4 pb-24 pt-4 md:pb-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t("nav.cart")}</h1>
              <p className="text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </motion.div>

        {items.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              <AnimatePresence mode="popLayout">
                {cartProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card>
                      <CardContent className="flex gap-4 p-4">
                        {/* Product Image */}
                        <Link href={`/market/${product.id}`}>
                          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name[language]}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>

                        {/* Product Info */}
                        <div className="flex flex-1 flex-col">
                          <Link href={`/market/${product.id}`}>
                            <h3 className="font-semibold text-foreground hover:text-green-600">
                              {product.name[language]}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-1">{product.description[language]}</p>
                          <div className="mt-auto flex items-center justify-between">
                            <span className="font-bold text-green-600">
                              {formatPrice(product.price * product.quantity)}
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center rounded-lg border border-border">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                  className="h-8 w-8 rounded-r-none"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="flex h-8 w-10 items-center justify-center text-sm font-medium">
                                  {product.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                  className="h-8 w-8 rounded-l-none"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(product.id)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-bold text-foreground">{t("market.total")}</h2>

                  <div className="space-y-3 border-b border-border pb-4">
                    {cartProducts.map((product) => (
                      <div key={product.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {product.name[language]} x{product.quantity}
                        </span>
                        <span className="font-medium">{formatPrice(product.price * product.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-between text-lg font-bold">
                    <span>{t("market.total")}</span>
                    <span className="text-green-600">{formatPrice(totalPrice)}</span>
                  </div>

                  {!isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 text-center"
                    >
                      <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-400">
                        <UserPlus className="h-4 w-4" />
                        <span className="text-sm font-medium">{t("checkout.loginRequired")}</span>
                      </div>
                    </motion.div>
                  )}

                  <motion.div whileTap={{ scale: 0.98 }} className="mt-6">
                    <Button
                      onClick={handleCheckout}
                      className="h-14 w-full gap-2 bg-green-600 text-lg hover:bg-green-700"
                    >
                      {!isAuthenticated ? t("auth.login") : t("market.checkout")}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">{t("market.emptyCart")}</h2>
            <p className="mb-6 text-muted-foreground">{t("market.continueShopping")}</p>
            <Link href="/market">
                <Button className="gap-2 bg-green-600 hover:bg-green-700">
                  <ShoppingBag className="h-4 w-4" />
                  {t("nav.market")}
                </Button>
            </Link>
          </motion.div>
        )}
      </main>

      <MobileNav />
    </div>
  )
}
