"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Leaf, MessageSquare, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SmsPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [countdown, setCountdown] = useState(5)
  const [smsSent, setSmsSent] = useState(false)
  const [error, setError] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { verifyCode, setStep, phone, isAuthenticated, smsCode, generateSmsCode } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  // Countdown timer for auto-sending SMS
  useEffect(() => {
    if (countdown > 0 && !smsSent) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && !smsSent) {
      setSmsSent(true)
    }
  }, [countdown, smsSent])

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all digits entered
    const fullCode = newCode.join("")
    if (fullCode.length === 6) {
      if (verifyCode(fullCode)) {
        setStep("password")
        router.push("/auth/password")
      } else {
        setError(t("auth.smsCodeInvalid"))
        setCode(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pastedData.length === 6) {
      const newCode = pastedData.split("")
      setCode(newCode)
      if (verifyCode(pastedData)) {
        setStep("password")
        router.push("/auth/password")
      } else {
        setError(t("auth.smsCodeInvalid"))
        setCode(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    }
  }

  const handleResend = () => {
    generateSmsCode()
    setCountdown(60)
    setSmsSent(false)
    setCode(["", "", "", "", "", ""])
    setError("")
    inputRefs.current[0]?.focus()
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
                href="/auth/login"
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
                {smsSent ? (
                  <CheckCircle className="h-10 w-10 text-green-600" />
                ) : (
                  <MessageSquare className="h-10 w-10 text-green-600" />
                )}
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold">{t("auth.smsCode")}</CardTitle>
                <CardDescription className="mt-2">
                  {smsSent ? (
                    <>
                      {t("auth.smsSent")}
                      <br />
                      <span className="font-medium text-foreground">{phone}</span>
                    </>
                  ) : (
                    <span className="text-lg font-medium">{t("auth.smsResendIn", { seconds: countdown })}</span>
                  )}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Code Input */}
                <div className="flex justify-center gap-2" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <Input
                        ref={(el) => {
                          inputRefs.current[index] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`h-14 w-12 text-center text-2xl font-bold ${error ? "border-destructive" : ""}`}
                        disabled={!smsSent}
                      />
                    </motion.div>
                  ))}
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm text-destructive"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Resend Button */}
                {smsSent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <Button variant="ghost" onClick={handleResend} className="text-green-600 hover:text-green-700">
                      {t("auth.smsResend")}
                    </Button>
                  </motion.div>
                )}

                {smsSent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-center"
                  >
                    <p className="text-sm text-muted-foreground mb-1">SMS kod yuborildi:</p>
                    <p className="text-2xl font-bold text-green-600 tracking-widest">{smsCode}</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
