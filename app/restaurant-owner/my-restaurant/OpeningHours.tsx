"use client";

import RegularButton from "@/app/components/RegularButton";

const OpeningHours = () => {
    return (
        <div
            style={{ backgroundColor: "#E8D7B4" }}
            className="w-full max-w-[900px] shadow-lg text-black opacity-85 mb-4 ml-auto mr-0 max-h-[95vh] overflow-y-auto mt-28 sm:mt-20 px-3 py-4 pl-3 sm:px-6 sm:py-6 sm:pl-8"
        >
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start text-[10px] sm:text-xs">
                <div className="flex-1 space-y-4">
                    <div className="space-y-3 mb-6">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                            <div key={day} className="flex items-center justify-between gap-2">
                                <span className="font-bold text-gray-800 ml-1 sm:ml-12 whitespace-nowrap">{day}</span>
                                <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-16">
                                    <RegularButton
                                        text="EDIT"
                                        fillColor="#b45309"
                                        borderColor="#ffffff"
                                        fontColor="#ffffff"
                                        className="ml-2 sm:ml-16"
                                    />
                                    <input
                                        type="checkbox"
                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-4 rounded bg-white appearance-none cursor-pointer"
                                        style={{ borderColor: "#FE981F" }}
                                    />
                                    <span className="font-bold text-gray-700 text-[10px] sm:text-xs">Closed</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <RegularButton
                        text="SUBMIT FOR REVIEW"
                        fillColor="#b45309"
                        borderColor="#ffffff"
                        fontColor="#ffffff"
                        className="-mt-4 sm:-mt-6 ml-1 sm:ml-12"
                    />
                </div>

                <div className="flex-1">
                    <h3 className="text-orange-600 font-bold text-[11px] sm:text-sm mb-3 sm:mb-4 flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs">[Hours]</span>
                        Opening Hours Guideline
                    </h3>
                    <ul className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs font-semibold text-gray-700">
                        <li>- Set an opening time for each day or mark the day as Closed</li>
                        <li>- Make sure opening time is earlier than closing time</li>
                        <li>- Restaurant must be opened a minimum of 6 hours</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OpeningHours;
