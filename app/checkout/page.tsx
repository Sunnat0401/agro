"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPrice, formatCardNumber, formatExpiryDate, validateCardNumber, isValidUzbekCard } from "@/utils/format"
import productsData from "@/data/products.json"
import officesData from "@/data/offices.json"
import {
  Truck,
  CreditCard,
  Banknote,
  Calendar,
  Clock,
  CheckCircle,
  Building2,
  ArrowLeft,
  AlertCircle,
  X,
} from "lucide-react"
import Link from "next/link"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const MapClickHandler = dynamic(
  () => import("@/components/map/map-click-handler").then((mod) => ({ default: mod.MapClickHandler })),
  { ssr: false },
)

type DeliveryMethod = "office" | "courier"
type PaymentMethod = "card" | "cash" | "installment"
type DeliveryTime = "1hour" | "24hours"

interface Office {
  id: string
  name: { uz: string; ru: string; en: string }
  address: { uz: string; ru: string; en: string }
  coordinates: [number, number]
  phone: string
  workingHours: string
  images: string[]
}

const COURIER_PRICES = {
  "1hour": 25000,
  "24hours": 10000,
}

export default function CheckoutPage() {
  const { isAuthenticated, setRedirectTo, phone: userPhone, firstName, lastName } = useAuth()
  const { t, language } = useLanguage()
  const { items, clearCart } = useCart()
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<"checkout" | "success">("checkout")
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("office")
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [deliveryCoords, setDeliveryCoords] = useState<[number, number] | null>(null)
  const [deliveryTime, setDeliveryTime] = useState<DeliveryTime | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardError, setCardError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [customIcon, setCustomIcon] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        import("leaflet/dist/leaflet.css")
        const icon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })
        setCustomIcon(icon)
        setLeafletLoaded(true)
      })
    }
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      setRedirectTo("/checkout")
      router.push("/auth/login")
    }
  }, [mounted, isAuthenticated, router, setRedirectTo])

  useEffect(() => {
    if (mounted && items.length === 0 && step !== "success") {
      router.push("/cart")
    }
  }, [mounted, items, step, router])

  const cartProducts = items
    .map((item) => {
      const product = productsData.products.find((p) => p.id === item.id)
      return product ? { ...product, quantity: item.quantity } : null
    })
    .filter(Boolean) as ((typeof productsData.products)[0] & { quantity: number })[]

  const subtotal = cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0)
  const deliveryPrice = deliveryMethod === "courier" && deliveryTime ? COURIER_PRICES[deliveryTime] : 0
  const totalPrice = subtotal + deliveryPrice
  const monthlyPayment = Math.ceil(totalPrice / 3)

  const canPlaceOrder =
    (deliveryMethod === "office" && selectedOffice) || (deliveryMethod === "courier" && deliveryAddress && deliveryTime)

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value)
    setCardNumber(formatted)
    setCardError("")
  }

  const validateCard = (): boolean => {
    const digits = cardNumber.replace(/\D/g, "")

    if (digits.length !== 16) {
      setCardError("Karta raqami 16 ta raqamdan iborat bo'lishi kerak")
      return false
    }

    if (!isValidUzbekCard(cardNumber)) {
      setCardError("Bunday karta mavjud emas. Humo (9860) yoki UzCard (8600) kartasini kiriting")
      return false
    }

    if (!validateCardNumber(cardNumber)) {
      setCardError("Karta raqami noto'g'ri. Tekshirib qaytadan kiriting")
      return false
    }

    if (!expiryDate || expiryDate.length < 5) {
      setCardError("Amal qilish muddatini kiriting")
      return false
    }

    if (!cvv || cvv.length < 3) {
      setCardError("CVV kodini kiriting")
      return false
    }

    return true
  }

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) return

    if (paymentMethod === "card" || paymentMethod === "installment") {
      if (!validateCard()) return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const orderNum = `AGM-${Date.now().toString(36).toUpperCase()}`
    setOrderNumber(orderNum)

    const order = {
      orderNumber: orderNum,
      items: cartProducts,
      total: totalPrice,
      deliveryMethod,
      deliveryPrice,
      selectedOffice: selectedOffice
        ? {
            id: selectedOffice.id,
            name: selectedOffice.name[language],
            address: selectedOffice.address[language],
          }
        : null,
      deliveryAddress,
      deliveryCoords,
      deliveryTime,
      paymentMethod,
      phone: userPhone,
      customerName: `${firstName} ${lastName}`,
      createdAt: new Date().toISOString(),
    }

    const orders = JSON.parse(localStorage.getItem("agromind-orders") || "[]")
    orders.unshift(order)
    localStorage.setItem("agromind-orders", JSON.stringify(orders))

    clearCart()
    setIsProcessing(false)
    setStep("success")
  }

  if (!mounted || !isAuthenticated) {
    return null
  }

  // Success screen
  if (step === "success") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex flex-1 items-center justify-center px-4 pb-24 pt-4 md:pb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center"
          >
            <Card className="border-0 shadow-xl">
              <CardContent className="py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
                >
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-foreground"
                >
                  {t("checkout.orderPlaced")}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-2 text-muted-foreground"
                >
                  {t("checkout.orderNumber")}: <span className="font-bold text-green-600">{orderNumber}</span>
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 space-y-3"
                >
                  <Link href="/market">
                    <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
                      {t("market.continueShopping")}
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline" className="w-full bg-transparent">
                      {t("nav.profile")}
                    </Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
        <MobileNav />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="container mx-auto flex-1 px-4 pb-24 pt-4 md:pb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-4">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-2xl font-bold text-foreground"
        >
          {t("checkout.title")}
        </motion.h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Delivery Type Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    <h2 className="font-semibold text-foreground">{t("checkout.deliveryType")}</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setDeliveryMethod("office")
                        setDeliveryAddress("")
                        setDeliveryCoords(null)
                        setDeliveryTime(null)
                      }}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        deliveryMethod === "office"
                          ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                          : "border-border hover:border-green-300"
                      }`}
                    >
                      <Building2
                        className={`h-6 w-6 ${deliveryMethod === "office" ? "text-green-600" : "text-muted-foreground"}`}
                      />
                      <span className="text-sm font-medium">{t("checkout.officePickup")}</span>
                      <span className="text-xs font-semibold text-green-600">{t("common.free")}</span>
                    </button>

                    <button
                      onClick={() => {
                        setDeliveryMethod("courier")
                        setSelectedOffice(null)
                      }}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        deliveryMethod === "courier"
                          ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                          : "border-border hover:border-green-300"
                      }`}
                    >
                      <Truck
                        className={`h-6 w-6 ${deliveryMethod === "courier" ? "text-green-600" : "text-muted-foreground"}`}
                      />
                      <span className="text-sm font-medium">{t("checkout.courierDelivery")}</span>
                      <span className="text-xs text-muted-foreground">
                        {t("common.from")} {formatPrice(COURIER_PRICES["24hours"])}
                      </span>
                    </button>
                  </div>

                  {/* Office Selection */}
                  <AnimatePresence>
                    {deliveryMethod === "office" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 overflow-hidden"
                      >
                        <p className="mb-3 text-sm text-muted-foreground">{t("checkout.selectOffice")}:</p>

                        {selectedOffice && (
                          <div className="mb-4 flex items-center justify-between rounded-lg bg-green-100 px-4 py-3 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <span>
                              {t("checkout.selected")}: {selectedOffice.name[language]}
                            </span>
                            <button onClick={() => setSelectedOffice(null)}>
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}

                        {leafletLoaded && customIcon && (
                          <div className="h-[350px] overflow-hidden rounded-xl border">
                            <MapContainer
                              center={[41.311081, 69.279737]}
                              zoom={6}
                              style={{ height: "100%", width: "100%" }}
                              scrollWheelZoom={false}
                            >
                              <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              {(officesData.offices as Office[]).map((office) => (
                                <Marker
                                  key={office.id}
                                  position={office.coordinates}
                                  icon={customIcon}
                                  eventHandlers={{
                                    click: () => setSelectedOffice(office),
                                  }}
                                >
                                  <Popup>
                                    <div className="w-[260px]">
                                      <h3 className="mb-1 text-lg font-bold">{office.name[language]}</h3>
                                      <p className="mb-3 text-sm text-muted-foreground">{office.address[language]}</p>
                                      <div className="relative mb-3 h-[130px] overflow-hidden rounded-lg">
                                        <Image
                                          src={`/.jpg?height=130&width=260&query=${office.name.en} modern office interior`}
                                          alt={office.name[language]}
                                          fill
                                          className="object-cover"
                                        />
                                        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                                          {[0, 1, 2].map((idx) => (
                                            <div
                                              key={idx}
                                              className={`h-2 w-2 rounded-full ${idx === 0 ? "bg-white" : "bg-white/50"}`}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                      <Button
                                        size="sm"
                                        className={`w-full ${
                                          selectedOffice?.id === office.id
                                            ? "bg-green-600"
                                            : "bg-green-600 hover:bg-green-700"
                                        }`}
                                        onClick={() => setSelectedOffice(office)}
                                      >
                                        {selectedOffice?.id === office.id
                                          ? t("checkout.selected")
                                          : t("checkout.selectOffice")}
                                      </Button>
                                    </div>
                                  </Popup>
                                </Marker>
                              ))}
                            </MapContainer>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Courier Delivery Options */}
                  <AnimatePresence>
                    {deliveryMethod === "courier" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 space-y-4 overflow-hidden"
                      >
                        {/* Delivery Time Selection - Required */}
                        <div>
                          <p className="mb-3 text-sm font-medium text-foreground">
                            {t("checkout.deliveryTime")} <span className="text-red-500">*</span>
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => setDeliveryTime("1hour")}
                              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                                deliveryTime === "1hour"
                                  ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                                  : "border-border hover:border-green-300"
                              }`}
                            >
                              <Clock
                                className={`h-6 w-6 ${deliveryTime === "1hour" ? "text-green-600" : "text-muted-foreground"}`}
                              />
                              <span className="text-sm font-medium">{t("checkout.oneHour")}</span>
                              <span className="text-sm font-bold text-green-600">
                                {formatPrice(COURIER_PRICES["1hour"])}
                              </span>
                            </button>
                            <button
                              onClick={() => setDeliveryTime("24hours")}
                              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                                deliveryTime === "24hours"
                                  ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                                  : "border-border hover:border-green-300"
                              }`}
                            >
                              <Calendar
                                className={`h-6 w-6 ${deliveryTime === "24hours" ? "text-green-600" : "text-muted-foreground"}`}
                              />
                              <span className="text-sm font-medium">{t("checkout.twentyFourHours")}</span>
                              <span className="text-sm font-bold text-green-600">
                                {formatPrice(COURIER_PRICES["24hours"])}
                              </span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="address" className="mb-2 block text-sm">
                            {t("checkout.deliveryAddress")} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="address"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder={t("checkout.enterAddress")}
                            className="bg-transparent"
                          />
                        </div>

                        {leafletLoaded && customIcon && (
                          <div className="h-[200px] overflow-hidden rounded-xl border">
                            <MapContainer
                              center={[41.311081, 69.279737]}
                              zoom={12}
                              style={{ height: "100%", width: "100%" }}
                            >
                              <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              {deliveryCoords && <Marker position={deliveryCoords} icon={customIcon} />}
                              <MapClickHandler
                                onMapClick={(coords: [number, number]) => {
                                  setDeliveryCoords(coords)
                                  setDeliveryAddress(
                                    `Tanlangan manzil: ${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`,
                                  )
                                }}
                              />
                            </MapContainer>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Type Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <h2 className="font-semibold text-foreground">{t("checkout.paymentType")}</h2>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        paymentMethod === "card"
                          ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                          : "border-border hover:border-green-300"
                      }`}
                    >
                      <CreditCard
                        className={`h-6 w-6 ${paymentMethod === "card" ? "text-green-600" : "text-muted-foreground"}`}
                      />
                      <span className="text-sm font-medium">{t("checkout.card")}</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("cash")}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        paymentMethod === "cash"
                          ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                          : "border-border hover:border-green-300"
                      }`}
                    >
                      <Banknote
                        className={`h-6 w-6 ${paymentMethod === "cash" ? "text-green-600" : "text-muted-foreground"}`}
                      />
                      <span className="text-sm font-medium">{t("checkout.cash")}</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("installment")}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        paymentMethod === "installment"
                          ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                          : "border-border hover:border-green-300"
                      }`}
                    >
                      <Calendar
                        className={`h-6 w-6 ${paymentMethod === "installment" ? "text-green-600" : "text-muted-foreground"}`}
                      />
                      <span className="text-sm font-medium">{t("checkout.installment")}</span>
                      <span className="text-xs text-green-600">{t("checkout.installmentInfo")}</span>
                    </button>
                  </div>

                  {/* Installment Plan Details */}
                  <AnimatePresence>
                    {paymentMethod === "installment" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                          <h3 className="mb-3 font-semibold text-green-700 dark:text-green-400">
                            {t("checkout.installmentPlan")}
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-background">
                              <span className="text-sm">1{t("checkout.monthToday")}</span>
                              <span className="font-bold">{formatPrice(monthlyPayment)}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-background">
                              <span className="text-sm">2{t("checkout.month")}</span>
                              <span className="font-bold">{formatPrice(monthlyPayment)}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-background">
                              <span className="text-sm">3{t("checkout.month")}</span>
                              <span className="font-bold">{formatPrice(monthlyPayment)}</span>
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-green-600">
                            Jami: {formatPrice(totalPrice)} ({t("checkout.noExtraCharge")})
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Card Details Form */}
                  <AnimatePresence>
                    {(paymentMethod === "card" || paymentMethod === "installment") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-4 overflow-hidden"
                      >
                        <div>
                          <Label htmlFor="cardNumber" className="mb-2 block text-sm">
                            {t("checkout.cardNumber")}
                          </Label>
                          <Input
                            id="cardNumber"
                            value={cardNumber}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            placeholder="8600 0000 0000 0000"
                            maxLength={19}
                            className={`bg-transparent text-lg tracking-wider ${cardError ? "border-red-500" : ""}`}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry" className="mb-2 block text-sm">
                              {t("checkout.expiryDate")}
                            </Label>
                            <Input
                              id="expiry"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="bg-transparent"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv" className="mb-2 block text-sm">
                              {t("checkout.cvv")}
                            </Label>
                            <Input
                              id="cvv"
                              type="password"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                              placeholder="***"
                              maxLength={3}
                              className="bg-transparent"
                            />
                          </div>
                        </div>

                        {/* Card Error Message */}
                        {cardError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20"
                          >
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {cardError}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-bold">{t("checkout.orderSummary")}</h2>

                  {/* Cart Items Preview */}
                  <div className="mb-4 max-h-[200px] space-y-3 overflow-y-auto">
                    {cartProducts.map((product) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-secondary">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name[language]}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                            {product.quantity}
                          </div>
                        </div>
                        <div className="flex-1 truncate">
                          <p className="truncate text-sm font-medium">{product.name[language]}</p>
                          <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("checkout.items")} ({items.reduce((sum, i) => sum + i.quantity, 0)})
                      </span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("checkout.delivery")}</span>
                      <span className={deliveryPrice === 0 ? "text-green-600" : ""}>
                        {deliveryPrice === 0 ? t("common.free") : formatPrice(deliveryPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-3 text-lg font-bold">
                      <span>{t("market.total")}</span>
                      <span className="text-green-600">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={!canPlaceOrder || isProcessing}
                    className="mt-6 h-14 w-full gap-2 bg-green-600 text-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                        />
                        {t("common.loading")}
                      </>
                    ) : (
                      t("checkout.payNow")
                    )}
                  </Button>

                  {!canPlaceOrder && (
                    <p className="mt-3 text-center text-sm text-amber-600">
                      {deliveryMethod === "office"
                        ? "Ofisni tanlang"
                        : !deliveryTime
                          ? "Yetkazib berish vaqtini tanlang"
                          : "Manzilni kiriting"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
