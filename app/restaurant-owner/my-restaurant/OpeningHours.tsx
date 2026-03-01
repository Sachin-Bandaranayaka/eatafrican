"use client";

import RegularButton from "@/app/components/RegularButton";

// Opening Hours Component
const OpeningHours = () => {
    return (
        <div
            style={{ backgroundColor: '#E8D7B4' }}
            className="w-full max-w-[900px] shadow-lg text-black opacity-70 mb-4 ml-auto mr-0 max-h-[95vh] overflow-y-auto mt-20 px-6 py-6 pl-8"
        >
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Left Side - Weekly Schedule Management */}
                <div className="flex-1 space-y-4">
                    <div className="space-y-3 mb-6">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                            <div key={day} className="flex items-center justify-between">
                                <span className="font-bold text-gray-800 ml-12">{day}</span>
                                <div className="flex items-center gap-3 ml-16">
                                <RegularButton 
                                        text="EDIT" 
                                        fillColor="#b45309" 
                                        borderColor="#ffffff" 
                                        fontColor="#ffffff"
                                        className="ml-16"
                                    />
                                    <input type="checkbox" className="w-4 h-4 border-4 rounded bg-white appearance-none cursor-pointer" style={{ borderColor: '#FE981F' }} />
                                    <span className="font-bold text-gray-700">Closed</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <RegularButton 
                        text="SUBMIT FOR REVIEW" 
                        fillColor="#b45309" 
                        borderColor="#ffffff" 
                        fontColor="#ffffff"
                        className="-mt-6 ml-12"
                    />
                </div>

                {/* Right Side - Opening Hours Guidelines */}
                <div className="flex-1">
                    <h3 className="text-orange-600 font-bold text-sm mb-4 flex items-center gap-2">
                        <span className="text-xs">🍽️</span>
                        Opening Hours Guideline
                    </h3>
                    <ul className="space-y-2 text-xs font-semibold text-gray-700">
                        <li>• Set an opening time for each day or mark the day as Closed 😊</li>
                        <li>• Make sure opening time is earlier than closing time 😊</li>
                        <li>• Restaurant must be opened a minimum of 6 hours 😊</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OpeningHours;
