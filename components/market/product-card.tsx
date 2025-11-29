// "use client"

// import { motion } from "framer-motion"
// import Image from "next/image"
// import Link from "next/link"
// import { useLanguage, type Language } from "@/contexts/language-context"
// import { useCart } from "@/contexts/cart-context"
// import { useSaved } from "@/contexts/saved-context"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { formatPrice } from "@/utils/format"
// import { ShoppingCart, Check, Star, Heart } from "lucide-react"

// interface Product {
//   id: string
//   name: Record<Language, string>
//   description: Record<Language, string>
//   price: number
//   image: string
//   category: string
//   inStock: boolean
//   rating: number
// }

// interface ProductCardProps {
//   product: Product
//   index?: number
// }

// export function ProductCard({ product, index = 0 }: ProductCardProps) {
//   const { language, t } = useLanguage()
//   const { addItem, getItemQuantity } = useCart()
//   const { isSaved, toggleSaved } = useSaved()

//   const inCart = getItemQuantity(product.id) > 0
//   const saved = isSaved(product.id)

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
//       <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
//         <Link href={`/market/${product.id}`}>
//           <div className="relative aspect-square overflow-hidden bg-secondary">
//             <Image
//               src={product.image || "/placeholder.svg"}
//               alt={product.name[language]}
//               fill
//               className="object-cover transition-transform duration-300 group-hover:scale-110"
//             />
//             {!product.inStock && (
//               <div className="absolute inset-0 flex items-center justify-center bg-background/80">
//                 <span className="rounded-full bg-destructive px-3 py-1 text-sm font-medium text-destructive-foreground">
//                   {t("market.outOfStock")}
//                 </span>
//               </div>
//             )}
//             {product.rating >= 4.8 && product.inStock && (
//               <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-xs font-medium text-white">
//                 <Star className="h-3 w-3 fill-current" />
//                 {product.rating}
//               </div>
//             )}
//             <motion.button
//               whileTap={{ scale: 0.9 }}
//               onClick={(e) => {
//                 e.preventDefault()
//                 e.stopPropagation()
//                 toggleSaved(product.id)
//               }}
//               className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
//                 saved ? "bg-red-500 text-white" : "bg-white/80 text-muted-foreground hover:bg-white hover:text-red-500"
//               }`}
//             >
//               <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
//             </motion.button>
//           </div>
//         </Link>
//         <CardContent className="flex flex-col gap-3 p-4">
//           <Link href={`/market/${product.id}`}>
//             <h3 className="line-clamp-2 font-semibold text-foreground transition-colors hover:text-green-600">
//               {product.name[language]}
//             </h3>
//           </Link>
//           <p className="line-clamp-2 text-sm text-muted-foreground">{product.description[language]}</p>
//           <div className="mt-auto flex items-center justify-between gap-2">
//             <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}</span>
//             <motion.div whileTap={{ scale: 0.9 }}>
//               <Button
//                 size="sm"
//                 onClick={(e) => {
//                   e.preventDefault()
//                   if (product.inStock && !inCart) {
//                     addItem(product.id)
//                   }
//                 }}
//                 disabled={!product.inStock}
//                 className={inCart ? "gap-1 bg-green-600 hover:bg-green-700" : "gap-1 bg-green-600 hover:bg-green-700"}
//               >
//                 {inCart ? (
//                   <>
//                     <Check className="h-4 w-4" />
//                     <span className="hidden sm:inline">{t("market.inCart")}</span>
//                   </>
//                 ) : (
//                   <>
//                     <ShoppingCart className="h-4 w-4" />
//                     <span className="hidden sm:inline">{t("market.addToCart")}</span>
//                   </>
//                 )}
//               </Button>
//             </motion.div>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   )
// }

"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useLanguage, type Language } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { useSaved } from "@/contexts/saved-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/utils/format"
import { ShoppingCart, Check, Star, Heart } from "lucide-react"

interface Product {
  id: string
  name: Record<Language, string>
  description: Record<Language, string>
  price: number
  image: string
  category: string
  inStock: boolean
  rating: number
}

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { language, t } = useLanguage()
  const { addItem, getItemQuantity } = useCart()
  const { isSaved, toggleSaved } = useSaved()

  const inCart = getItemQuantity(product.id) > 0
  const saved = isSaved(product.id)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.05 }}
      className="w-full"
    >
      <Card className="group h-full w-full overflow-hidden transition-all hover:shadow-lg">
        <Link href={`/market/${product.id}`}>
          <div className="relative aspect-square overflow-hidden bg-secondary">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name[language]}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <span className="rounded-full bg-destructive px-3 py-1 text-sm font-medium text-destructive-foreground">
                  {t("market.outOfStock")}
                </span>
              </div>
            )}
            {product.rating >= 4.8 && product.inStock && (
              <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-xs font-medium text-white">
                <Star className="h-3 w-3 fill-current" />
                {product.rating}
              </div>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleSaved(product.id)
              }}
              className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                saved ? "bg-red-500 text-white" : "bg-white/80 text-muted-foreground hover:bg-white hover:text-red-500"
              }`}
            >
              <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            </motion.button>
          </div>
        </Link>
        <CardContent className="flex flex-col gap-3 p-4">
          <Link href={`/market/${product.id}`}>
            <h3 className="line-clamp-2 font-semibold text-foreground transition-colors hover:text-green-600">
              {product.name[language]}
            </h3>
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.description[language]}</p>
          <div className="mt-auto flex items-center justify-between gap-2">
            <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}</span>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  if (product.inStock && !inCart) {
                    addItem(product.id)
                  }
                }}
                disabled={!product.inStock}
                className={inCart ? "gap-1 bg-green-600 hover:bg-green-700" : "gap-1 bg-green-600 hover:bg-green-700"}
              >
                {inCart ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("market.inCart")}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("market.addToCart")}</span>
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}