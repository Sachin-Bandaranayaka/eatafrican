// components/driverPortal/OrdersSection.tsx

"use client";

import { Dispatch, SetStateAction } from "react";

interface accountSectionProps {
    setShowOrderDetails: Dispatch<SetStateAction<boolean>>;
}

export default function OrdersSection({ setShowOrderDetails }: accountersSectionProps) {
    return (
        <section className="flex flex-col space-y-3 z-10">
            <div className="flex flex-col w-full h-[80vh] mb-12 shadow-md overflow-hidden border-2 border-[#f1c232] relative -mt-2 rounded-[8px]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: "white",
                        opacity: '70%',
                        zIndex: 1,
                        borderRadius: "8px"
                    }}
                ></div>
                 {/* Content Wrapper */}
                 <div className="relative z-20 p-6 sm:p-8 lg:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
                        
                        {/* Personal Information Section */}
                        <div className="flex flex-col space-y-3">
                            <h2 className="text-[16px] font-bold text-green-900">Personal Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex flex-col">
                                    <label htmlFor="firstname" className="mb-1 text-sm font-semibold text-black">Firstname</label>
                                    <input type="text" id="firstname" value="John" readOnly className="pl-1 border border-black rounded-sm bg-white shadow-sm focus:ring-2 focus:ring-[#f1c232] outline-none" />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="lastname" className="mb-1 text-sm font-semibold text-black">Last Name</label>
                                    <input type="text" id="lastname" value="Dankbarkeit" readOnly className="pl-1 border border-black rounded-sm bg-white shadow-sm focus:ring-2 focus:ring-[#f1c232] outline-none" />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="email" className="mb-1 text-sm font-semibold text-black">E-Mail Address</label>
                                    <input type="text" id="email" value="john@gmail.com" readOnly className="pl-1 border border-black rounded-sm bg-white shadow-sm focus:ring-2 focus:ring-[#f1c232] outline-none" />
                                </div>


                                <div className="flex flex-col">
                                    <label htmlFor="phone" className="mb-1 text-sm font-semibold text-black">Telephone Number</label>
                                    <input type="text" id="phone" value="079 412 76 98" readOnly className="pl-1 border border-black rounded-sm bg-white shadow-sm focus:ring-2 focus:ring-[#f1c232] outline-none" />
                                </div>
                            </div>
                            <div className="pt-1">
                                <button className="bg-[#f0ad4e] text-sm text-black font-bold px-6 border rounded-lg hover:bg-[#ec971f] transition-colors">
                                    CHANGE
                                </button>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="flex flex-col space-y-3">
                            <h2 className="text-[16px] font-bold text-green-900">Address</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex flex-col">
                                    <label htmlFor="postalcode" className="mb-1 text-sm font-semibold text-black">Postal Code</label>
                                    <input type="text" id="postalcode" value="4210" readOnly className="pl-2 border border-black rounded-sm bg-white shadow-sm focus:ring-2 focus:ring-[#f1c232] outline-none" />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="city" className="mb-1 text-sm font-semibold text-black">City</label>
                                    <input type="text" id="city" value="Zurich" readOnly className="pl-2 border border-black rounded-sm bg-white shadow-sm focus:ring-2 focus:ring-[#f1c232] outline-none" />
                                </div>
                                <div className="sm:col-span-2 flex flex-col">
                                    <label htmlFor="street" className="mb-1 text-sm font-semibold text-black">Street and House Number</label>
                                    <input type="text" id="street" value="Kaice 43" readOnly className="pl-2 border border-black rounded-sm bg-white shadow-sm focus:ring-2 focus:ring-[#f1c232] outline-none" />
                                </div>
                            </div>
                             <div className="pt-1">
                                <button className="bg-[#f0ad4e] text-sm text-black font-bold px-6 border rounded-lg hover:bg-[#ec971f] transition-colors ">
                                    CHANGE
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Lower Action Buttons */}
                    <div className="mt-8 pt-8">
                        <div className="flex flex-col sm:flex-col items-start gap-4 w-44">
                             <button className="bg-[#EE786D] w-full text-[13px] py-0.5 text-white font-bold border px-4 rounded-lg hover:bg-[#d9534f] transition-colors shadow">
                                CHANGE PASSWORD
                            </button>
                             <button className="bg-[#EE786D] w-full text-[13px] py-0.5 text-white font-bold border px-4 rounded-lg hover:bg-[#c9302c] transition-colors shadow">
                                DELETE ACCOUNT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}