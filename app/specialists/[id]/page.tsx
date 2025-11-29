// "use client"

// import { useState, useEffect } from "react"
// import { useRouter, useParams } from "next/navigation"
// import { motion, AnimatePresence } from "framer-motion"
// import Image from "next/image"
// import dynamic from "next/dynamic"
// import { useAuth } from "@/contexts/auth-context"
// import { useLanguage } from "@/contexts/language-context"
// import { Header } from "@/components/layout/header"
// import { MobileNav } from "@/components/layout/mobile-nav"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { useToast } from "@/hooks/use-toast"
// import {
//   formatCardNumber,
//   validateCardNumber,
//   isValidUzbekCard,
//   formatExpiryDate,
// } from "@/utils/format"
// import {
//   ArrowLeft,
//   Star,
//   MapPin,
//   Clock,
//   Phone,
//   Video,
//   Building2,
//   Calendar as CalendarIcon,
//   CreditCard,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react"
// import { format } from "date-fns"
// import Link from "next/link"
// import specialistsData from "@/data/specialists.json"
// import { cn } from "@/lib/utils"

// const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
// const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
// const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
// const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

// type ConsultationType = "office" | "phone" | "zoom" | null

// export default function SpecialistDetailPage() {
//   const params = useParams()
//   const router = useRouter()
//   const { isAuthenticated, phone: userPhone } = useAuth()
//   const { t, language } = useLanguage()
//   const { toast } = useToast()

//   const [specialist, setSpecialist] = useState<any>(null)
//   const [consultationType, setConsultationType] = useState<ConsultationType>(null)
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
//   const [selectedTime, setSelectedTime] = useState<string>("")
//   const [selectedPhone, setSelectedPhone] = useState<string>(userPhone || "")
//   const [cardNumber, setCardNumber] = useState("")
//   const [expiryDate, setExpiryDate] = useState("")
//   const [cvv, setCvv] = useState("")
//   const [cardError, setCardError] = useState("")
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [leafletLoaded, setLeafletLoaded] = useState(false)
//   const [customIcon, setCustomIcon] = useState<any>(null)

//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push("/auth/login")
//       return
//     }

//     const foundSpecialist = specialistsData.specialists.find((s) => s.id === params.id)
//     if (!foundSpecialist) {
//       router.push("/specialists")
//       return
//     }

