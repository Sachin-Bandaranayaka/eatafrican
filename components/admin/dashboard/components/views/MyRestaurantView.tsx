"use client";
import { useState } from "react";
import { FormInput, ChangeButton } from "../common/FormControls";

const MyRestaurantView = () => {
    const [myRestaurantTab, setMyRestaurantTab] = useState('RESTAURANT_INFORMATION');

    return (
        <div className="relative w-full p-2 z-50">
            <div className="flex flex-col w-5/6">
                <div className="flex flex-row gap-1 w-1/2">
                    <button
                        onClick={() => setMyRestaurantTab('RESTAURANT_INFORMATION')}
                        className={`flex p-1 px-2 text-white text-[9px] md:text-[12px] ${myRestaurantTab === 'RESTAURANT_INFORMATION' ? 'bg-blue-900' : 'bg-blue-500'}`}
                    >
                        RESTAURANT INFORMATION
                    </button>
                    <button
                        onClick={() => setMyRestaurantTab('OPENING_TIME')}
                        className={`flex p-1 px-2.5 text-white text-[9px] md:text-[12px] ${myRestaurantTab === 'OPENING_TIME' ? 'bg-blue-900' : 'bg-blue-500'}`}
                    >
                        OPENING TIME
                    </button>
                </div>
            </div>
            {myRestaurantTab === 'RESTAURANT_INFORMATION' && (
                <div className="p-6 bg-transparent rounded-lg max-w-4xl mx-auto max-h-[65vh] overflow-y-auto no-scrollbar">
                    <div className="flex flex-row gap-x-12">
                        <div className="flex flex-col space-y-2 w-[30%]">
                            <h3 className="font-bold text-gray-800">Restaurant's Logo</h3>
                            <div className="w-32 h-32 bg-gray-400 rounded-md"></div>
                            <div className="w-[100%] "><ChangeButton /></div>
                        </div>
                        <div className="flex flex-col space-y-4 w-[50%]">
                            <div className="space-y-1">
                                <h3 className="font-bold text-gray-800 mb-2">Restaurant's Manager</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <FormInput label="Firstname" placeholder="John" />
                                    <FormInput label="Last Name" placeholder="Dankbarkeit" />
                                    <FormInput label="E-Mail Address" placeholder="john@gmail.com" />
                                    <FormInput label="Telephone Number" placeholder="079 412 76 98" />
                                </div>
                                <ChangeButton />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-gray-800 mb-1">Restaurant's Location</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div><FormInput label="Postal Code" placeholder="4210" /></div>
                                    <div><FormInput label="City" placeholder="Zurich" /></div>
                                    <div className="md:col-span-2"><FormInput label="Street and House Number" placeholder="Kaice 43" /></div>
                                </div>
                                <ChangeButton />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-gray-800 mb-1">Restaurant's Offering</h3>
                                <div className="w-full">
                                    <div className="flex flex-row items-center gap-2">
                                        <label className="block text-[13px] font-bold text-black mb-1">Country Specialty</label>
                                        <select className="w-[60%] bg-white text-[13px] text-black px-3 py-1 rounded-sm ring-1 ring-black">
                                            <option value="Kenyan">Kenyan</option>
                                            <option value="Nigerian">Nigerian</option>
                                            <option value="Ethiopian">Ethiopian</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {myRestaurantTab === 'OPENING_TIME' && (
                <div className="p-6">
                    <h3 className="font-bold text-gray-800">Opening Time Management</h3>
                    <p>UI for managing opening times goes here.</p>
                </div>
            )}
        </div>
    );
};

export default MyRestaurantView;