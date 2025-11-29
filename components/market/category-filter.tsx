// "use client"

// import { motion } from "framer-motion"
// import { useLanguage, type Language } from "@/contexts/language-context"
// import { cn } from "@/lib/utils"

// interface Category {
//   id: string
//   name: Record<Language, string>
//   icon: string
// }

// interface CategoryFilterProps {
//   categories: Category[]
//   selectedCategory: string | null
//   onSelect: (categoryId: string | null) => void
// }

// export function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
//   const { language, t } = useLanguage()

//   return (
//     <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-2">
//       <motion.button
//         whileTap={{ scale: 0.95 }}
//         onClick={() => onSelect(null)}
//         className={cn(
//           "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
//           selectedCategory === null ? "text-white" : "bg-secondary text-muted-foreground hover:text-foreground",
//         )}
//       >
//         {selectedCategory === null && (
//           <motion.div
//             layoutId="category-indicator"
//             className="absolute inset-0 rounded-full bg-green-600"
//             transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//           />
//         )}
//         <span className="relative z-10">{t("market.allProducts")}</span>
//       </motion.button>
//       {categories.map((category) => (
//         <motion.button
//           key={category.id}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => onSelect(category.id)}
//           className={cn(
//             "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
//             selectedCategory === category.id
//               ? "text-white"
//               : "bg-secondary text-muted-foreground hover:text-foreground",
//           )}
//         >
//           {selectedCategory === category.id && (
//             <motion.div
//               layoutId="category-indicator"
//               className="absolute inset-0 rounded-full bg-green-600"
//               transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//             />
//           )}
//           <span className="relative z-10 flex items-center gap-1.5">
//             <span>{category.icon}</span>
//             <span>{category.name[language]}</span>
//           </span>
//         </motion.button>
//       ))}
//     </div>
//   )
// }
"use client"

import { motion } from "framer-motion"
import { useLanguage, type Language } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

interface Category {
  id: string
  name: Record<Language, string>
  icon: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onSelect: (categoryId: string | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  const { language, t } = useLanguage()

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={8}
        slidesPerView={'auto'}
        centeredSlides={false}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={800}
        freeMode={true}
        className="category-swiper"
      >
        {/* All category slide */}
        <SwiperSlide className="!w-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(null)}
            className={cn(
              "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              selectedCategory === null ? "text-white" : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            {selectedCategory === null && (
              <motion.div
                layoutId="category-indicator"
                className="absolute inset-0 rounded-full bg-green-600"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{t("market.allProducts")}</span>
          </motion.button>
        </SwiperSlide>
        
        {/* Category slides */}
        {categories.map((category) => (
          <SwiperSlide key={category.id} className="!w-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(category.id)}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                selectedCategory === category.id
                  ? "text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {selectedCategory === category.id && (
                <motion.div
                  layoutId="category-indicator"
                  className="absolute inset-0 rounded-full bg-green-600"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span>{category.icon}</span>
                <span>{category.name[language]}</span>
              </span>
            </motion.button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}