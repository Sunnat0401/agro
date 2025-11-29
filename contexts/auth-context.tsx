"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface UserData {
  phone: string
  firstName: string
  lastName: string
  password: string
}

interface AuthState {
  isAuthenticated: boolean
  phone: string | null
  firstName: string | null
  lastName: string | null
  step: "login" | "sms" | "password" | "success" | "home"
  redirectTo: string | null
}

interface AuthContextType extends AuthState {
  setPhone: (phone: string) => void
  setStep: (step: AuthState["step"]) => void
  setUserName: (firstName: string, lastName: string) => void
  verifyCode: (code: string) => boolean
  setPassword: (password: string) => void
  logout: () => void
  setRedirectTo: (path: string | null) => void
  smsCode: string
  generateSmsCode: () => string
  updatePhone: (phone: string) => void
  updateName: (firstName: string, lastName: string) => void
  updatePassword: (password: string) => void
  login: (phone: string, password: string) => boolean
  isRegistered: (phone: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    phone: null,
    firstName: null,
    lastName: null,
    step: "login",
    redirectTo: null,
  })
  const [smsCode, setSmsCode] = useState("123456")

  useEffect(() => {
    const savedAuth = localStorage.getItem("agromind-auth")
    if (savedAuth) {
      try {
        const parsed: UserData & { isAuthenticated: boolean } = JSON.parse(savedAuth)
        if (parsed.isAuthenticated && parsed.phone && parsed.password) {
          setAuthState({
            isAuthenticated: true,
            phone: parsed.phone,
            firstName: parsed.firstName || null,
            lastName: parsed.lastName || null,
            step: "home",
            redirectTo: null,
          })
        }
      } catch {
        localStorage.removeItem("agromind-auth")
      }
    }
  }, [])

  const generateSmsCode = useCallback((): string => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setSmsCode(code)
    return code
  }, [])

  const setPhone = useCallback((phone: string) => {
    setAuthState((prev) => ({ ...prev, phone }))
  }, [])

  const setUserName = useCallback((firstName: string, lastName: string) => {
    setAuthState((prev) => ({ ...prev, firstName, lastName }))
  }, [])

  const setStep = useCallback((step: AuthState["step"]) => {
    setAuthState((prev) => ({ ...prev, step }))
  }, [])

  const setRedirectTo = useCallback((path: string | null) => {
    setAuthState((prev) => ({ ...prev, redirectTo: path }))
  }, [])

  const verifyCode = useCallback(
    (code: string): boolean => {
      return code === smsCode
    },
    [smsCode],
  )

  const isRegistered = useCallback((phone: string): boolean => {
    const savedAuth = localStorage.getItem("agromind-auth")
    if (savedAuth) {
      try {
        const parsed: UserData = JSON.parse(savedAuth)
        return parsed.phone === phone && !!parsed.password
      } catch {
        return false
      }
    }
    return false
  }, [])

  const login = useCallback((phone: string, password: string): boolean => {
    const savedAuth = localStorage.getItem("agromind-auth")
    if (savedAuth) {
      try {
        const parsed: UserData = JSON.parse(savedAuth)
        if (parsed.phone === phone && parsed.password === password) {
          setAuthState({
            isAuthenticated: true,
            phone: parsed.phone,
            firstName: parsed.firstName || null,
            lastName: parsed.lastName || null,
            step: "home",
            redirectTo: null,
          })
          return true
        }
      } catch {
        return false
      }
    }
    return false
  }, [])

  const setPassword = useCallback(
    (password: string) => {
      const newState: AuthState = {
        isAuthenticated: true,
        phone: authState.phone,
        firstName: authState.firstName,
        lastName: authState.lastName,
        step: "success",
        redirectTo: authState.redirectTo,
      }
      setAuthState(newState)
      localStorage.setItem(
        "agromind-auth",
        JSON.stringify({
          isAuthenticated: true,
          phone: authState.phone,
          firstName: authState.firstName,
          lastName: authState.lastName,
          password,
        }),
      )
    },
    [authState.phone, authState.firstName, authState.lastName, authState.redirectTo],
  )

  const updatePhone = useCallback((phone: string) => {
    setAuthState((prev) => ({ ...prev, phone }))
    const savedAuth = localStorage.getItem("agromind-auth")
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth)
        parsed.phone = phone
        localStorage.setItem("agromind-auth", JSON.stringify(parsed))
      } catch {
        console.error("Failed to update phone in localStorage")
      }
    }
  }, [])

  const updateName = useCallback((firstName: string, lastName: string) => {
    setAuthState((prev) => ({ ...prev, firstName, lastName }))
    const savedAuth = localStorage.getItem("agromind-auth")
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth)
        parsed.firstName = firstName
        parsed.lastName = lastName
        localStorage.setItem("agromind-auth", JSON.stringify(parsed))
      } catch {
        console.error("Failed to update name in localStorage")
      }
    }
  }, [])

  const updatePassword = useCallback((password: string) => {
    const savedAuth = localStorage.getItem("agromind-auth")
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth)
        parsed.password = password
        localStorage.setItem("agromind-auth", JSON.stringify(parsed))
      } catch {
        console.error("Failed to update password in localStorage")
      }
    }
  }, [])

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      phone: null,
      firstName: null,
      lastName: null,
      step: "login",
      redirectTo: null,
    })
    localStorage.removeItem("agromind-auth")
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        setPhone,
        setUserName,
        setStep,
        verifyCode,
        setPassword,
        logout,
        setRedirectTo,
        smsCode,
        generateSmsCode,
        updatePhone,
        updateName,
        updatePassword,
        login,
        isRegistered,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
