// components/driverPortal/OrdersSection.tsx

"use client";

import { Dispatch, SetStateAction, useState } from "react";

interface OrdersSectionProps {
    setShowOrderDetails: Dispatch<SetStateAction<boolean>>;
}

export default function OrdersSection({ setShowOrderDetails }: OrdersSectionProps) {
    // State to control the visibility of the pickup zone selection modal
    const [showPickupZoneModal, setShowPickupZoneModal] = useState(false);
    
    // State to hold the currently active pickup zone
    const [pickupZone, setPickupZone] = useState("Zürich");
    
    // State to manage the selection within the modal
    const [selectedZone, setSelectedZone] = useState(pickupZone);

    // List of available pickup zones
    const zones = ["Basel", "Bern", "Luzern", "Olten"];

    // Handler for saving the new pickup zone
    const handleSave = () => {
        setPickupZone(selectedZone); // Update the main pickup zone
        setShowPickupZoneModal(false); // Close the modal
    };

    // Handler for canceling the change
    const handleCancel = () => {
        setSelectedZone(pickupZone); // Reset selection to the original zone
        setShowPickupZoneModal(false); // Close the modal
    };

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
                <div className="z-10 relative p-4">
                    <div className="flex flex-col w-full p-2">
                        <div className="flex flex-row justify-between items-start gap-1 w-full">
                            {/* Button section */}
                            <div className="flex flex-row gap-1 w-full">
                                <button onClick={() => setShowOrderDetails(true)} className="flex items-center bg-blue-900 p-1 px-2.5 text-white text-[9px] md:text-[12px] rounded-sm">
                                    NEW
                                    <span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">3</span>
                                </button>
                                <button className="flex items-center bg-blue-500 p-1 px-2.5 text-white text-[9px] md:text-[12px] rounded-sm">
                                    ASSIGNED TO ME
                                    <span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">0</span>
                                </button>
                                <button className="flex items-center bg-blue-500 p-1 px-2.5 text-white text-[9px] md:text-[12px] rounded-sm">
                                    ORDER HISTROY
                                    <span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">0</span>
                                </button>
                            </div>
                            <div className="flex flex-row items-center justify-end gap-3 w-full">
                                <span className="text-text-[6px] md:text-[10px] font-semibold whitespace-nowrap">Your Pick Up Zone is set to {pickupZone}</span>
                                <button onClick={() => setShowPickupZoneModal(true)} className="text-white font-bold py-1 px-2 rounded-md transition-colors duration-200 shadow-lg text-[8px] md:text-[9px] bg-red-900 hover:bg-red-800">
                                    CHANGE PICK UP ZONE
                                </button>
                            </div>
                        </div>

                        {/* ===== Change Pickup Zone Modal ===== */}
                        {showPickupZoneModal && (
                            <div className="absolute top-12 right-4 bg-yellow-200 border-2 border-gray-300 p-5 rounded-lg shadow-xl z-30 w-72">
                                <div className="flex flex-col">
                                    {zones.map((zone) => (
                                        <label key={zone} className="flex items-center space-x-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="pickupZone"
                                                value={zone}
                                                checked={selectedZone === zone}
                                                onChange={() => setSelectedZone(zone)}
                                                className="form-radio h-4 w-4 text-red-900"
                                            />
                                            <span className="text-black font-medium">{zone}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="flex justify-center gap-3 mt-2">
                                    <button onClick={handleSave} className="bg-red-900 hover:bg-red-800 text-white font-bold py-1 px-4 rounded-md shadow-md text-sm">
                                        SAVE
                                    </button>
                                    <button onClick={handleCancel} className="bg-red-900 hover:bg-red-800 text-white font-bold py-1 px-4 rounded-md shadow-md text-sm">
                                        CANCEL
                                    </button>
                                </div>
                            </div>
                        )}


                        {/* Table section */}
                        <div className="flex flex-row w-full mt-2">
                            <table className="w-full">
                                <thead className="bg-yellow-100 w-full">
                                    <tr>
                                        <th className="py-2 text-left text-black pl-2 font-semibold text-sm">Deliver From</th>
                                        <th className="py-2 text-left text-black font-semibold text-sm">Deliver to</th>
                                        <th className="py-2 text-left text-black font-semibold text-sm">Delivery Schedule</th>
                                    </tr>
                                </thead>
                                <tbody className="w-full">
                                    {/* Each row, when clicked, will trigger the state change */}
                                    {[1, 2, 3].map(id => (
                                        <tr key={id} className="w-full cursor-pointer hover:bg-gray-100" onClick={() => setShowOrderDetails(true)}>
                                            <td className="py-1 pl-2">Restaurant African 1, Zürich</td>
                                            <td className="py-1">Amzace 75, Zürich</td>
                                            <td className="py-1">10.07.2025, 13:45</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
