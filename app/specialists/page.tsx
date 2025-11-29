"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, MapPin, Clock, Users } from "lucide-react"
import Link from "next/link"
import specialistsData from "@/data/specialists.json"

export default function SpecialistsPage() {
  const { isAuthenticated } = useAuth()
  const { t, language } = useLanguage()
  const router = useRouter()

  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  if (!isAuthenticated) {
    router.push("/auth/login")
    return null
  }

  const categories = specialistsData.categories.map((cat) => ({
    id: cat.id,
    name: cat.name[language as "uz" | "ru" | "en"] || cat.name.uz,
  }))

  const specialists = specialistsData.specialists
    .filter((spec) => {
      const matchesCategory = selectedCategory === "all" || spec.category === selectedCategory
      const matchesSearch =
        searchQuery === "" ||
        spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spec.specialization[language as "uz" | "ru" | "en"]
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .map((spec) => ({
      ...spec,
      specialization: spec.specialization[language as "uz" | "ru" | "en"] || spec.specialization.uz,
      clinicName: spec.clinicName[language as "uz" | "ru" | "en"] || spec.clinicName.uz,
      clinicAddress: spec.clinicAddress[language as "uz" | "ru" | "en"] || spec.clinicAddress.uz,
      workingHours: spec.workingHours[language as "uz" | "ru" | "en"] || spec.workingHours.uz,
      description: spec.description[language as "uz" | "ru" | "en"] || spec.description.uz,
    }))

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.name || categoryId
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
          <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">{t("specialists.title")}</h1>
          <p className="text-sm text-muted-foreground md:text-base">{t("specialists.subtitle")}</p>
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
              placeholder={t("specialists.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-9 pr-4 text-sm md:h-12 md:pl-12 md:text-base"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 md:mb-8"
        >
          <p className="mb-3 text-sm font-medium text-foreground md:text-base">{t("specialists.filterByCategory")}</p>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="h-8 text-xs md:h-10 md:text-sm"
            >
              {t("specialists.allCategories")}
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="h-8 text-xs md:h-10 md:text-sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Specialists Grid */}
        {specialists.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <p className="text-muted-foreground">{t("specialists.noSpecialists")}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {specialists.map((specialist, index) => (
              <motion.div
                key={specialist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Link href={`/specialists/${specialist.id}`}>
                  <Card className="h-full cursor-pointer transition-all hover:shadow-lg">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col gap-4">
                        {/* Photo and Basic Info */}
                        <div className="flex gap-4">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-green-600 md:h-20 md:w-20">
                            <Image
                              src={specialist.photo}
                              alt={specialist.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="mb-1 truncate text-base font-semibold text-foreground md:text-lg">
                              {specialist.name}
                            </h3>
                            <p className="mb-2 text-xs text-muted-foreground md:text-sm">{specialist.specialization}</p>
                            <Badge variant="secondary" className="text-[10px] md:text-xs">
                              {getCategoryName(specialist.category)}
                            </Badge>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 border-t border-border pt-3">
                          <div className="text-center">
                            <p className="text-xs font-medium text-muted-foreground md:text-sm">
                              {t("specialists.experience")}
                            </p>
                            <p className="text-sm font-bold text-foreground md:text-base">
                              {specialist.experience} {t("specialists.years")}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="mb-1 flex items-center justify-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 md:h-4 md:w-4" />
                              <span className="text-xs font-bold text-foreground md:text-sm">
                                {specialist.rating}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground md:text-xs">
                              {t("specialists.rating")}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-medium text-muted-foreground md:text-sm">
                              {specialist.reviews}
                            </p>
                            <p className="text-[10px] text-muted-foreground md:text-xs">
                              {t("specialists.reviews")}
                            </p>
                          </div>
                        </div>

                        {/* Clinic Info */}
                        <div className="space-y-2 border-t border-border pt-3">
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground md:h-4 md:w-4" />
                            <p className="line-clamp-1 text-xs text-muted-foreground md:text-sm">
                              {specialist.clinicName}
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground md:h-4 md:w-4" />
                            <p className="line-clamp-1 text-xs text-muted-foreground md:text-sm">
                              {specialist.workingHours}
                            </p>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <Button className="w-full" size="sm">
                          {t("specialists.viewDetails")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <MobileNav />
    </div>
  )
}



