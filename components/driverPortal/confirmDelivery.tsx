"use client";

import { Dispatch, SetStateAction, useState } from "react";

interface ConfirmDeliveryProps {
    order: any;
    setShowConfirmDelivery: Dispatch<SetStateAction<boolean>>;
    setShowConfirmedDeliveryMsg: Dispatch<SetStateAction<boolean>>;
    refreshOrder: () => Promise<void>;
}

const TimesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block mx-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export default function ConfirmDelivery({ order, setShowConfirmDelivery, setShowConfirmedDeliveryMsg, refreshOrder }: ConfirmDeliveryProps) {
    const [deliveryCode, setDeliveryCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!order) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-600">No order selected</p>
            </div>
        );
    }

    const handleConfirm = async () => {
        if (!deliveryCode.trim()) {
            setError("Please enter the delivery code");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/orders/${order.id}/confirm-delivery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({ deliveryCode: deliveryCode.trim() })
            });

            const data = await response.json();

            if (response.ok) {
                await refreshOrder();
                setShowConfirmDelivery(false);
                setShowConfirmedDeliveryMsg(true);
            } else {
                setError(data.error || 'Invalid delivery code');
            }
        } catch (error) {
            console.error('Error confirming delivery:', error);
            setError('Failed to confirm delivery. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative w-full h-screen flex bg-transperant font-sans">
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: "white",
                    opacity: '70%',
                    zIndex: 1,
                    borderRadius: "8px"
                }}
            ></div>
            <div className="relative z-10 w-full max-w-4xl p-6 text-gray-800">
                <div className="flex flex-row justify-between gap-10">
                    <div className="flex flex-col space-y-6">
                        <div>
                            <h1 className="text-[15px] font-bold text-red-900">CONFIRM DELIVERY</h1>
                        </div>
                        <div>
                            <label htmlFor="deliveryCode" className="block text-sm font-bold text-black mb-1">
                                Input Customer's Delivery Code
                            </label>
                            <div>
                                <input
                                    id="deliveryCode"
                                    type="text"
                                    value={deliveryCode}
                                    onChange={(e) => setDeliveryCode(e.target.value)}
                                    disabled={loading}
                                    className="w-full max-w-[200px] border border-gray-400 rounded-md focus:ring-red-800 focus:border-red-800 px-2 py-1"
                                    placeholder="Enter code"
                                />
                                {error && (
                                    <p className="text-red-600 text-xs mt-1">{error}</p>
                                )}
                                <div className="mt-2">
                                    <button
                                        onClick={handleConfirm}
                                        disabled={loading}
                                        className="bg-[#6b240c] text-[12px] text-white font-bold py-1 px-4 rounded-md shadow-md hover:bg-[#8a3c1a] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loading ? 'CONFIRMING...' : 'CONFIRM'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="font-bold text-[15px] text-green-900">Customer's Address</h2>
                            <p className="text-[13px] font-semibold">{order.deliveryAddress?.name || order.customer?.name || 'N/A'},</p>
                            <p className="text-[13px] font-semibold">{order.deliveryAddress?.street || 'N/A'}, {order.deliveryAddress?.city || 'N/A'}</p>
                        </div>
                        <div>
                            <h2 className="text-[15px] font-bold text-green-900 mb-2">Ordered Items</h2>
                            <div className="space-y-1 text-sm">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center font-semibold w-full max-w-sm">
                                            <span>{item.menuItem?.name || item.name || 'Item'}</span>
                                            <span><TimesIcon /> {item.quantity}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[13px]">No items available</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-6 md:pt-10 mr-32 mt-3">
                        <div>
                            <h2 className="font-bold text-[15px] text-black">Order Nr. <span className="font-semibold">#{order.orderNumber || order.id?.slice(0, 6)}</span></h2>
                        </div>
                        <div>
                            <h2 className="font-bold text-[15px] text-black">Status: <span className="font-semibold capitalize">{order.status?.replace('_', ' ') || 'In Transit'}</span></h2>
                        </div>
                        <div>
                            <h3 className="font-bold text-black text-[15px] mt-24">Delivery Schedule</h3>
                            <p className="text-[13px] font-semibold">{order.deliveryTime ? new Date(order.deliveryTime).toLocaleString() : 'N/A'}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-40 flex justify-center">
                    <button
                        onClick={() => setShowConfirmDelivery(false)}
                        disabled={loading}
                        className="bg-[#6b240c] text-[12px] text-white font-bold py-1 px-4 rounded-md shadow-md hover:bg-[#8a3c1a] transition-colors duration-300 disabled:opacity-50"
                    >
                        BACK TO DELIVERY
                    </button>
                </div>
            </div>
        </section>
    );
}
