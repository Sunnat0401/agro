"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { formatFullPhoneNumber, validateUzbekPhone } from "@/utils/format"
import { Leaf, Phone, ArrowRight, User, Lock, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [phone, setPhone] = useState("+998 ")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [error, setError] = useState("")
  const {
    setPhone: savePhone,
    setUserName,
    setStep,
    isAuthenticated,
    redirectTo,
    generateSmsCode,
    login,
    isRegistered,
  } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo || "/")
    }
  }, [isAuthenticated, router, redirectTo])

  const handlePhoneChange = (value: string) => {
    const formatted = formatFullPhoneNumber(value)
    setPhone(formatted)
    setError("")
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateUzbekPhone(phone)) {
      setError(t("auth.phoneInvalid"))
      return
    }

    if (!password || password.length < 4) {
      setError(t("profile.passwordMinLength"))
      return
    }

    // Check if user is registered
    if (!isRegistered(phone)) {
      setError("Bunday foydalanuvchi yo'q. Ro'yxatdan o'ting")
      return
    }

    // Try to login
    const success = login(phone, password)
    if (success) {
      router.push(redirectTo || "/")
    } else {
      setError("Telefon raqam yoki parol noto'g'ri")
    }
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateUzbekPhone(phone)) {
      setError(t("auth.phoneInvalid"))
      return
    }

    if (!firstName.trim() || firstName.trim().length < 4) {
      setError("Ism kamida 4 ta harfdan iborat bo'lishi kerak")
      return
    }

    if (!lastName.trim() || lastName.trim().length < 4) {
      setError("Familiya kamida 4 ta harfdan iborat bo'lishi kerak")
      return
    }

    // Check if already registered
    if (isRegistered(phone)) {
      setError("Bu raqam allaqachon ro'yxatdan o'tgan. Kirish qiling")
      return
    }

    savePhone(phone)
    setUserName(firstName.trim(), lastName.trim())
    generateSmsCode()
    setStep("sms")
    router.push("/auth/sms")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white"
          >
            <Leaf className="h-6 w-6" />
          </motion.div>
          <span className="text-xl font-bold text-foreground">{t("common.appName")}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
              >
                {mode === "login" ? (
                  <Lock className="h-10 w-10 text-green-600" />
                ) : (
                  <User className="h-10 w-10 text-green-600" />
                )}
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {mode === "login" ? t("auth.login") : t("auth.register")}
                </CardTitle>
                <CardDescription className="mt-2">
                  {mode === "login" ? "Telefon va parolingizni kiriting" : "Ma'lumotlaringizni kiriting"}
                </CardDescription>
              </div>

              <div className="flex gap-2 p-1 bg-secondary rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login")
                    setError("")
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    mode === "login"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Kirish
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register")
                    setError("")
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    mode === "register"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Ro'yxatdan o'tish
                </button>
              </div>
            </CardHeader>

            <CardContent>
              <AnimatePresence mode="wait">
                {mode === "login" ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleLoginSubmit}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("auth.phoneNumber")}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="+998 XX XXX XX XX"
                          className={`h-12 pl-10 text-lg ${error ? "border-destructive" : ""}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">{t("auth.password")}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            setError("")
                          }}
                          placeholder="Parolingiz"
                          className={`h-12 pl-10 text-lg ${error ? "border-destructive" : ""}`}
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </motion.div>
                    )}

                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        className="h-12 w-full gap-2 bg-green-600 text-lg font-semibold hover:bg-green-700"
                      >
                        {t("auth.login")}
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleRegisterSubmit}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Ism</Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value)
                            setError("")
                          }}
                          placeholder="Ismingiz"
                          className="h-12"
                          minLength={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Familiya</Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value)
                            setError("")
                          }}
                          placeholder="Familiyangiz"
                          className="h-12"
                          minLength={4}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone-register">{t("auth.phoneNumber")}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone-register"
                          type="tel"
                          value={phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="+998 XX XXX XX XX"
                          className={`h-12 pl-10 text-lg ${error ? "border-destructive" : ""}`}
                          maxLength={17}
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </motion.div>
                    )}

                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        className="h-12 w-full gap-2 bg-green-600 text-lg font-semibold hover:bg-green-700"
                        disabled={
                          !validateUzbekPhone(phone) ||
                          !firstName.trim() ||
                          !lastName.trim() ||
                          firstName.trim().length < 4 ||
                          lastName.trim().length < 4
                        }
                      >
                        {t("common.next")}
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center text-sm text-muted-foreground"
              >
                {mode === "login" ? "Masalan: +998 90 123 45 67" : "Ism va familiya kamida 4 ta harf"}
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
