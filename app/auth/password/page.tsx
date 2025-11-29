"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Leaf, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { setPassword: savePassword, isAuthenticated, redirectTo, setRedirectTo } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !success) {
      router.push(redirectTo || "/")
    }
  }, [isAuthenticated, success, router, redirectTo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"))
      return
    }

    savePassword(password)
    setSuccess(true)

    setTimeout(() => {
      const destination = redirectTo || "/"
      setRedirectTo(null)
      router.push(destination)
    }, 2000)
  }

  const passwordsMatch = password && confirmPassword && password === confirmPassword

  if (success) {
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
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
                  {t("auth.authSuccess")}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-2 text-muted-foreground"
                >
                  {t("common.loading")}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-4 text-center">
              <Link
                href="/auth/sms"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("common.back")}
              </Link>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
              >
                <Lock className="h-10 w-10 text-green-600" />
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold">{t("auth.createPassword")}</CardTitle>
                <CardDescription className="mt-2">{t("auth.password")}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError("")
                      }}
                      placeholder={t("auth.passwordPlaceholder")}
                      className="h-14 pr-12 text-lg"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setError("")
                      }}
                      placeholder={t("auth.passwordPlaceholder")}
                      className={`h-14 pr-12 text-lg ${
                        confirmPassword && !passwordsMatch ? "border-destructive" : ""
                      } ${passwordsMatch ? "border-green-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {passwordsMatch && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-12 top-1/2 -translate-y-1/2"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="h-14 w-full gap-2 bg-green-600 text-lg font-semibold hover:bg-green-700"
                    disabled={!passwordsMatch}
                  >
                    {t("common.confirm")}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
