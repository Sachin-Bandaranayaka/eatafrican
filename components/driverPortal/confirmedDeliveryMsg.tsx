"use client";

interface ConfirmedDeliveryMsgProps {
    onBackToOrders: () => void;
}

const TimesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block mx-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

export default function ConfirmedDeliveryMsg({ onBackToOrders }: ConfirmedDeliveryMsgProps) {
    const orderedItems = [
        { name: "Meal Name lorem ipsum dolor sit", quantity: 1 },
        { name: "Meal Name lorem ipsum dolor sit", quantity: 2 },
        { name: "Meal Name lorem ipsum dolor sit", quantity: 2 },
    ];

    return (
        <section className="relative w-full h-screen flex items-center justify-center bg-transparent font-sans p-4">
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: "white",
                    opacity: '70%',
                    zIndex: 1,
                    borderRadius: "8px"
                }}
            ></div>
            <div className="relative z-10 w-full max-w-4xl p-8 text-gray-800">
                <div className="text-center mb-8">
                    <h1 className="text-xl font-semibold text-black flex items-center justify-center">
                        <CheckIcon /> Delivery confirmed!
                    </h1>
                    <p className="text-xl font-semibold text-black mt-2">Order #427935 Completed successfully</p>
                    <p className="text-xl font-semibold text-black mt-2">Thank You</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col space-y-6">
                        <div>
                            <h2 className="text-[15px] font-bold text-green-800">Customer's Address</h2>
                            <p className="text-[13px] font-semibold">Nicolas Ruedie,</p>
                            <p className="text-[13px] font-semibold">Neuerstrasse 75, Basel</p>
                        </div>
                        <div>
                            <h2 className="text-[15px] font-bold text-green-800">Delivered On</h2>
                            <p className="text-[13px] font-semibold">10.07.2025, 12:30</p>
                        </div>
                        <div>
                            <h2 className="text-[15px] font-bold text-green-800 mb-2">Ordered Items</h2>
                            <div className="space-y-1 text-sm">
                                {orderedItems.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center font-semibold w-full max-w-sm">
                                        <span>{item.name}</span>
                                        <span><TimesIcon /> {item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-6">
                        <div>
                            <h2 className="font-bold text-[15px] text-black">Order Nr. <span className="font-semibold">#427935</span></h2>
                        </div>
                        <div>
                            <h2 className="font-bold text-[15px] text-black">Status: <span className="font-semibold">Completed</span></h2>
                        </div>
                    </div>
                </div>
                <div className="mt-20 flex justify-center">
                    <button
                        onClick={onBackToOrders}
                        className="bg-[#6b240c] text-[12px] text-white font-bold py-1 px-4 rounded-md shadow-md hover:bg-[#8a3c1a] transition-colors duration-300"
                    >
                        BACK TO ORDERS
                    </button>
                </div>
            </div>
        </section>
    );
}