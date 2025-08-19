"use client";
import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { FormInput, FormSelect } from "../common/FormControls";
import { mealCardsData, mealList } from "../data";

const MenuView = () => {
    const [activeTab, setActiveTab] = useState('MEALS');
    const [isAddMealVisible, setIsAddMealVisible] = useState(false);
    const [showMealCardsList, setShowMealCardsList] = useState(true);
    const [showDrinkCardsList, setShowDrinkCardsList] = useState(true);
    const [showDealCardsList, setShowDealCardsList] = useState(true);

    const toggleMealCardsVisibility = () => setShowMealCardsList(prevState => !prevState);
    const toggleDrinkCardsVisibility = () => setShowDrinkCardsList(prevState => !prevState);
    const toggleDealCardsVisibility = () => setShowDealCardsList(prevState => !prevState);

    return (
        <div className="relative w-full z-50">
            <div className="flex flex-row gap-1 w-1/2 ml-2">
                <button
                    onClick={() => setActiveTab('MEALS')}
                    className={`flex p-1 px-2 text-white text-[9px] md:text-[12px] ${activeTab === 'MEALS' ? 'bg-blue-900' : 'bg-blue-500'}`}
                >
                    MEALS
                </button>
                <button
                    onClick={() => setActiveTab('DRINKS')}
                    className={`flex p-1 px-2.5 text-white text-[9px] md:text-[12px] ${activeTab === 'DRINKS' ? 'bg-blue-900' : 'bg-blue-500'}`}
                >
                    DRINKS
                </button>
                <button
                    onClick={() => setActiveTab('SPECIAL DEALS')}
                    className={`flex p-1 px-2.5 text-white text-[9px] md:text-[12px] ${activeTab === 'SPECIAL DEALS' ? 'bg-blue-900' : 'bg-blue-500'}`}
                >
                    SPECIAL DEALS
                </button>
            </div>
            {/* MEALS VIEW */}
            {activeTab === 'MEALS' && (
                <div className="relative w-full p-2">
                    <div className="flex flex-col w-5/6">
                        <div className="flex flex-row w-full items-center mb-3 mt-3">
                            <h3 className="text-[9px] md:text-[15px] font-bold text-[#274e13]">MEALS</h3>
                            <button
                                onClick={() => setIsAddMealVisible(true)}
                                className={`ml-[13%] text-white font-bold py-1 px-4 rounded-lg transition-colors duration-200 shadow-lg text-[9px] md:text-[13px] ${isAddMealVisible ? 'bg-blue-900 hover:bg-teal-800' : 'bg-red-900 hover:bg-red-800'}`}
                            >
                                ADD MEAL
                            </button>
                            <button onClick={toggleMealCardsVisibility} className="bg-black w-10 rounded text-white">test</button>
                        </div>
                        {!showMealCardsList && <p className="text-[9px] md:text-[13px] mb-1 text-black font-bold ">Currently no meals added</p>}
                    </div>
                    {showMealCardsList && (
                        <div className="bg-transparent w-5/6 -mt-[7.5%]">
                            <div className="flex flex-row justify-end items-end mb-4 mt-3">
                                <button className="w-auto bg-red-900 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-800 transition-colors duration-200 shadow-lg text-[9px] md:text-[13px]">SORT BY</button>
                                <button className="ml-4 w-auto bg-red-900 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-800 transition-colors duration-200 shadow-lg text-[9px] md:text-[13px]">FILTER BY</button>
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar-orange pr-2">
                                <div className="space-y-4">
                                    {mealCardsData.map(card => (
                                        <div key={card.id} className="flex w-full items-center gap-4 rounded-lg bg-gray-50 p-1">
                                            <div className="w-28 h-28 m-1 flex-shrink-0 rounded-md bg-gray-300 "></div>
                                            <div className="flex-grow">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="text-[14px] font-bold text-red-800 mt-2">Meal Name Lorem ipsum dolor sit</h3>
                                                    <span className={`rounded-full px-4 py-1 text-xs font-bold text-white mt-2 mr-2 ${card.tagColor}`}>{card.tag}</span>
                                                </div>
                                                <p className="mt-1 mb-3 text-xs font-bold text-black">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.m nonumy eirmod t</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <button className="flex items-center rounded-md bg-teal-900 px-3 py-1 text-xs font-semibold text-white"><span>LIVE</span><ChevronDown size={16} className="ml-1" /></button>
                                                        <button className="rounded-md bg-teal-900 px-4 py-1 text-xs font-semibold text-white">EDIT</button>
                                                        <button className="rounded-md bg-teal-900 px-4 py-1 text-xs font-semibold text-white">DELETE</button>
                                                        <span className={`rounded-md px-3 py-1 text-xs font-bold text-black ${card.qtyColor}`}>Qty: {card.qty}</span>
                                                    </div>
                                                    <span className="text-[14px] font-bold text-gray-800 mr-6 mt-2">Fr. {card.price}.-</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {isAddMealVisible && (
                        <div className="absolute top-4 -left-4 mb-10 w-full h-full bg-transparent flex items-start justify-start pt-10 pl-4 z-20">
                            <div className="flex flex-col w-[55%] no-scrollbar overflow-y-auto max-h-[55vh] ml-2 p-3 bg-[#fde5ce] rounded-lg shadow-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-[9px] md:text-[15px] font-bold text-red-700">Add a Meal</h2>
                                    <button onClick={() => setIsAddMealVisible(false)} className="text-black hover:text-red-500"><X size={28} /></button>
                                </div>
                                <div className="flex flex-col">
                                    <div className="space-y-2">
                                        <FormInput label="Title" />
                                        <div>
                                            <label className="block text-sm font-semibold text-black mb-1">Description</label>
                                            <textarea rows={4} className="w-full bg-white text-black px-3 py-1.5 rounded-md border-gray-400 focus:ring-2 focus:ring-amber-500"></textarea>
                                            <p className="text-xs italic">Max 253 characters</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between items-start gap-10">
                                        <div className="flex flex-col w-1/2">
                                            <label className="block text-sm font-bold text-black mb-1">Image</label>
                                            <div className="w-full h-24 bg-gray-400 rounded-md mb-2 flex items-center justify-center"></div>
                                            <button className="bg-[#ff9920] text-black font-bold py-1 px-4 rounded-md text-sm hover:bg-amber-500">UPLOAD</button>
                                        </div>
                                        <div className="flex flex-col gap-3 w-1/2">
                                            <FormSelect label="Menu Category" options={["Kenyan", "Nigerian", "Ethiopian"]} />
                                            <FormSelect label="Meal Category" options={["Main Dishes", "Appetizers", "Desserts"]} />
                                            <FormSelect label="Meal Type" options={["Vegan", "Vegetarian", "Non-Veg"]} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-1/3 gap-y-1">
                                        <FormInput label="Price" type="text" />
                                        <FormInput label="Quantity" type="number" />
                                    </div>
                                </div>
                                <div className="flex justify-start space-x-4 mt-4 text-sm">
                                    <button onClick={() => setIsAddMealVisible(false)} className="bg-red-800 text-white font-bold py-1 px-8 rounded-md">SAVE</button>
                                    <button onClick={() => setIsAddMealVisible(false)} className="bg-red-800 text-white font-bold py-1 px-8 rounded-md">CANCEL</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {/* DRINKS VIEW */}
            {activeTab === 'DRINKS' && (
                <div className="relative w-full p-2">
                    <div className="flex flex-col w-5/6">
                        <div className="flex flex-row w-full items-center mb-3 mt-3">
                            <h3 className="text-[9px] md:text-[15px] font-bold text-[#274e13]">DRINKS</h3>
                            <button
                                onClick={() => setIsAddMealVisible(true)}
                                className={`ml-14 text-white font-bold py-1 px-4 rounded-lg transition-colors duration-200 shadow-lg text-[9px] md:text-[13px] ${isAddMealVisible ? 'bg-blue-900 hover:bg-teal-800' : 'bg-red-900 hover:bg-red-800'}`}
                            >
                                ADD DRINKS
                            </button>
                            <button onClick={toggleDrinkCardsVisibility} className="bg-black w-10 rounded text-white">test</button>
                        </div>
                        {!showDrinkCardsList && <p className="text-[9px] md:text-[13px] mb-1 text-black font-bold ">Currently no drinks.</p>}
                    </div>
                    {showDrinkCardsList && (
                        <div className="bg-transparent w-5/6 -mt-[8%]">
                            <div className="flex flex-row justify-end items-end mb-4 mt-3 ">
                                <button className="bg-red-900 text-white font-bold text-xs py-2 px-3 rounded-md hover:bg-opacity-90 flex items-center flex-shrink-0 text-[9px] md:text-[13px]">
                                    FILTER BY <ChevronDown style={{ strokeWidth: 6 }} size={12} className="ml-2" />
                                </button>
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar-orange pr-2">
                                <div className="space-y-4">
                                    {mealCardsData.map(card => (
                                        <div key={card.id} className="flex w-full items-center gap-4 rounded-lg bg-gray-50 p-1">
                                            <div className="w-28 h-28 m-1 flex-shrink-0 rounded-md bg-gray-300"></div>
                                            <div className="flex-grow">
                                                <div className="flex items-start justify-between mb-4">
                                                    <h3 className="text-[14px] font-bold text-red-800 mt-2">Drink Name Lorem ipsum dolor sit</h3>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <button className="flex items-center rounded-md bg-teal-900 px-3 py-1 text-xs font-semibold text-white"><span>LIVE</span><ChevronDown size={16} className="ml-1" /></button>
                                                        <button className="rounded-md bg-teal-900 px-4 py-1 text-xs font-semibold text-white">EDIT</button>
                                                        <button className="rounded-md bg-teal-900 px-4 py-1 text-xs font-semibold text-white">DELETE</button>
                                                        <span className={`rounded-md px-3 py-1 text-xs font-bold text-black ${card.qtyColor}`}>Qty: {card.qty}</span>
                                                    </div>
                                                    <span className="text-[14px] font-bold text-gray-800 mr-6 mt-2">Fr. {card.price}.-</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {isAddMealVisible && (
                        <div className="absolute top-4 -left-4 w-full h-full bg-transparent flex items-start justify-start pt-10 pl-4 z-20">
                            <div className="flex flex-col w-[55%] ml-2 p-3 bg-[#fde5ce] rounded-lg shadow-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-[9px] md:text-[15px] font-bold text-red-700">Add a Drink</h2>
                                    <button onClick={() => setIsAddMealVisible(false)} className="text-black hover:text-red-500"><X size={28} /></button>
                                </div>
                                <div className="flex flex-col">
                                    <div className="space-y-2"><FormInput label="Title" /></div>
                                    <div className="flex flex-row justify-between items-start gap-10">
                                        <div className="flex flex-col w-1/2">
                                            <label className="block text-sm font-bold text-black mb-1">Image</label>
                                            <div className="w-full h-24 bg-gray-400 rounded-md mb-2 flex items-center justify-center"></div>
                                            <button className="bg-[#ff9920] text-black font-bold py-1 px-4 rounded-md text-sm hover:bg-amber-500">UPLOAD</button>
                                        </div>
                                        <div className="flex flex-col w-1/3 gap-y-1">
                                            <FormInput label="Price" type="text" />
                                            <FormInput label="Quantity" type="number" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between space-x-4 mt-4 text-sm">
                                    <button onClick={() => setIsAddMealVisible(false)} className="bg-red-800 text-white font-bold py-1 px-8 rounded-md">SAVE</button>
                                    <button onClick={() => setIsAddMealVisible(false)} className="bg-red-800 text-white font-bold py-1 px-8 rounded-md">CANCEL</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {/* SPECIAL DEALS VIEW */}
            {activeTab === 'SPECIAL DEALS' && (
                <div className="relative w-full p-2">
                    <div className="flex flex-col w-5/6">
                        <div className="flex flex-row w-full items-center mb-3 mt-3">
                            <h3 className="text-[9px] md:text-[15px] font-bold text-[#274e13]">SPECIAL DEALS</h3>
                            <button
                                onClick={() => setIsAddMealVisible(true)}
                                className={`ml-4 text-white font-bold py-1 px-4 rounded-lg transition-colors duration-200 shadow-lg text-[9px] md:text-[13px] ${isAddMealVisible ? 'bg-blue-900 hover:bg-teal-800' : 'bg-red-900 hover:bg-red-800'}`}
                            >
                                ADD DEAL
                            </button>
                            <button onClick={toggleDealCardsVisibility} className="bg-black w-10 rounded text-white">test</button>
                        </div>
                    </div>
                    {showDealCardsList && (
                        <div className="bg-transparent w-5/6 ">
                            <div className="max-h-[60vh] overflow-y-auto no-scrollbar pr-2">
                                <div className="space-y-4">
                                    {mealCardsData.map(card => (
                                        <div key={card.id} className="flex w-full items-center gap-4 rounded-lg bg-gray-50 ">
                                            <div className="w-28 h-28 m-2 flex-shrink-0 rounded-md bg-gray-300"></div>
                                            <div className="flex-grow">
                                                <div className="flex items-start justify-between"><h3 className="text-[14px] font-bold text-red-800 mt-2">Meal Name</h3></div>
                                                <div className="flex flex-row gap-6">
                                                    <div className="flex flex-col">
                                                        <p className="mt-1 text-xs text-black">Meal Category: [Main Dishes]</p>
                                                        <p className="mt-1 mb-3 text-xs font-bold text-black">Discount Percentage: 10%</p>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="mt-1 text-xs text-black">Active From: [Date]</p>
                                                        <p className="mt-1 mb-3 text-xs text-black">Nr of Meals: [3]</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <button className="flex items-center rounded-md bg-teal-900 px-3 py-1 text-xs font-semibold text-white"><span>LIVE</span><ChevronDown size={16} className="ml-1" /></button>
                                                        <button className="rounded-md bg-teal-900 px-4 py-1 text-xs font-semibold text-white">EDIT</button>
                                                        <button className="rounded-md bg-teal-900 px-4 py-1 text-xs font-semibold text-white">DELETE</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {isAddMealVisible && (
                        <div className="absolute top-0 -ml-4 w-[85%] h-full bg-transparent flex items-start justify-start pt-10 pl-4 z-20 mt-4">
                            <div className="p-6 bg-[#fde5ce] rounded-lg mx-auto overflow-y-auto no-scrollbar max-h-[55vh]">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-[15px] font-bold text-red-800">Add a Special Deal</h2>
                                    <button onClick={() => setIsAddMealVisible(false)} className="text-black hover:text-red-500"><X size={28} /></button>
                                </div>
                                <div className="gap-x-8">
                                    <div className="space-y-4">
                                        <div className="w-[85%] flex flex-row items-center gap-4">
                                            <div className="flex-1"><FormInput label="Deal Name" /></div>
                                            <div className="flex-1"><FormInput label="Discount in %" /></div>
                                            <div className="flex-1 -mt-1">
                                                <div className="relative">
                                                    <label className="block text-sm font-bold text-black mb-1">Active From</label>
                                                    <select className="w-full bg-white text-sm text-black px-3 py-1 rounded-sm ring-1 ring-black"><option value="">Choose Date</option></select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end gap-4 mb-4">
                                            <div><FormSelect label="Category" options={["Main Dishes", "Drinks"]} /></div>
                                            <button className="bg-red-900 text-white font-semibold text-xs py-1 px-3 mr-6 rounded-md hover:bg-opacity-90 flex items-center flex-shrink-0">FILTER BY <ChevronDown style={{ strokeWidth: 6 }} size={12} className="ml-2" /></button>
                                        </div>
                                    </div>
                                    <div className="mt-2 mb-14">
                                        <div className="space-y-3 max-h-80 bg-transparent pr-5 rounded-lg custom-scrollbar-orange overflow-y-auto">
                                            {mealList.map(meal => (
                                                <div key={meal.id} className="w-full flex items-center pl-2 gap-4 rounded-lg bg-gray-50 border border-gray-200">
                                                    <div className="w-24 h-24 bg-gray-300 rounded-md flex-shrink-0"></div>
                                                    <div className="flex-grow">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-bold text-sm text-red-800">{meal.name}</h4>
                                                            <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full -mr-10">VEGAN</span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 my-1">{meal.description}</p>
                                                        <p className="font-semibold text-sm text-gray-800">Fr. {meal.price}.-</p>
                                                    </div>
                                                    <div className="mr-4 mt-20"><input type="checkbox" className="h-5 w-5 rounded border-orange-900 border-2 accent-orange-600 cursor-pointer" /></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-8">
                                    <button className="bg-red-900 text-white py-1 px-10 rounded-lg text-xs ">SAVE</button>
                                    <button className="bg-red-900 text-white py-1 px-10 rounded-lg text-xs mr-20">CANCEL</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MenuView;