//     setSpecialist({
//       ...foundSpecialist,
//       specialization: foundSpecialist.specialization[language as "uz" | "ru" | "en"] || foundSpecialist.specialization.uz,
//       clinicName: foundSpecialist.clinicName[language as "uz" | "ru" | "en"] || foundSpecialist.clinicName.uz,
//       clinicAddress: foundSpecialist.clinicAddress[language as "uz" | "ru" | "en"] || foundSpecialist.clinicAddress.uz,
//       workingHours: foundSpecialist.workingHours[language as "uz" | "ru" | "en"] || foundSpecialist.workingHours.uz,
//       description: foundSpecialist.description[language as "uz" | "ru" | "en"] || foundSpecialist.description.uz,
//     })
//   }, [params.id, isAuthenticated, router, language])

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       import("leaflet").then((L) => {
//         import("leaflet/dist/leaflet.css")
//         const icon = L.icon({
//           iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//           iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//           shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//           iconSize: [25, 41],
//           iconAnchor: [12, 41],
//           popupAnchor: [1, -34],
//           shadowSize: [41, 41],
//         })
//         setCustomIcon(icon)
//         setLeafletLoaded(true)
//       })
//     }
//   }, [])

//   if (!specialist) {
//     return null
//   }

//   const handleConsultationSelect = (type: ConsultationType) => {
//     setConsultationType(type)
//     setCardNumber("")
//     setExpiryDate("")
//     setCvv("")
//     setCardError("")
//     setSelectedDate(undefined)
//     setSelectedTime("")
//     if (type === "phone" && userPhone) {
//       setSelectedPhone(userPhone)
//     }
//   }

//   const handleCardNumberChange = (value: string) => {
//     const formatted = formatCardNumber(value)
//     setCardNumber(formatted)
//     setCardError("")
//   }

//   const handleExpiryDateChange = (value: string) => {
//     const formatted = formatExpiryDate(value)
//     setExpiryDate(formatted)
//   }

//   const handlePayment = () => {
//     if (!consultationType) return

//     // Validate card
//     const cardDigits = cardNumber.replace(/\D/g, "")
//     if (cardDigits.length !== 16) {
//       setCardError(t("checkout.enterValidCard"))
//       return
//     }

//     // Check if it's a valid Uzbek card or standard card format (first digit should be valid)
//     const firstDigit = cardDigits[0]
//     const firstFour = cardDigits.slice(0, 4)
    
//     // Accept Uzbek cards (8600, 9860) or standard cards (starting with 3, 4, 5, 6)
//     const isValidFormat = 
//       firstFour === "8600" || 
//       firstFour === "9860" || 
//       ["3", "4", "5", "6"].includes(firstDigit)
    
//     if (!isValidFormat) {
//       setCardError(t("checkout.invalidCard"))
//       return
//     }

//     if (!expiryDate || expiryDate.length !== 5) {
//       setCardError(t("checkout.enterValidCard"))
//       return
//     }

//     if (!cvv || cvv.length !== 3) {
//       setCardError(t("checkout.enterValidCard"))
//       return
//     }

//     if (consultationType === "office" && (!selectedDate || !selectedTime)) {
//       toast({
//         title: t("common.error"),
//         description: t("specialists.selectDate") + " " + t("specialists.selectTime"),
//         variant: "destructive",
//       })
//       return
//     }

//     if (consultationType === "phone" && !selectedPhone) {
//       toast({
//         title: t("common.error"),
//         description: t("specialists.selectPhoneNumber"),
//         variant: "destructive",
//       })
//       return
//     }

//     setIsProcessing(true)

//     // Simulate payment processing
//     setTimeout(() => {
//       setIsProcessing(false)
//       let message = ""

//       // Save appointment to localStorage
//       const appointmentId = `appt-${Date.now()}`
//       const appointment = {
//         id: appointmentId,
//         specialistId: specialist.id,
//         specialistName: specialist.name,
//         specialistSpecialization: specialist.specialization,
//         clinicName: specialist.clinicName,
//         clinicAddress: specialist.clinicAddress,
//         location: specialist.location,
//         consultationType,
//         date: consultationType === "office" && selectedDate ? selectedDate.toISOString() : null,
//         time: consultationType === "office" && selectedTime ? selectedTime : null,
//         phone: consultationType === "phone" ? selectedPhone : null,
//         floor: consultationType === "office" ? Math.floor(Math.random() * 5) + 1 : null,
//         room: consultationType === "office" ? Math.floor(Math.random() * 20) + 1 : null,
//         price: consultationType === "phone" || consultationType === "zoom" ? 50000 : 0,
//         status: consultationType === "office" ? "pending" : "confirmed",
//         hasMessage: consultationType === "office",
//         createdAt: new Date().toISOString(),
//       }

//       const existingAppointments = localStorage.getItem("agromind-appointments")
//       const appointments = existingAppointments ? JSON.parse(existingAppointments) : []
//       appointments.push(appointment)
//       localStorage.setItem("agromind-appointments", JSON.stringify(appointments))

//       if (consultationType === "office") {
//         message = t("specialists.smsSentBooking")
//       } else if (consultationType === "zoom") {
//         message = t("specialists.smsSentZoom") + " " + t("specialists.problemsContact")
//       } else if (consultationType === "phone") {
//         message = t("specialists.smsSentPhone")
//       }

//       toast({
//         title: t("specialists.smsSent"),
//         description: message,
//       })

//       // Reset form
//       setConsultationType(null)
//       setCardNumber("")
//       setExpiryDate("")
//       setCvv("")
//       setSelectedDate(undefined)
//       setSelectedTime("")
//       setSelectedPhone(userPhone || "")
//     }, 1500)
//   }

//   const timeSlots = [
//     "09:00",
//     "10:00",
//     "11:00",
//     "12:00",
//     "13:00",
//     "14:00",
//     "15:00",
//     "16:00",
//     "17:00",
//     "18:00",
//   ]

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />
//       <main className="container mx-auto px-3 pb-24 pt-6 md:px-4 md:pb-8 md:pt-8">
//         {/* Back Button */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="mb-4 md:mb-6"
//         >
//           <Link href="/specialists">
//             <Button variant="ghost" size="sm" className="gap-2">
//               <ArrowLeft className="h-4 w-4" />
//               {t("specialists.back")}
//             </Button>
//           </Link>
//         </motion.div>

//         <div className="grid gap-6 lg:grid-cols-3">
//           {/* Left Column - Specialist Info */}
//           <div className="lg:col-span-2">
//             {/* Specialist Header */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-6"
//             >
//               <Card>
//                 <CardContent className="p-4 md:p-6">
//                   <div className="flex flex-col gap-4 sm:flex-row">
//                     <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-green-600 sm:h-32 sm:w-32">
//                       <Image src={specialist.photo} alt={specialist.name} fill className="object-cover" />
//                     </div>
//                     <div className="flex-1">
//                       <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">{specialist.name}</h1>
//                       <p className="mb-3 text-base text-muted-foreground md:text-lg">{specialist.specialization}</p>
//                       <div className="flex flex-wrap items-center gap-3">
//                         <div className="flex items-center gap-1">
//                           <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                           <span className="font-semibold">{specialist.rating}</span>
//                           <span className="text-sm text-muted-foreground">
//                             ({specialist.reviews} {t("specialists.reviews")})
//                           </span>
//                         </div>
//                         <Badge variant="secondary">{specialist.experience} {t("specialists.years")} {t("specialists.experience")}</Badge>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             {/* Description */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="mb-6"
//             >
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg md:text-xl">{t("specialists.specialization")}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-muted-foreground">{specialist.description}</p>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             {/* Map */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="mb-6"
//             >
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
//                     <MapPin className="h-5 w-5" />
//                     {t("specialists.clinicAddress")}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="mb-4 text-muted-foreground">{specialist.clinicAddress}</p>
//                   {leafletLoaded && customIcon && (
//                     <div className="h-[300px] w-full overflow-hidden rounded-lg border md:h-[400px]">
//                       <MapContainer
//                         center={specialist.location}
//                         zoom={15}
//                         style={{ height: "100%", width: "100%" }}
//                         scrollWheelZoom={false}
//                       >
//                         <TileLayer
//                           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         />
//                         <Marker position={specialist.location} icon={customIcon}>
//                           <Popup>
//                             <div>
//                               <p className="font-semibold">{specialist.clinicName}</p>
//                               <p className="text-sm">{specialist.clinicAddress}</p>
//                             </div>
//                           </Popup>
//                         </Marker>
//                       </MapContainer>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </motion.div>

//             {/* Consultation Options */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//             >
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg md:text-xl">{t("specialists.consultationType")}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <Tabs
//                     value={consultationType || ""}
//                     onValueChange={(value) => handleConsultationSelect(value as ConsultationType)}
//                     className="w-full"
//                   >
//                     <TabsList className="grid w-full grid-cols-3 mb-4">
//                       <TabsTrigger value="office" className="text-xs sm:text-sm">
//                         <Building2 className="h-4 w-4 mr-2" />
//                         <span className="hidden sm:inline">{t("specialists.officeVisit")}</span>
//                       </TabsTrigger>
//                       <TabsTrigger value="phone" className="text-xs sm:text-sm">
//                         <Phone className="h-4 w-4 mr-2" />
//                         <span className="hidden sm:inline">{t("specialists.phoneConsultation")}</span>
//                       </TabsTrigger>
//                       <TabsTrigger value="zoom" className="text-xs sm:text-sm">
//                         <Video className="h-4 w-4 mr-2" />
//                         <span className="hidden sm:inline">{t("specialists.zoomConsultation")}</span>
//                       </TabsTrigger>
//                     </TabsList>

//                     {/* Office Visit */}
//                     <TabsContent value="office" className="space-y-4">
//                       <div className="rounded-lg border p-4">
//                         <div className="mb-4">
//                           <h3 className="mb-2 font-semibold">{t("specialists.officeVisit")}</h3>
//                           <p className="text-sm text-muted-foreground">{t("specialists.bookAppointment")}</p>
//                         </div>
//                         <div className="space-y-4">
//                           <div>
//                             <Label className="mb-2 block text-sm">{t("specialists.selectDate")}</Label>
//                             <Popover>
//                               <PopoverTrigger asChild>
//                                 <Button
//                                   variant="outline"
//                                   className={cn(
//                                     "w-full justify-start text-left font-normal",
//                                     !selectedDate && "text-muted-foreground",
//                                   )}
//                                 >
//                                   <CalendarIcon className="mr-2 h-4 w-4" />
//                                   {selectedDate ? format(selectedDate, "PPP") : t("specialists.selectDate")}
//                                 </Button>
//                               </PopoverTrigger>
//                               <PopoverContent className="w-auto p-0" align="start">
//                                 <Calendar
//                                   mode="single"
//                                   selected={selectedDate}
//                                   onSelect={setSelectedDate}
//                                   disabled={(date) => date < new Date()}
//                                   initialFocus
//                                 />
//                               </PopoverContent>
//                             </Popover>
//                           </div>
//                           {selectedDate && (
//                             <div>
//                               <Label className="mb-2 block text-sm">{t("specialists.selectTime")}</Label>
//                               <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
//                                 {timeSlots.map((time) => (
//                                   <Button
//                                     key={time}
//                                     variant={selectedTime === time ? "default" : "outline"}
//                                     size="sm"
//                                     onClick={() => setSelectedTime(time)}
//                                     className="text-xs sm:text-sm"
//                                   >
//                                     {time}
//                                   </Button>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </TabsContent>

//                     {/* Phone Consultation */}
//                     <TabsContent value="phone" className="space-y-4">
//                       <div className="rounded-lg border p-4">
//                         <div className="mb-4">
//                           <h3 className="mb-1 font-semibold">{t("specialists.phoneConsultation")}</h3>
//                           <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
//                             <span className="font-semibold text-green-600">{t("specialists.phonePrice")}</span>
//                             <span className="text-muted-foreground">•</span>
//                             <span>{t("specialists.phoneDuration")}</span>
//                             <span className="text-muted-foreground">•</span>
//                             <span className="text-xs text-muted-foreground">
//                               {t("specialists.phoneMaxDuration")}
//                             </span>
//                           </div>
//                           <div>
//                             <Label htmlFor="phone-select" className="mb-2 block text-sm">
//                               {t("specialists.selectPhoneNumber")}
//                             </Label>
//                             <Input
//                               id="phone-select"
//                               type="tel"
//                               placeholder={t("auth.phonePlaceholder")}
//                               value={selectedPhone}
//                               onChange={(e) => setSelectedPhone(e.target.value)}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </TabsContent>

//                     {/* Zoom Consultation */}
//                     <TabsContent value="zoom" className="space-y-4">
//                       <div className="rounded-lg border p-4">
//                         <div className="mb-4">
//                           <h3 className="mb-1 font-semibold">{t("specialists.zoomConsultation")}</h3>
//                           <div className="flex flex-wrap items-center gap-2 text-sm">
//                             <span className="font-semibold text-green-600">{t("specialists.zoomPrice")}</span>
//                             <span className="text-muted-foreground">•</span>
//                             <span>{t("specialists.zoomDuration")}</span>
//                             <span className="text-muted-foreground">•</span>
//                             <span className="text-xs text-muted-foreground">
//                               {t("specialists.zoomMaxDuration")}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </TabsContent>
//                   </Tabs>

//                   {/* Payment Form */}
//                   {consultationType && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: "auto" }}
//                       exit={{ opacity: 0, height: 0 }}
//                       className="mt-6 space-y-4 rounded-lg border bg-muted/50 p-4"
//                     >
//                       <h3 className="font-semibold">{t("specialists.paymentRequired")}</h3>
//                       <div className="space-y-4">
//                         <div>
//                           <Label htmlFor="cardNumber" className="mb-2 block text-sm">
//                             {t("checkout.cardNumber")}
//                           </Label>
//                           <Input
//                             id="cardNumber"
//                             placeholder={t("checkout.cardNumber")}
//                             value={cardNumber}
//                             onChange={(e) => handleCardNumberChange(e.target.value)}
//                             maxLength={19}
//                             className={cardError ? "border-destructive" : ""}
//                           />
//                           {cardError && (
//                             <p className="mt-1 text-xs text-destructive">{cardError}</p>
//                           )}
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div>
//                             <Label htmlFor="expiryDate" className="mb-2 block text-sm">
//                               {t("checkout.expiryDate")}
//                             </Label>
//                             <Input
//                               id="expiryDate"
//                               placeholder="MM/YY"
//                               value={expiryDate}
//                               onChange={(e) => handleExpiryDateChange(e.target.value)}
//                               maxLength={5}
//                             />
//                           </div>
//                           <div>
//                             <Label htmlFor="cvv" className="mb-2 block text-sm">
//                               {t("checkout.cvv")}
//                             </Label>
//                             <Input
//                               id="cvv"
//                               placeholder="CVV"
//                               value={cvv}
//                               onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
//                               maxLength={3}
//                               type="password"
//                             />
//                           </div>
//                         </div>
//                         <Button
//                           onClick={handlePayment}
//                           disabled={isProcessing}
//                           className="w-full"
//                           size="lg"
//                         >
//                           {isProcessing ? (
//                             <span className="flex items-center gap-2">
//                               <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                               {t("common.loading")}
//                             </span>
//                           ) : (
//                             <>
//                               <CreditCard className="mr-2 h-4 w-4" />
//                               {t("specialists.payNow")}
//                             </>
//                           )}
//                         </Button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>

//           {/* Right Column - Contact Info */}
//           <div className="lg:col-span-1">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               <Card className="sticky top-24">
//                 <CardHeader>
//                   <CardTitle className="text-lg md:text-xl">{t("specialists.clinicName")}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <h3 className="mb-1 font-semibold">{specialist.clinicName}</h3>
//                     <p className="text-sm text-muted-foreground">{specialist.clinicAddress}</p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Clock className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-sm font-medium">{t("specialists.workingHours")}</p>
//                       <p className="text-sm text-muted-foreground">{specialist.workingHours}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Phone className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-sm font-medium">{t("specialists.phone")}</p>
//                       <p className="text-sm text-muted-foreground">{specialist.phone}</p>
//                     </div>
//                   </div>
//                   <div className="pt-4 border-t">
//                     <p className="mb-2 text-xs text-muted-foreground">{t("specialists.operatorContact")}</p>
//                     <p className="text-sm font-medium">{specialist.operatorPhone}</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>
//         </div>
//       </main>
//       <MobileNav />
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import {
  formatCardNumber,
  validateCardNumber,
  isValidUzbekCard,
  formatExpiryDate,
} from "@/utils/format"
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  Video,
  Building2,
  Calendar as CalendarIcon,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import specialistsData from "@/data/specialists.json"
import { cn } from "@/lib/utils"

// Leaflet komponentlarini dynamic import qilish
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { 
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg md:h-[400px]" />
  }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

type ConsultationType = "office" | "phone" | "zoom" | null

export default function SpecialistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, phone: userPhone } = useAuth()
  const { t, language } = useLanguage()
  const { toast } = useToast()

  const [specialist, setSpecialist] = useState<any>(null)
  const [consultationType, setConsultationType] = useState<ConsultationType>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedPhone, setSelectedPhone] = useState<string>(userPhone || "")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardError, setCardError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [customIcon, setCustomIcon] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    const foundSpecialist = specialistsData.specialists.find((s) => s.id === params.id)
    if (!foundSpecialist) {
      router.push("/specialists")
      return
    }

    setSpecialist({
      ...foundSpecialist,
      specialization: foundSpecialist.specialization[language as "uz" | "ru" | "en"] || foundSpecialist.specialization.uz,
      clinicName: foundSpecialist.clinicName[language as "uz" | "ru" | "en"] || foundSpecialist.clinicName.uz,
      clinicAddress: foundSpecialist.clinicAddress[language as "uz" | "ru" | "en"] || foundSpecialist.clinicAddress.uz,
      workingHours: foundSpecialist.workingHours[language as "uz" | "ru" | "en"] || foundSpecialist.workingHours.uz,
      description: foundSpecialist.description[language as "uz" | "ru" | "en"] || foundSpecialist.description.uz,
    })
  }, [params.id, isAuthenticated, router, language])

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        import("leaflet/dist/leaflet.css")
        const icon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })
        setCustomIcon(icon)
        setLeafletLoaded(true)
      })
    }
  }, [])

  if (!specialist) {
    return null
  }

  const handleConsultationSelect = (type: ConsultationType) => {
    setConsultationType(type)
    setCardNumber("")
    setExpiryDate("")
    setCvv("")
    setCardError("")
    setSelectedDate(undefined)
    setSelectedTime("")
    if (type === "phone" && userPhone) {
      setSelectedPhone(userPhone)
    }
  }

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value)
    setCardNumber(formatted)
    setCardError("")
  }

  const handleExpiryDateChange = (value: string) => {
    const formatted = formatExpiryDate(value)
    setExpiryDate(formatted)
  }

  const handlePayment = () => {
    if (!consultationType) return

    // Validate card
    const cardDigits = cardNumber.replace(/\D/g, "")
    if (cardDigits.length !== 16) {
      setCardError(t("checkout.enterValidCard"))
      return
    }

    // Check if it's a valid Uzbek card or standard card format (first digit should be valid)
    const firstDigit = cardDigits[0]
    const firstFour = cardDigits.slice(0, 4)
    
    // Accept Uzbek cards (8600, 9860) or standard cards (starting with 3, 4, 5, 6)
    const isValidFormat = 
      firstFour === "8600" || 
      firstFour === "9860" || 
      ["3", "4", "5", "6"].includes(firstDigit)
    
    if (!isValidFormat) {
      setCardError(t("checkout.invalidCard"))
      return
    }

    if (!expiryDate || expiryDate.length !== 5) {
      setCardError(t("checkout.enterValidCard"))
      return
    }

    if (!cvv || cvv.length !== 3) {
      setCardError(t("checkout.enterValidCard"))
      return
    }

    if (consultationType === "office" && (!selectedDate || !selectedTime)) {
      toast({
        title: t("common.error"),
        description: t("specialists.selectDate") + " " + t("specialists.selectTime"),
        variant: "destructive",
      })
      return
    }

    if (consultationType === "phone" && !selectedPhone) {
      toast({
        title: t("common.error"),
        description: t("specialists.selectPhoneNumber"),
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      let message = ""

      // Save appointment to localStorage
      const appointmentId = `appt-${Date.now()}`
      const appointment = {
        id: appointmentId,
        specialistId: specialist.id,
        specialistName: specialist.name,
        specialistSpecialization: specialist.specialization,
        clinicName: specialist.clinicName,
        clinicAddress: specialist.clinicAddress,
        location: specialist.location,
        consultationType,
        date: consultationType === "office" && selectedDate ? selectedDate.toISOString() : null,
        time: consultationType === "office" && selectedTime ? selectedTime : null,
        phone: consultationType === "phone" ? selectedPhone : null,
        floor: consultationType === "office" ? Math.floor(Math.random() * 5) + 1 : null,
        room: consultationType === "office" ? Math.floor(Math.random() * 20) + 1 : null,
        price: consultationType === "phone" || consultationType === "zoom" ? 50000 : 0,
        status: consultationType === "office" ? "pending" : "confirmed",
        hasMessage: consultationType === "office",
        createdAt: new Date().toISOString(),
      }

      const existingAppointments = localStorage.getItem("agromind-appointments")
      const appointments = existingAppointments ? JSON.parse(existingAppointments) : []
      appointments.push(appointment)
      localStorage.setItem("agromind-appointments", JSON.stringify(appointments))

      if (consultationType === "office") {
        message = t("specialists.smsSentBooking")
      } else if (consultationType === "zoom") {
        message = t("specialists.smsSentZoom") + " " + t("specialists.problemsContact")
      } else if (consultationType === "phone") {
        message = t("specialists.smsSentPhone")
      }

      toast({
        title: t("specialists.smsSent"),
        description: message,
      })

      // Reset form
      setConsultationType(null)
      setCardNumber("")
      setExpiryDate("")
      setCvv("")
      setSelectedDate(undefined)
      setSelectedTime("")
      setSelectedPhone(userPhone || "")
    }, 1500)
  }

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ]

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
          <Link href="/specialists">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("specialists.back")}
            </Button>
          </Link>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Specialist Info */}
          <div className="lg:col-span-2">
            {/* Specialist Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-green-600 sm:h-32 sm:w-32">
                      <Image src={specialist.photo} alt={specialist.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">{specialist.name}</h1>
                      <p className="mb-3 text-base text-muted-foreground md:text-lg">{specialist.specialization}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{specialist.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({specialist.reviews} {t("specialists.reviews")})
                          </span>
                        </div>
                        <Badge variant="secondary">{specialist.experience} {t("specialists.years")} {t("specialists.experience")}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">{t("specialists.specialization")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{specialist.description}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <MapPin className="h-5 w-5" />
                    {t("specialists.clinicAddress")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">{specialist.clinicAddress}</p>
                  {leafletLoaded && customIcon && (
                    <div className="h-[300px] w-full overflow-hidden rounded-lg border md:h-[400px] relative z-0">
                      <MapContainer
                        center={specialist.location}
                        zoom={15}
                        style={{ height: "100%", width: "100%" }}
                        scrollWheelZoom={false}
                        className="z-0"
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={specialist.location} icon={customIcon}>
                          <Popup className="z-0">
                            <div>
                              <p className="font-semibold">{specialist.clinicName}</p>
                              <p className="text-sm">{specialist.clinicAddress}</p>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Consultation Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">{t("specialists.consultationType")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={consultationType || ""}
                    onValueChange={(value) => handleConsultationSelect(value as ConsultationType)}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="office" className="text-xs sm:text-sm">
                        <Building2 className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">{t("specialists.officeVisit")}</span>
                      </TabsTrigger>
                      <TabsTrigger value="phone" className="text-xs sm:text-sm">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">{t("specialists.phoneConsultation")}</span>
                      </TabsTrigger>
                      <TabsTrigger value="zoom" className="text-xs sm:text-sm">
                        <Video className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">{t("specialists.zoomConsultation")}</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Office Visit */}
                    <TabsContent value="office" className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="mb-4">
                          <h3 className="mb-2 font-semibold">{t("specialists.officeVisit")}</h3>
                          <p className="text-sm text-muted-foreground">{t("specialists.bookAppointment")}</p>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label className="mb-2 block text-sm">{t("specialists.selectDate")}</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !selectedDate && "text-muted-foreground",
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {selectedDate ? format(selectedDate, "PPP") : t("specialists.selectDate")}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 z-50" align="start">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          {selectedDate && (
                            <div>
                              <Label className="mb-2 block text-sm">{t("specialists.selectTime")}</Label>
                              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                                {timeSlots.map((time) => (
                                  <Button
                                    key={time}
                                    variant={selectedTime === time ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedTime(time)}
                                    className="text-xs sm:text-sm"
                                  >
                                    {time}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Phone Consultation */}
                    <TabsContent value="phone" className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="mb-4">
                          <h3 className="mb-1 font-semibold">{t("specialists.phoneConsultation")}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
                            <span className="font-semibold text-green-600">{t("specialists.phonePrice")}</span>
                            <span className="text-muted-foreground">•</span>
                            <span>{t("specialists.phoneDuration")}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {t("specialists.phoneMaxDuration")}
                            </span>
                          </div>
                          <div>
                            <Label htmlFor="phone-select" className="mb-2 block text-sm">
                              {t("specialists.selectPhoneNumber")}
                            </Label>
                            <Input
                              id="phone-select"
                              type="tel"
                              placeholder={t("auth.phonePlaceholder")}
                              value={selectedPhone}
                              onChange={(e) => setSelectedPhone(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Zoom Consultation */}
                    <TabsContent value="zoom" className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="mb-4">
                          <h3 className="mb-1 font-semibold">{t("specialists.zoomConsultation")}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-semibold text-green-600">{t("specialists.zoomPrice")}</span>
                            <span className="text-muted-foreground">•</span>
                            <span>{t("specialists.zoomDuration")}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {t("specialists.zoomMaxDuration")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Payment Form */}
                  {consultationType && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 space-y-4 rounded-lg border bg-muted/50 p-4"
                    >
                      <h3 className="font-semibold">{t("specialists.paymentRequired")}</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber" className="mb-2 block text-sm">
                            {t("checkout.cardNumber")}
                          </Label>
                          <Input
                            id="cardNumber"
                            placeholder={t("checkout.cardNumber")}
                            value={cardNumber}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            maxLength={19}
                            className={cardError ? "border-destructive" : ""}
                          />
                          {cardError && (
                            <p className="mt-1 text-xs text-destructive">{cardError}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate" className="mb-2 block text-sm">
                              {t("checkout.expiryDate")}
                            </Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={expiryDate}
                              onChange={(e) => handleExpiryDateChange(e.target.value)}
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv" className="mb-2 block text-sm">
                              {t("checkout.cvv")}
                            </Label>
                            <Input
                              id="cvv"
                              placeholder="CVV"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                              maxLength={3}
                              type="password"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={handlePayment}
                          disabled={isProcessing}
                          className="w-full"
                          size="lg"
                        >
                          {isProcessing ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              {t("common.loading")}
                            </span>
                          ) : (
                            <>
                              <CreditCard className="mr-2 h-4 w-4" />
                              {t("specialists.payNow")}
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
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
                  <CardTitle className="text-lg md:text-xl">{t("specialists.clinicName")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-1 font-semibold">{specialist.clinicName}</h3>
                    <p className="text-sm text-muted-foreground">{specialist.clinicAddress}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                    <p className="text-sm font-medium">{t("specialists.workingHours")}</p>
                      <p className="text-sm text-muted-foreground">{specialist.workingHours}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{t("specialists.phone")}</p>
                      <p className="text-sm text-muted-foreground">{specialist.phone}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="mb-2 text-xs text-muted-foreground">{t("specialists.operatorContact")}</p>
                    <p className="text-sm font-medium">{specialist.operatorPhone}</p>
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