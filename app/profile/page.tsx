"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useSaved } from "@/contexts/saved-context"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatPhoneNumber } from "@/utils/format"
import productsData from "@/data/products.json"
import {
  User,
  Package,
  Heart,
  Phone,
  LogOut,
  ChevronRight,
  Settings,
  Edit,
  X,
  Check,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  Calendar,
  MessageSquare,
  MapPin,
  Clock,
  Building2,
  Video,
  Bell,
} from "lucide-react"

interface Order {
  orderNumber: string
  items: Array<{
    id: string
    name: { uz: string; ru: string; en: string }
    price: number
    quantity: number
    image: string
  }>
  total: number
  deliveryMethod: string
  paymentMethod: string
  createdAt: string
}

type PhoneEditStep = "phone" | "sms" | "password"

export default function ProfilePage() {
  const {
    isAuthenticated,
    phone,
    firstName,
    lastName,
    logout,
    setRedirectTo,
    generateSmsCode,
    verifyCode,
    updatePhone,
    updateName,
    updatePassword,
  } = useAuth()
  const { t, language } = useLanguage()
  const { savedItems, removeSaved } = useSaved()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("data")

  const [showNameModal, setShowNameModal] = useState(false)
  const [editFirstName, setEditFirstName] = useState("")
  const [editLastName, setEditLastName] = useState("")

  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [phoneEditStep, setPhoneEditStep] = useState<PhoneEditStep>("phone")
  const [newPhone, setNewPhone] = useState("")
  const [smsCode, setSmsCode] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [smsInputs, setSmsInputs] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const smsInputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    setMounted(true)
    const savedOrders = localStorage.getItem("agromind-orders")
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch {
        console.error("Failed to parse orders")
      }
    }

    const savedAppointments = localStorage.getItem("agromind-appointments")
    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments))
      } catch {
        console.error("Failed to parse appointments")
      }
    }
  }, [])

  // Update appointments when tab changes to refresh data
  useEffect(() => {
    if (activeTab === "appointments") {
      const savedAppointments = localStorage.getItem("agromind-appointments")
      if (savedAppointments) {
        try {
          setAppointments(JSON.parse(savedAppointments))
        } catch {
          console.error("Failed to parse appointments")
        }
      }
    }
  }, [activeTab])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      setRedirectTo("/profile")
      router.push("/auth/login")
    }
  }, [mounted, isAuthenticated, router, setRedirectTo])

  useEffect(() => {
    if (phoneEditStep === "sms" && generatedCode) {
      const timer = setTimeout(() => {
        const codeArray = generatedCode.split("")
        setSmsInputs(codeArray)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [phoneEditStep, generatedCode])

  const savedProducts = productsData.products.filter((p) => savedItems.includes(p.id))

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 9) {
      setNewPhone(formatPhoneNumber(digits))
      // Auto-advance to SMS step when 9 digits entered
      if (digits.length === 9) {
        setTimeout(() => {
          const code = generateSmsCode()
          setGeneratedCode(code)
          setPhoneEditStep("sms")
        }, 300)
      }
    }
  }

  const handleSmsChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]
    }
    if (!/^\d*$/.test(value)) return

    const newInputs = [...smsInputs]
    newInputs[index] = value
    setSmsInputs(newInputs)

    // Auto-focus next input
    if (value && index < 5) {
      smsInputRefs.current[index + 1]?.focus()
    }
  }

  const handleSmsKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !smsInputs[index] && index > 0) {
      smsInputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifySms = () => {
    const enteredCode = smsInputs.join("")
    if (verifyCode(enteredCode)) {
      setPhoneEditStep("password")
    }
  }

  const handleConfirmPassword = () => {
    if (newPassword.length < 4) {
      setPasswordError("Parol kamida 4 ta belgidan iborat bo'lishi kerak")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Parollar mos kelmaydi")
      return
    }

    // Update phone and password
    const formattedPhone = "+998 " + newPhone
    updatePhone(formattedPhone)
    updatePassword(newPassword)

    // Reset and close modal
    setShowPhoneModal(false)
    setPhoneEditStep("phone")
    setNewPhone("")
    setSmsInputs(["", "", "", "", "", ""])
    setNewPassword("")
    setConfirmPassword("")
    setPasswordError("")
  }

  const handleOpenNameModal = () => {
    setEditFirstName(firstName || "")
    setEditLastName(lastName || "")
    setShowNameModal(true)
  }

  const handleSaveName = () => {
    if (editFirstName.trim() && editLastName.trim()) {
      updateName(editFirstName.trim(), editLastName.trim())
      setShowNameModal(false)
    }
  }

  const handleClosePhoneModal = () => {
    setShowPhoneModal(false)
    setPhoneEditStep("phone")
    setNewPhone("")
    setSmsInputs(["", "", "", "", "", ""])
    setNewPassword("")
    setConfirmPassword("")
    setPasswordError("")
  }

  if (!mounted || !isAuthenticated) {
    return null
  }

  const fullName = firstName && lastName ? `${firstName} ${lastName}` : "Foydalanuvchi"
  const isSmsComplete = smsInputs.every((input) => input !== "")
  const isPasswordValid = newPassword.length >= 4 && newPassword === confirmPassword

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="container mx-auto flex-1 px-4 pb-24 pt-4 md:pb-8">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Card className="overflow-hidden border-0">
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold text-white">
                  {firstName?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white">{fullName}</h1>
                  <p className="flex items-center gap-2 text-white/80">
                    <Phone className="h-4 w-4" />
                    {phone || "+998 XX XXX XX XX"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2 sm:grid-cols-4 bg-secondary">
              <TabsTrigger
                value="data"
                className="gap-1 sm:gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{t("profile.myData")}</span>
                <span className="sm:hidden">Ma'lumot</span>
              </TabsTrigger>
              <TabsTrigger
                value="appointments"
                className="gap-1 sm:gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm relative"
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{t("profile.myAppointments")}</span>
                <span className="sm:hidden">Suhbatlar</span>
                {appointments.filter((apt) => apt.hasMessage && apt.status === "pending").length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    !
                  </span>
                )}
                {appointments.length > 0 && (
                  <span className="ml-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-green-100 text-[10px] sm:text-xs font-bold text-green-600">
                    {appointments.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="gap-1 sm:gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{t("profile.myOrders")}</span>
                <span className="sm:hidden">Buyurtma</span>
                {orders.length > 0 && (
                  <span className="ml-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-green-100 text-[10px] sm:text-xs font-bold text-green-600">
                    {orders.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="gap-1 sm:gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{t("profile.savedItems")}</span>
                <span className="sm:hidden">Saqlangan</span>
                {savedProducts.length > 0 && (
                  <span className="ml-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-100 text-[10px] sm:text-xs font-bold text-red-500">
                    {savedProducts.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* My Data Tab - Updated with click handlers for edit modals */}
            <TabsContent value="data" className="space-y-4">
              <Card className="cursor-pointer transition-all hover:shadow-md" onClick={handleOpenNameModal}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <User className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ism va familiya</p>
                        <p className="text-lg font-semibold">{fullName}</p>
                      </div>
                    </div>
                    <Edit className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => setShowPhoneModal(true)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("profile.phoneNumber")}</p>
                        <p className="text-lg font-semibold">{phone || "+998 XX XXX XX XX"}</p>
                      </div>
                    </div>
                    <Edit className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <Settings className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{t("profile.settings")}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full gap-2 border-red-200 bg-transparent text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-5 w-5" />
                {t("auth.logout")}
              </Button>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                      <Package className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <p className="mb-2 text-xl font-semibold text-muted-foreground">{t("profile.noOrders")}</p>
                    <p className="mb-6 text-sm text-muted-foreground">Siz hali hech narsa buyurtma qilmagansiz</p>
                    <Link href="/market">
                      <Button className="gap-2 bg-green-600 hover:bg-green-700">{t("market.continueShopping")}</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order, index) => (
                  <motion.div
                    key={order.orderNumber}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="border-b bg-secondary/50 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground">{t("checkout.orderNumber")}</p>
                              <p className="text-lg font-bold text-green-600">{order.orderNumber}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">{t("profile.orderDate")}</p>
                              <p className="font-medium">{new Date(order.createdAt).toLocaleDateString(language)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-4 flex flex-wrap gap-2">
                            {order.items.slice(0, 4).map((item) => (
                              <div key={item.id} className="relative h-16 w-16 overflow-hidden rounded-xl bg-secondary">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name[language]}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-tl-lg bg-green-600 text-xs font-bold text-white">
                                  {item.quantity}
                                </div>
                              </div>
                            ))}
                            {order.items.length > 4 && (
                              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-muted-foreground">
                                +{order.items.length - 4}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground">{t("profile.orderTotal")}</p>
                              <p className="text-xl font-bold text-green-600">{formatPrice(order.total)}</p>
                            </div>
                            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-600 dark:bg-amber-900/30">
                              {t("profile.statusPending")}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-4">
              {appointments.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                      <Calendar className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <p className="mb-2 text-xl font-semibold text-muted-foreground">{t("profile.noAppointments")}</p>
                    <p className="mb-6 text-sm text-muted-foreground">Mutaxassis bilan suhbat belgilang</p>
                    <Link href="/specialists">
                      <Button className="gap-2 bg-green-600 hover:bg-green-700">{t("specialists.title")}</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {appointments
                    .sort((a, b) => {
                      const dateA = a.date ? new Date(a.date).getTime() : 0
                      const dateB = b.date ? new Date(b.date).getTime() : 0
                      return dateB - dateA
                    })
                    .map((appointment, index) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="border-b bg-secondary/50 p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="mb-2 flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-foreground">{appointment.specialistName}</h3>
                                    {appointment.hasMessage && appointment.status === "pending" && (
                                      <Badge variant="destructive" className="gap-1">
                                        <Bell className="h-3 w-3" />
                                        {t("profile.newMessage")}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{appointment.specialistSpecialization}</p>
                                </div>
                                <Badge
                                  variant={appointment.status === "confirmed" ? "default" : "secondary"}
                                  className="ml-2"
                                >
                                  {appointment.status === "pending"
                                    ? t("profile.statusPending")
                                    : t("profile.statusConfirmed")}
                                </Badge>
                              </div>
                            </div>
                            <div className="p-4 space-y-3">
                              <div className="flex items-center gap-3">
                                {appointment.consultationType === "office" && (
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                  </div>
                                )}
                                {appointment.consultationType === "phone" && (
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                    <Phone className="h-5 w-5 text-green-600" />
                                  </div>
                                )}
                                {appointment.consultationType === "zoom" && (
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                    <Video className="h-5 w-5 text-purple-600" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="text-xs text-muted-foreground">{t("profile.appointmentType")}</p>
                                  <p className="font-semibold">
                                    {appointment.consultationType === "office"
                                      ? t("profile.officeVisit")
                                      : appointment.consultationType === "phone"
                                        ? t("profile.phoneConsultation")
                                        : t("profile.zoomConsultation")}
                                  </p>
                                </div>
                              </div>

                              {appointment.date && (
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-5 w-5 text-muted-foreground" />
                                  <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">{t("profile.appointmentDate")}</p>
                                    <p className="font-medium">
                                      {new Date(appointment.date).toLocaleDateString(language, {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {appointment.time && (
                                <div className="flex items-center gap-3">
                                  <Clock className="h-5 w-5 text-muted-foreground" />
                                  <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">{t("profile.appointmentTime")}</p>
                                    <p className="font-medium">{appointment.time}</p>
                                  </div>
                                </div>
                              )}

                              {appointment.consultationType === "office" && (
                                <>
                                  <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground" />
                                    <div className="flex-1">
                                      <p className="text-xs text-muted-foreground">{t("profile.clinicDetails")}</p>
                                      <p className="font-medium">{appointment.clinicName}</p>
                                      <p className="text-sm text-muted-foreground">{appointment.clinicAddress}</p>
                                    </div>
                                  </div>
                                  {appointment.floor && appointment.room && (
                                    <div className="rounded-lg bg-secondary/50 p-3">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <p className="text-xs text-muted-foreground">{t("profile.floor")}</p>
                                          <p className="font-semibold">{appointment.floor}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-muted-foreground">{t("profile.room")}</p>
                                          <p className="font-semibold">{appointment.room}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}

                              {appointment.phone && (
                                <div className="flex items-center gap-3">
                                  <Phone className="h-5 w-5 text-muted-foreground" />
                                  <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">{t("specialists.phone")}</p>
                                    <p className="font-medium">{appointment.phone}</p>
                                  </div>
                                </div>
                              )}

                              {appointment.price > 0 && (
                                <div className="border-t pt-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{t("checkout.paymentType")}</span>
                                    <span className="font-semibold text-green-600">{formatPrice(appointment.price)}</span>
                                  </div>
                                </div>
                              )}

                              <Link href={`/specialists/${appointment.specialistId}`}>
                                <Button variant="outline" className="w-full gap-2">
                                  {t("profile.viewDetails")}
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              )}
            </TabsContent>

            {/* Saved Items Tab */}
            <TabsContent value="saved" className="space-y-4">
              {savedProducts.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                      <Heart className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <p className="mb-2 text-xl font-semibold text-muted-foreground">{t("profile.noSaved")}</p>
                    <p className="mb-6 text-sm text-muted-foreground">Sevimli mahsulotlarni saqlang</p>
                    <Link href="/market">
                      <Button className="gap-2 bg-green-600 hover:bg-green-700">{t("market.continueShopping")}</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {savedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden">
                        <CardContent className="p-0">
                          <Link href={`/market/${product.id}`} className="flex gap-4 p-4">
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name[language]}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-1 flex-col justify-center">
                              <h3 className="mb-1 font-semibold text-foreground">{product.name[language]}</h3>
                              <p className="mb-2 text-sm text-muted-foreground line-clamp-1">
                                {product.description[language]}
                              </p>
                              <p className="text-xl font-bold text-green-600">{formatPrice(product.price)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault()
                                removeSaved(product.id)
                              }}
                              className="h-12 w-12 shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <Heart className="h-6 w-6 fill-current" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <MobileNav />

      <AnimatePresence>
        {showNameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowNameModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-background shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-green-600 to-green-500 p-6 pb-12">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNameModal(false)}
                  className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                  <X className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Ismni o'zgartirish</h2>
                    <p className="text-sm text-white/80">Ism va familiyangizni kiriting</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="-mt-6 rounded-t-3xl bg-background p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      Ism
                    </Label>
                    <Input
                      id="firstName"
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      placeholder="Ismingiz"
                      className="h-14 rounded-xl border-2 bg-secondary/50 px-4 text-lg transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Familiya
                    </Label>
                    <Input
                      id="lastName"
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      placeholder="Familiyangiz"
                      className="h-14 rounded-xl border-2 bg-secondary/50 px-4 text-lg transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSaveName}
                  disabled={!editFirstName.trim() || !editLastName.trim()}
                  className="mt-6 h-14 w-full gap-2 rounded-xl bg-green-600 text-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  <Check className="h-5 w-5" />
                  Tasdiqlash
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPhoneModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={handleClosePhoneModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-background shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Step 1: Phone Number */}
              <AnimatePresence mode="wait">
                {phoneEditStep === "phone" && (
                  <motion.div
                    key="phone-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-green-600 to-green-500 p-6 pb-12">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClosePhoneModal}
                        className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/30"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                          <Phone className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">Telefon raqamni o'zgartirish</h2>
                          <p className="text-sm text-white/80">Yangi raqamingizni kiriting</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="-mt-6 rounded-t-3xl bg-background p-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Telefon raqami</Label>
                        <div className="flex items-center gap-3 rounded-xl border-2 bg-secondary/50 p-3 transition-all focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20">
                          {/* Uzbekistan flag */}
                          <div className="flex items-center gap-2 rounded-lg bg-background px-3 py-2">
                            <div className="flex h-6 w-8 flex-col overflow-hidden rounded">
                              <div className="h-1/3 bg-[#0099B5]" />
                              <div className="relative h-1/3 bg-white">
                                <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-[#CE1126]" />
                              </div>
                              <div className="h-1/3 bg-[#1EB53A]" />
                            </div>
                            <span className="text-lg font-semibold">+998</span>
                          </div>
                          <Input
                            value={newPhone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            placeholder="90 123 45 67"
                            className="h-12 flex-1 border-0 bg-transparent p-0 text-xl font-medium focus-visible:ring-0"
                            maxLength={12}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          9 ta raqam kiritganingizda avtomatik SMS yuboriladi
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: SMS Code */}
                {phoneEditStep === "sms" && (
                  <motion.div
                    key="sms-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 p-6 pb-12">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClosePhoneModal}
                        className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/30"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                          <Shield className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">SMS tasdiqlash</h2>
                          <p className="text-sm text-white/80">+998 {newPhone} raqamiga yuborildi</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="-mt-6 rounded-t-3xl bg-background p-6">
                      {/* Show generated code for demo */}
                      <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">SMS kod: {generatedCode}</span>
                      </div>

                      {/* SMS Input boxes */}
                      <div className="mb-6 flex justify-center gap-2">
                        {smsInputs.map((value, index) => (
                          <motion.input
                            key={index}
                            ref={(el) => {
                              smsInputRefs.current[index] = el
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={value}
                            onChange={(e) => handleSmsChange(index, e.target.value)}
                            onKeyDown={(e) => handleSmsKeyDown(index, e)}
                            className="h-14 w-12 rounded-xl border-2 bg-secondary/50 text-center text-2xl font-bold transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                          />
                        ))}
                      </div>

                      <p className="mb-4 text-center text-sm text-muted-foreground">
                        Kod 5 soniyadan keyin avtomatik kiritiladi
                      </p>

                      <Button
                        onClick={handleVerifySms}
                        disabled={!isSmsComplete}
                        className="h-14 w-full gap-2 rounded-xl bg-blue-600 text-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Check className="h-5 w-5" />
                        Tasdiqlash
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Password */}
                {phoneEditStep === "password" && (
                  <motion.div
                    key="password-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-purple-600 to-purple-500 p-6 pb-12">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClosePhoneModal}
                        className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/30"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                          <Shield className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">Yangi parol</h2>
                          <p className="text-sm text-white/80">Yangi parolingizni kiriting</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="-mt-6 rounded-t-3xl bg-background p-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-sm font-medium">
                            Yangi parol
                          </Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => {
                                setNewPassword(e.target.value)
                                setPasswordError("")
                              }}
                              placeholder="Kamida 4 ta belgi"
                              className="h-14 rounded-xl border-2 bg-secondary/50 px-4 pr-12 text-lg transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            Parolni tasdiqlang
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => {
                                setConfirmPassword(e.target.value)
                                setPasswordError("")
                              }}
                              placeholder="Parolni qaytadan kiriting"
                              className="h-14 rounded-xl border-2 bg-secondary/50 px-4 pr-12 text-lg transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                          </div>
                        </div>

                        {passwordError && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-500"
                          >
                            {passwordError}
                          </motion.p>
                        )}

                        {newPassword && confirmPassword && newPassword === confirmPassword && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 text-green-600"
                          >
                            <Check className="h-4 w-4" />
                            <span className="text-sm">Parollar mos keladi</span>
                          </motion.div>
                        )}
                      </div>

                      <Button
                        onClick={handleConfirmPassword}
                        disabled={!isPasswordValid}
                        className="mt-6 h-14 w-full gap-2 rounded-xl bg-purple-600 text-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
                      >
                        <Check className="h-5 w-5" />
                        Saqlash
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
