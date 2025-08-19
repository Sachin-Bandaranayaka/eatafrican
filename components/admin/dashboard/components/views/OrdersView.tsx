"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const OrdersView = () => {
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    return (
        <>
            {!showOrderDetails && (
                <div className="flex flex-col w-4/5 p-2 ">
                    <div className="flex flex-row gap-1 w-full">
                        <button className="flex bg-blue-900 p-1 px-2 text-white text-[9px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">ALL<span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">0</span></button>
                        <button onClick={() => setShowOrderDetails(true)} className="flex bg-blue-500 p-1 px-2.5 text-white text-[9px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">NEW<span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">0</span></button>
                        <button className="flex bg-blue-500 p-1 px-2.5 text-white text-[9px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">PROCESSING<span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">0</span></button>
                        <button className="flex bg-blue-500 p-1 px-2.5 text-white text-[9px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">IN TRANSIT<span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">0</span></button>
                        <button className="flex bg-blue-500 p-1 px-2.5 text-white text-[9px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">CANCELLED<span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">0</span></button>
                        <button className="flex bg-blue-500 p-1 px-2.5 text-white text-[9px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">COMPLETED<span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">0</span></button>
                    </div>
                    <div className="flex flex-row w-full mt-2">
                        <table className="w-full">
                            <thead className="bg-[#ff9920] w-full">
                                <tr>
                                    <th className="py-1 px-1 text-left text-black w-[27%]">Order</th>
                                    <th className="py-1 text-left text-black w-[20%]">Location</th>
                                    <th className="py-1 text-left text-black w-[20%]">Date, Time</th>
                                    <th className="py-1 text-left text-black w-[20%] pl-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="w-full">
                                <tr className="w-full cursor-pointer hover:bg-gray-100" onClick={() => setShowOrderDetails(true)}>
                                    <td>#85025  Todaie Locnag</td><td>Zurich</td><td>10.07.2025  13:45</td><td className="pl-6">New</td>
                                </tr>
                                <tr className="w-full cursor-pointer hover:bg-gray-100" onClick={() => setShowOrderDetails(true)}>
                                    <td>#85025  Todaie Locnag</td><td>Zurich</td><td>10.07.2025  13:45</td><td className="pl-6">New</td>
                                </tr>
                                <tr className="w-full cursor-pointer hover:bg-gray-100" onClick={() => setShowOrderDetails(true)}>
                                    <td>#85025  Todaie Locnag</td><td>Zurich</td><td>10.07.2025  13:45</td><td className="pl-6">New</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-[9px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px] mb-1 text-black font-bold mt-3">Lorem ipsom dolor sit amet, consetetur</p>
                </div>
            )}
            {showOrderDetails && (
                <div className="flex flex-col w-full px-2 ">
                    <div className="flex flex-row justify-between items-between w-full mb-3">
                        <h3 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold text-[#274e13]">Order #1740</h3>
                        <button onClick={() => setShowOrderDetails(false)} className="w-auto bg-red-900 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-800 transition-colors duration-200 shadow-lg text-[9px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">ALL ORDERS</button>
                    </div>
                    <div className="flex flex-row w-full px-2 gap-6">
                        <div className="flex flex-col w-[45%] ml-2">
                            <h3 className="font-bold">Items</h3>
                            <div className="space-y-3">
                                <div className="flex gap-x-4"><div className="w-20 h-20 bg-gray-600 rounded-md flex-shrink-0"></div><p className="text-black mt-2 text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">Meal Name Lorem ipsum dolor sit</p></div>
                                <div className="flex gap-x-4"><div className="w-20 h-20 bg-gray-600 rounded-md flex-shrink-0"></div><p className="text-black mt-2 text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">Meal Name Lorem ipsum dolor sit</p></div>
                                <div className="flex gap-x-4"><div className="w-20 h-20 bg-gray-600 rounded-md flex-shrink-0"></div><p className="text-black mt-2 text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">Meal Name Lorem ipsum dolor sit</p></div>
                            </div>
                        </div>
                        <div className="flex flex-col w-[35%]">
                            <div className="bg-red-600 text-white font-bold px-3 py-1 flex justify-between items-center text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]"><span>Total all Items:</span><span>Fr. 135.00</span></div>
                            <div className="p-3">
                                <div className="grid grid-cols-3 gap-4 text-sm font-bold mb-3 text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]"><span className="text-left">Cost</span><span className="text-center">Qty</span><span className="text-right">Total per Item</span></div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4 text-sm text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]"><span className="text-left">Fr 45.00</span><span className="text-center">5</span><span className="text-right">Fr. 45.00</span></div>
                                    <div className="grid grid-cols-3 gap-4 text-sm text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]"><span className="text-left">Fr 90.00</span><span className="text-center">5</span><span className="text-right">Fr. 45.00</span></div>
                                    <div className="grid grid-cols-3 gap-4 text-sm text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]"><span className="text-left">Fr 90.00</span><span className="text-center">5</span><span className="text-right">Fr. 45.00</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-[40%] bg-yellow-300 p-2 rounded-lg">
                            <div className="mb-8 mt-2">
                                <h3 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold text-gray-800 mb-2">Delivery Address</h3>
                                <div className="mt-6 text-blue-700 font-semibold text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]"><p>Todaie Locnag</p><p>Lowenstrasse 5,</p><p>8530 Zürich</p></div>
                            </div>
                            <div className="flex flex-row justify-center items-center mb-6 gap-3">
                                <label className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] flex flex-row justify-center items-center font-bold text-gray-800 ">Status:</label>
                                <div className="relative w-full">
                                    <select className="w-full bg-red-400 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-500 transition-colors duration-200 appearance-none text-[9px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px]"><option value="NEW">NEW</option><option value="PROCESSING">PROCESSING</option><option value="IN TRANSIT">IN TRANSIT</option><option value="CANCELLED">CANCELLED</option></select>
                                    <ChevronDown style={{ strokeWidth: 6 }} size={12} className="text-white absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                            <div className="flex flex-row justify-end items-end mr-2"><button className="w-auto bg-red-900 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-800 transition-colors duration-200 shadow-lg text-[9px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">UPDATE</button></div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrdersView;