"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  MessageCircle,
  Phone,
  Star,
  ChevronLeft,
  ChevronRight,
  Tractor,
} from "lucide-react"
import farmersData from "@/data/farmers.json"
import { formatPrice, formatFullPhoneNumber } from "@/utils/format"

export default function MachineryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { t, language } = useLanguage()

  const [machinery, setMachinery] = useState<any>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    const foundMachinery = farmersData.machinery.find((m) => m.id === params.id)
    if (!foundMachinery) {
      router.push("/farmers")
      return
    }

    setMachinery({
      ...foundMachinery,
      name: foundMachinery.name[language as "uz" | "ru" | "en"] || foundMachinery.name.uz,
      description: foundMachinery.description[language as "uz" | "ru" | "en"] || foundMachinery.description.uz,
      specifications: foundMachinery.specifications[language as "uz" | "ru" | "en"] || foundMachinery.specifications.uz,
      district: foundMachinery.district[language as "uz" | "ru" | "en"] || foundMachinery.district.uz,
      pricePer: foundMachinery.pricePer[language as "uz" | "ru" | "en"] || foundMachinery.pricePer.uz,
    })
  }, [params.id, isAuthenticated, router, language])

  if (!mounted || !isAuthenticated) {
    return null
  }

  if (!machinery) {
    return null
  }

  const region = farmersData.regions.find((r) => r.id === machinery.regionId)
  const cropNames = machinery.cropIds
    .map((cropId: string) => {
      const crop = farmersData.crops.find((c) => c.id === cropId)
      return crop ? crop.name[language as "uz" | "ru" | "en"] || crop.name.uz : null
    })
    .filter(Boolean)

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % machinery.images.length)
  }

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + machinery.images.length) % machinery.images.length)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-3 pb-24 pt-6 md:px-4 md:pb-8 md:pt-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 md:mb-6"
        >
          <Link href="/farmers">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("specialists.back")}
            </Button>
          </Link>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2">
            {/* Image Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-secondary">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeImageIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="relative h-full w-full"
                      >
                        <Image
                          src={machinery.images[activeImageIndex] || "/placeholder.jpg"}
                          alt={`${machinery.name} - ${activeImageIndex + 1}`}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {machinery.images.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                          {machinery.images.map((_: any, index: number) => (
                            <button
                              key={index}
                              onClick={() => setActiveImageIndex(index)}
                              className={`h-2 rounded-full transition-all ${
                                index === activeImageIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Image Counter */}
                    {machinery.images.length > 1 && (
                      <div className="absolute right-4 top-4 rounded-full bg-background/80 px-3 py-1 text-sm backdrop-blur-sm">
                        {activeImageIndex + 1} / {machinery.images.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Grid */}
                  {machinery.images.length > 1 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {machinery.images.map((image: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`relative aspect-video overflow-hidden rounded-lg border-2 transition-all ${
                            index === activeImageIndex
                              ? "border-green-600 ring-2 ring-green-600/20"
                              : "border-border hover:border-green-600/50"
                          }`}
                        >
                          <Image src={image || "/placeholder.jpg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Name and Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold md:text-3xl">{machinery.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{machinery.description}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">{t("farmers.specifications")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{machinery.specifications}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Suitable Crops */}
            {cropNames.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">{t("farmers.suitableFor")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {cropNames.map((cropName, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {cropName}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Column - Contact Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">{t("farmers.contactOwner")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price on Request */}
                  <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                      {t("farmers.priceOnRequest")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("farmers.contactForPrice")}
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("farmers.experience")}</p>
                        <p className="font-semibold">
                          {machinery.experience} {t("farmers.years")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <Tractor className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("farmers.projectYears")}</p>
                        <p className="font-semibold">
                          {machinery.projectYears} {t("farmers.years")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 border-t border-border pt-4">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t("farmers.location")}</p>
                      <p className="font-medium">
                        {region?.name[language as "uz" | "ru" | "en"] || region?.name.uz || ""}
                      </p>
                      {machinery.district && (
                        <p className="text-sm text-muted-foreground">{machinery.district}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="space-y-3 border-t border-border pt-4">
                    <a
                      href={`https://t.me/${machinery.telegram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full gap-2" variant="default">
                        <MessageCircle className="h-4 w-4" />
                        {t("farmers.telegram")}: {machinery.telegram}
                      </Button>
                    </a>
                    <a href={`tel:${machinery.phone.replace(/\s/g, "")}`}>
                      <Button className="w-full gap-2" variant="outline">
                        <Phone className="h-4 w-4" />
                        {formatFullPhoneNumber(machinery.phone)}
                      </Button>
                    </a>
                  </div>
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

