// components/driverPortal/OrdersSection.tsx

"use client";

import { Dispatch, SetStateAction } from "react";
import { USE_MOCK_DATA, mockDriver } from "./mockData";
import RegularButton from "../../app/components/RegularButton";

interface accountSectionProps {
    setShowOrderDetails: Dispatch<SetStateAction<boolean>>;
}

export default function OrdersSection({ setShowOrderDetails }: accountSectionProps) {
    // Use mock data if enabled
    const driver = USE_MOCK_DATA ? mockDriver : {
        name: "John",
        email: "john@gmail.com",
        phone: "079 412 76 98",
        vehicleType: "Car",
        licensePlate: "ZH 123456",
    };

    return (
        <section className="flex justify-center w-full pt-32">
            <div
                style={{ backgroundColor: '#E8D7B4' }}
                className="w-full max-w-[900px] shadow-lg text-black opacity-70 mb-6 p-4"
            >
                <h2 className="text-[14px] font-bold text-[#9a0000] mb-2">ACCOUNT SETTINGS</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-2">
                    
                    {/* Personal Information Section */}
                    <div className="flex flex-col space-y-1">
                        <h3 className="text-sm font-bold text-green-800">Personal Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="firstname" className="block text-xs font-bold mb-1 text-black">Firstname</label>
                                <input type="text" id="firstname" value={driver.name} readOnly className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-xs font-semibold" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="lastname" className="block text-xs font-bold mb-1 text-black">Last Name</label>
                                <input type="text" id="lastname" value="Driver" readOnly className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-xs font-semibold" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="email" className="block text-xs font-bold mb-1 text-black">E-Mail Address</label>
                                <input type="text" id="email" value={driver.email} readOnly className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-xs font-semibold" />
                            </div>


                            <div className="flex flex-col">
                                <label htmlFor="phone" className="block text-xs font-bold mb-1 text-black">Telephone Number</label>
                                <input type="text" id="phone" value={driver.phone} readOnly className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-xs font-semibold" />
                            </div>
                        </div>
                        <div className="pt-0.5">
                            <RegularButton 
                                text="CHANGE" 
                                fillColor="#e7903f" 
                                borderColor="#ffffff"
                                fontColor="#000000"
                            />
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="flex flex-col space-y-1">
                        <h3 className="text-sm font-bold text-green-800">Address</h3>
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="postalcode" className="block text-xs font-bold mb-1 text-black">Postal Code</label>
                                    <input type="text" id="postalcode" value="" readOnly className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-xs font-semibold" />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="city" className="block text-xs font-bold mb-1 text-black">City</label>
                                    <input type="text" id="city" value="" readOnly className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-xs font-semibold" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="street" className="block text-xs font-bold mb-1 text-black">Street and House Number</label>
                                <input type="text" id="street" value="" readOnly className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-xs font-semibold" />
                            </div>
                        </div>
                        <div className="pt-0.5">
                            <RegularButton 
                                text="CHANGE" 
                                fillColor="#e7903f" 
                                borderColor="#ffffff"
                                fontColor="#000000"
                            />
                        </div>
                    </div>
                </div>

                {/* Lower Action Buttons */}
                <div className="mt-2 pt-2">
                    <div className="flex flex-row items-center gap-4 w-full">
                         <RegularButton 
                            text="CHANGE PASSWORD" 
                            fillColor="#b55e13" 
                            borderColor="#ffffff"
                            fontColor="#ffffff"
                            // fontSize="text-[1px]"
                         />
                         <RegularButton 
                            text="DELETE ACCOUNT" 
                            fillColor="#b55e13" 
                            borderColor="#ffffff"
                            fontColor="#ffffff"
                            // fontSize="text-[13px]"
                         />
                    </div>
                </div>
            </div>
        </section>
    );
}
