// "use client"

// import { useState, useEffect } from "react"
// import { ChevronRight, Check } from "lucide-react"
// import Image from "next/image"
// import { useLocationContext } from "@/lib/location-context"

// interface MobileTabsProps {
//   activeTab: "how-it-works" | "customer-feedback"
//   setActiveTab: (tab: "how-it-works" | "customer-feedback") => void
// }

// export default function MobileTabs({ activeTab, setActiveTab }: MobileTabsProps) {
//   const [showContent, setShowContent] = useState(false)
//   const [hasMounted, setHasMounted] = useState(false)
//   const [activeFeedbackPage, setActiveFeedbackPage] = useState(1)
//   const { t } = useLocationContext()

//   useEffect(() => {
//     setHasMounted(true)
//   }, [])

//   const handleTabClick = (tab: "how-it-works" | "customer-feedback") => {
//     if (activeTab === tab && showContent) {
//       setShowContent(false)
//     } else {
//       setActiveTab(tab)
//       setShowContent(true)
//     }
//   }

//   if (!hasMounted) {
//     return null
//   }

//   return (
//     <div className="w-full">
//       <div className="flex justify-between mt-4 mb-2">
//         <button
//           className="flex items-center text-xs"
//           onClick={() => handleTabClick("how-it-works")}
//         >
//           {showContent && activeTab === "how-it-works" ? (
//             <Check className="w-4 h-4 mr-1 text-yellow-400" />
//           ) : (
//             <ChevronRight className="w-4 h-4 mr-1" />
//           )}
//           <span className={showContent && activeTab === "how-it-works" ? "text-yellow-400" : "text-white"}>
//             {t('how_it_works')}
//           </span>
//         </button>
//         <button
//           className="flex items-center text-xs"
//           onClick={() => handleTabClick("customer-feedback")}
//         >
//           {showContent && activeTab === "customer-feedback" ? (
//             <Check className="w-4 h-4 mr-1 text-yellow-400" />
//           ) : (
//             <ChevronRight className="w-4 h-4 mr-1" />
//           )}
//           <span className={showContent && activeTab === "customer-feedback" ? "text-yellow-400" : "text-white"}>
//             {t('customer_feedback')}
//           </span>
//         </button>
//       </div>

//       {showContent && activeTab === "how-it-works" && (
//         <div className="fixed inset-0 bg-black/90 z-50 pt-14">
//           <div className="px-4 max-w-md mx-auto">
//             {/* Chef Image for Mobile How It Works */}
//             <div className="relative w-full h-44 mb-5">
//               <Image
//                 src="/images/chefs2.png"
//                 alt="African chefs cooking"
//                 fill
//                 className="object-contain"
//                 priority
//               />
//             </div>

//             <div className="bg-[#D2B48C]/60 rounded-lg p-3 mb-3 w-full">
//               <div className="flex items-center mb-1.5">
//                 <div className="w-2.5 h-2.5 rounded-full bg-red-600 mr-2"></div>
//                 <h3 className="text-white text-xs uppercase">STEP 1: CLICK ON LOCATION AND SELECT A RESTAURANT</h3>
//               </div>
//               <div className="flex justify-end">
//                 <div className="bg-[#f0e6d9]/70 rounded px-3 py-1">
//                   <p className="text-xs">LOTIE OR SVG</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-[#D2B48C]/60 rounded-lg p-3 mb-3 w-full">
//               <div className="flex items-center mb-1.5">
//                 <div className="w-2.5 h-2.5 rounded-full bg-red-600 mr-2"></div>
//                 <h3 className="text-white text-xs uppercase">STEP 2: CHOOSE YOUR MEAL AND ORDER</h3>
//               </div>
//               <div className="flex justify-end">
//                 <div className="bg-[#f0e6d9]/70 rounded px-3 py-1">
//                   <p className="text-xs">LOTIE OR SVG</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-[#D2B48C]/60 rounded-lg p-3 mb-3 w-full">
//               <div className="flex items-center mb-1.5">
//                 <div className="w-2.5 h-2.5 rounded-full bg-red-600 mr-2"></div>
//                 <h3 className="text-white text-xs uppercase">STEP 3: WE DELIVER YOUR MEAL</h3>
//               </div>
//               <div className="flex justify-end">
//                 <div className="bg-[#f0e6d9]/70 rounded px-3 py-1">
//                   <p className="text-xs">LOTIE OR SVG</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showContent && activeTab === "customer-feedback" && (
//         <div className="fixed inset-0 bg-black/90 z-50 pt-14">
//           <div className="px-4 max-w-md mx-auto h-full flex flex-col">
//             {activeFeedbackPage === 1 ? (
//               <>
//                 <div className="grid grid-cols-2 gap-3 w-full">
//                   {[1, 2, 3, 4].map((i) => (
//                     <div key={i} className="bg-[#D2B48C]/60 rounded-lg p-2.5 h-20 flex items-center justify-center">
//                       <p className="text-white text-xs text-center">Customer Feedback {i}</p>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-5 w-full flex justify-center">
//                   <button className="bg-[#D2B48C]/70 rounded-md px-6 py-1.5 text-white text-xs">
//                     LEAVE FEEDBACK
//                   </button>
//                 </div>

//                 <div className="mt-auto mb-8 flex justify-center gap-2 w-full">
//                   {[1, 2, 3].map((i) => (
//                     <button
//                       key={i}
//                       className={`w-3 h-3 rounded-full ${i === activeFeedbackPage ? "bg-yellow-400" : "bg-white/50"}`}
//                       onClick={() => setActiveFeedbackPage(i)}
//                     ></button>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="grid grid-cols-2 gap-3 w-full">
//                   {[1, 2, 3, 4].map((i) => (
//                     <div key={`page-${activeFeedbackPage}-${i}`} className="bg-[#D2B48C]/60 rounded-lg p-2.5 h-20 flex items-center justify-center">
//                       <p className="text-white text-xs text-center">Customer Feedback {i + ((activeFeedbackPage - 1) * 4)}</p>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-auto mb-8 flex justify-center gap-2 w-full">
//                   {[1, 2, 3].map((i) => (
//                     <button
//                       key={i}
//                       className={`w-3 h-3 rounded-full ${i === activeFeedbackPage ? "bg-yellow-400" : "bg-white/50"}`}
//                       onClick={() => setActiveFeedbackPage(i)}
//                     ></button>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

