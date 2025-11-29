"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Tractor, MapPin, DollarSign, Clock, MessageCircle, Filter } from "lucide-react"
import farmersData from "@/data/farmers.json"
import { formatPrice } from "@/utils/format"

export default function FarmersPage() {
  const { isAuthenticated } = useAuth()
  const { t, language } = useLanguage()
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCrop, setSelectedCrop] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [mounted, isAuthenticated, router])

  const crops = farmersData.crops.map((crop) => ({
    id: crop.id,
    name: crop.name[language as "uz" | "ru" | "en"] || crop.name.uz,
  }))

  const regions = farmersData.regions.map((region) => ({
    id: region.id,
    name: region.name[language as "uz" | "ru" | "en"] || region.name.uz,
    type: region.type,
  }))

  const filteredMachinery = useMemo(() => {
    return farmersData.machinery.filter((machinery) => {
      const matchesCrop =
        selectedCrop === "all" ||
        (machinery.cropIds && machinery.cropIds.includes(selectedCrop))

      const matchesRegion = selectedRegion === "all" || machinery.regionId === selectedRegion

      const matchesDistrict =
        selectedDistrict === "all" ||
        (machinery.district &&
          machinery.district[language as "uz" | "ru" | "en"]
            ?.toLowerCase()
            .includes(selectedDistrict.toLowerCase()))

      const matchesSearch =
        !searchQuery ||
        machinery.name[language as "uz" | "ru" | "en"]
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        machinery.description[language as "uz" | "ru" | "en"]
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())

      return matchesCrop && matchesRegion && matchesDistrict && matchesSearch
    })
  }, [selectedCrop, selectedRegion, selectedDistrict, searchQuery, language])

  // Get unique districts from filtered machinery
  const availableDistricts = useMemo(() => {
    const districts = new Set<string>()
    filteredMachinery.forEach((m) => {
      if (m.district && m.district[language as "uz" | "ru" | "en"]) {
        districts.add(m.district[language as "uz" | "ru" | "en"] || "")
      }
    })
    return Array.from(districts).sort()
  }, [filteredMachinery, language])

  if (!mounted || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-3 pb-24 pt-6 md:px-4 md:pb-8 md:pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white md:h-12 md:w-12">
              <Tractor className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <h1 className="mb-1 text-xl font-bold text-foreground md:text-2xl">{t("farmers.title")}</h1>
              <p className="text-xs text-muted-foreground md:text-sm">{t("farmers.subtitle")}</p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 md:mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground md:left-4 md:h-5 md:w-5" />
            <Input
              type="text"
              placeholder={t("farmers.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-9 pr-4 text-sm md:h-12 md:pl-12 md:text-base"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 md:mb-8"
        >
          <Card className="p-4 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5 text-green-600" />
              <h2 className="text-base font-semibold md:text-lg">{t("farmers.filterByCrop")}</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Crop Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground md:text-sm">
                  {t("farmers.filterByCrop")}
                </label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger className="w-full h-11 bg-background hover:bg-accent transition-colors">
                    <SelectValue placeholder={t("farmers.allCrops")} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all" className="font-medium">
                      {t("farmers.allCrops")}
                    </SelectItem>
                    {crops.map((crop) => (
                      <SelectItem key={crop.id} value={crop.id}>
                        {crop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Region Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground md:text-sm">
                  {t("farmers.filterByRegion")}
                </label>
                <Select
                  value={selectedRegion}
                  onValueChange={(value) => {
                    setSelectedRegion(value)
                    setSelectedDistrict("all")
                  }}
                >
                  <SelectTrigger className="w-full h-11 bg-background hover:bg-accent transition-colors">
                    <SelectValue placeholder={t("farmers.allRegions")} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all" className="font-medium">
                      {t("farmers.allRegions")}
                    </SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District Filter */}
              {availableDistricts.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground md:text-sm">
                    {t("farmers.filterByDistrict")}
                  </label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="w-full h-11 bg-background hover:bg-accent transition-colors">
                      <SelectValue placeholder={t("farmers.allDistricts")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="all" className="font-medium">
                        {t("farmers.allDistricts")}
                      </SelectItem>
                      {availableDistricts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Machinery Grid */}
        {filteredMachinery.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <p className="text-muted-foreground">{t("farmers.noMachinery")}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {filteredMachinery.map((machinery, index) => {
              const cropNames = machinery.cropIds
                .map((cropId) => {
                  const crop = crops.find((c) => c.id === cropId)
                  return crop?.name
                })
                .filter(Boolean)

              const region = regions.find((r) => r.id === machinery.regionId)

              return (
                <motion.div
                  key={machinery.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Link href={`/farmers/${machinery.id}`}>
                    <Card className="h-full cursor-pointer transition-all hover:shadow-lg">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col gap-4">
                          {/* Image */}
                          <div className="relative h-48 w-full overflow-hidden rounded-xl bg-secondary">
                            <Image
                              src={machinery.images[0] || "/placeholder.jpg"}
                              alt={machinery.name[language as "uz" | "ru" | "en"] || machinery.name.uz}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Name */}
                          <div>
                            <h3 className="mb-2 text-lg font-bold text-foreground md:text-xl">
                              {machinery.name[language as "uz" | "ru" | "en"] || machinery.name.uz}
                            </h3>
                            {cropNames.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {cropNames.map((cropName, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {cropName}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span className="truncate">
                              {region?.name || ""} {machinery.district && `, ${machinery.district[language as "uz" | "ru" | "en"] || machinery.district.uz}`}
                            </span>
                          </div>

                          {/* Price on Request */}
                          <div className="flex items-center justify-between border-t border-border pt-3">
                            <div>
                              <p className="text-xs text-muted-foreground">{t("farmers.price")}</p>
                              <p className="text-sm font-semibold text-green-600">
                                {t("farmers.priceOnRequest")}
                              </p>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs md:text-sm">
                            <div>
                              <p className="text-muted-foreground">{t("farmers.experience")}</p>
                              <p className="font-semibold">
                                {machinery.experience} {t("farmers.years")}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">{t("farmers.projectYears")}</p>
                              <p className="font-semibold">
                                {machinery.projectYears} {t("farmers.years")}
                              </p>
                            </div>
                          </div>

                          {/* View Details Button */}
                          <Button className="w-full" size="sm">
                            {t("farmers.viewDetails")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>
      <MobileNav />
    </div>
  )
}

