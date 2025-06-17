"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, Heart, Search, ChevronDown, ChevronLeft, ChevronRight, Plus, Minus, Share, Share2, X } from "lucide-react";
import RestaurantList from "./restaurant-list";

// This component is for the date input fields
const DateInput = ({ onClick }) => (
    <div
        onClick={onClick}
        className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-1.5 cursor-pointer hover:bg-gray-50 w-40"
    >
        <Calendar size={16} className="text-gray-500 mr-2" />
        <span className="text-sm text-gray-700">20/08/2017</span>
    </div>
);

// This component represents the calendar popup
const CalendarPopup = ({ onApply, onCancel }) => (
    <div className="absolute top-full left-1/2 -translate-x-1/4 mt-2 w-[300px] bg-white shadow-2xl p-4 z-10 border border-gray-200">
        <div className="grid grid-cols-2 gap-4">
            {/* Month 1: August */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <button className="hover:bg-gray-100 rounded-full p-1"><ChevronLeft size={18} /></button>
                    <span className="font-bold text-sm">AUG 2017</span>
                    <span className="w-6"></span>
                </div>
                <div className="grid grid-cols-7 text-center text-xs text-gray-500">
                    {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => <div key={day} className="py-1">{day}</div>)}
                    <div className="text-gray-400 py-1">30</div><div className="text-gray-400 py-1">31</div><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div>
                    <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div><div>11</div><div>12</div>
                    <div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div><div>19</div>
                    <div className="bg-green-600 text-white rounded-full">20</div><div>21</div><div>22</div><div>23</div><div>24</div><div>25</div><div>26</div>
                    <div>27</div><div>28</div><div>29</div><div>30</div><div>31</div><div className="text-gray-400 py-1">1</div><div className="text-gray-400 py-1">2</div>
                    <div className="text-gray-400 py-1">3</div><div className="text-gray-400 py-1">4</div><div className="text-gray-400 py-1">5</div><div className="text-gray-400 py-1">6</div><div className="text-gray-400 py-1">7</div><div className="text-gray-400 py-1">8</div><div className="text-gray-400 py-1">9</div>
                </div>
            </div>
            {/* Month 2: September */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="w-6"></span>
                    <span className="font-bold text-sm">SEP 2017</span>
                    <button className="hover:bg-gray-100 rounded-full p-1"><ChevronRight size={18} /></button>
                </div>
                <div className="grid grid-cols-7 text-center text-xs text-gray-500">
                    {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => <div key={day}>{day}</div>)}
                    <div className="text-gray-400">27</div><div className="text-gray-400">28</div><div className="text-gray-400">29</div><div className="text-gray-400">30</div><div className="text-gray-400">31</div><div>1</div><div>2</div>
                    <div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div>
                    <div>10</div><div>11</div><div>12</div><div>13</div><div>14</div><div>15</div><div>16</div>
                    <div>17</div><div>18</div><div>19</div><div>20</div><div>21</div><div>22</div><div>23</div>
                    <div>24</div><div>25</div><div>26</div><div>27</div><div>28</div><div>29</div><div>30</div>
                </div>
            </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
            <button onClick={onApply} className="bg-green-600 text-white font-bold py-1 px-6 rounded-md text-[13px] hover:bg-green-700">Apply</button>
            <button onClick={onCancel} className="bg-red-600 text-white font-bold py-1 px-6 rounded-md text-[13px] hover:bg-red-700">Cancel</button>
        </div>
    </div>
);

export default function AdminDashboard({ onClose }) {
    const [itemQuantities, setItemQuantities] = useState({
        1: 1,
        2: 1,
        3: 1,
    });

    const [favoriteStates, setFavoriteStates] = useState({
        1: true,
        2: true,
        3: true,
    });

    const [showRestaurantList, setShowRestaurantList] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showArrow, setShowArrow] = useState(false);
    const [currentView, setCurrentView] = useState('ORDERS'); // Default view
    const dashboardRef = useRef(null);

    // State for ORDERS view
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    // State for MENU view
    const [activeTab, setActiveTab] = useState('MEALS');
    const [isAddMealVisible, setIsAddMealVisible] = useState(false);

    // --- State for toggling card lists visibility ---
    const [showMealCardsList, setShowMealCardsList] = useState(true);
    const [showDrinkCardsList, setShowDrinkCardsList] = useState(true);
    const [showDealCardsList, setShowDealCardsList] = useState(true);


    // State for MY RESTAURANT view
    const [myRestaurantTab, setMyRestaurantTab] = useState('RESTAURANT_INFORMATION');


    // State management for the 'Account' view subsections
    const [personalInfoState, setPersonalInfoState] = useState('initial'); // 'initial', 'saved', 'editing'
    const [deliveryAddressState, setDeliveryAddressState] = useState('initial'); // 'initial', 'saved', 'editing'
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [accountStatus, setAccountStatus] = useState('active'); // 'active', 'deactivated', 'deleted'

    // State management for the 'Loyalty' view
    const [redeemedState, setRedeemedState] = useState({});
    const [isRewardActive, setIsRewardActive] = useState(false);
    const [isLinkCopied, setIsLinkCopied] = useState(false);

    // --- Handlers for toggling card lists ---
    const toggleMealCardsVisibility = () => setShowMealCardsList(prevState => !prevState);
    const toggleDrinkCardsVisibility = () => setShowDrinkCardsList(prevState => !prevState);
    const toggleDealCardsVisibility = () => setShowDealCardsList(prevState => !prevState);


    const handleRedeem = (points) => {
        setRedeemedState(prevState => ({ ...prevState, [points]: true }));
        setIsRewardActive(true);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText("eatafrican.ch?invitefriend#98021");
        setIsLinkCopied(true);
    };

    const rewards = [
        { discount: "10% DISCOUNT", points: 100 },
        { discount: "20% DISCOUNT", points: 200 },
        { discount: "50% DISCOUNT", points: 500 },
    ];

    useEffect(() => {
        const checkOverflow = () => {
            if (dashboardRef.current) {
                const isOverflowing = dashboardRef.current.scrollHeight > window.innerHeight;
                setShowArrow(isOverflowing);
            }
        };
        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [showRestaurantList, currentView, accountStatus]);

    const handleToggle = () => {
        setShowRestaurantList(!showRestaurantList);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // A reusable input component for the form
    const FormInput = ({ label, type = "text", placeholder = "" }) => (
        <div className="mb-1">
            <label className="block text-[13px] font-bold text-gray-700 mb-1">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full bg-white text-[13px] text-black px-3 py-1 rounded-md border border-black shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-black"
            />
        </div>
    );

    // A reusable select/dropdown component for the form
    const FormSelect = ({ label, options }) => (
        <div className="relative">
            <label className="block text-sm font-bold text-black mb-1">{label}</label>
            <select className="w-full bg-white text-sm text-black px-3 py-1 rounded-sm ring-1 ring-black">
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
        </div>
    );

    // Static data for the meal cards stored in a const variable
    const mealCardsData = [
        {
            id: 1,
            qty: "56",
            qtyColor: "bg-orange-500",
            price: "45.00",
            tag: "VEGAN",
            tagColor: "bg-green-600"
        },
        {
            id: 2,
            qty: "10",
            qtyColor: "bg-red-500",
            price: "45.00",
            tag: "VEGAN",
            tagColor: "bg-green-600"
        },
        {
            id: 3,
            qty: "56",
            qtyColor: "bg-orange-500",
            price: "45.00",
            tag: "VEGAN",
            tagColor: "bg-green-600"
        },
    ];

    // Static data to populate the meal list on the right
    const mealList = [
        { id: 1, name: "Meal Name Lorem ipsum dolor sit", description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.m nonumy eirmod t", price: "45.00" },
        { id: 2, name: "Meal Name Lorem ipsum dolor sit", description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.m nonumy eirmod t", price: "45.00" },
        { id: 3, name: "Meal Name Lorem ipsum dolor sit", description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.m nonumy eirmod t", price: "45.00" },
    ];

    const ChangeButton = () => (
        <button className="bg-orange-400 text-[13px] text-black font-bold py-1 px-5 rounded-md hover:bg-orange-500 transition-colors">
            CHANGE
        </button>
    );

    const [showCalendar, setShowCalendar] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const handleApplyDate = () => {
        setShowCalendar(false);
        setShowHistory(true);
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <div
                    ref={dashboardRef}
                    className="z-0 w-1/2 h-[85vh] bg-transparent xs:p-6 flex flex-col md:flex-row space-y-4 xs:space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-[80%] md:mt-0 ml-3"
                >
                    {showRestaurantList ? (
                        <RestaurantList />
                    ) : (
                        <main className="w-full h-[90vh] p-2 md:p-0 flex flex-col space-y-4 xs:space-y-6">
                            {/* Dashboard header - Always visible */}
                            <header className="flex flex-row justify-between z-50">
                                {/* Left side content */}
                                <div className="flex items-start">
                                    <div
                                        className="relative rounded-xl"
                                        style={{
                                            backgroundImage: 'url("/images/Restaurant Info_Bckimg.png")',
                                            backgroundSize: "cover",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            border: "2px solid #f1c232",
                                        }}
                                    >
                                        {/* Dark Overlay */}
                                        <div
                                            className="absolute inset-0 rounded-xl"
                                            style={{
                                                backgroundColor: "white",
                                                opacity: '80%',
                                                zIndex: 1,
                                            }}
                                        ></div>
                                        {/* Content (Menu Icon and Restaurant Info) */}
                                        <div className="relative z-10 flex flex-row w-full p-[8%] mr-10">
                                            {/* Dashboard Info */}
                                            <div className="pt-[1%] pb-[1%] pl-0 text-white flex flex-col space-y-0 w-full">
                                                <div className="relative z-10 ml-2">
                                                    <h1 className="text-[#274e13] text-[8px] md:text-[13px] font-bold lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">
                                                        Hallo Restaurant 89
                                                    </h1>
                                                    <h1 className="text-[#274e13] text-[8px] md:text-[13px] font-bold lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">
                                                        Welcome to your Dashboard
                                                    </h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side content */}
                                <div className="flex flex-col  md:items-end space-y-3 z-50">
                                    <div className="flex flex-wrap justify-center md:justify-end gap-2 z-50">
                                        <div className="relative z-50">
                                            <button
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                className="bg-green-900 text-white rounded-[9px] w-36 py-1.5 px-1 md:px-3 text-[5px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] font-semibold transition duration-200 whitespace-nowrap flex items-center justify-between"
                                            >
                                                <span>{currentView}</span>
                                                <ChevronDown style={{ strokeWidth: 6 }} size={12} />                                            </button>
                                            {isDropdownOpen && (
                                                <div className="absolute top-full left-0 -mt-2 pt-2 w-36 bg-green-900 text-white rounded-bl-[9px] rounded-br-[9px] shadow-lg z-50">
                                                    {['ORDERS', 'MENU', 'EARNINGS', 'MY RESTAURANT', 'TEAM MANAGEMENT', 'ACCOUNT'].map(view => (
                                                        <button
                                                            key={view}
                                                            onClick={() => {
                                                                setCurrentView(view);
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className="block w-full text-left px-2 py-1 text-[5px] md:text-[12px] font-semibold hover:bg-gray-600"
                                                        >
                                                            {view}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </header>

                            <section className="flex flex-col space-y-3 z-10">
                                {/* h-[600px] */}
                                <div
                                    className="flex flex-col w-full h-[80vh] mb-12 shadow-md overflow-hidden border-2 border-[#f1c232] relative -mt-2 rounded-[8px] "
                                >
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            backgroundColor: "white",
                                            opacity: '70%',
                                            zIndex: 1,
                                            borderRadius: "8px"
                                        }}
                                    ></div>

                                    {/* RENDER CURRENT VIEW */}
                                    <div className="z-10 relative p-4">

                                        {/* order section */}
                                        {currentView === 'ORDERS' && (
                                            <>
                                                {/* This shows the list of orders */}
                                                {!showOrderDetails && (
                                                    <div className="flex flex-col w-4/5 p-2 ">
                                                        {/* btn section */}
                                                        <div className="flex flex-row gap-1 w-full">
                                                            <button className="flex bg-blue-900 p-1 px-2 text-white text-[9px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">
                                                                ALL
                                                                <span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">0</span>
                                                            </button>
                                                            <button onClick={() => setShowOrderDetails(true)} className="flex bg-blue-500 p-1 px-2.5 text-white text-[9px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">
                                                                NEW
                                                                <span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">0</span>
                                                            </button>
                                                            <button className="flex bg-blue-500 p-1 px-2.5 text-white text-[9px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">
                                                                PROCESSING
                                                                <span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">0</span>
                                                            </button>
                                                            <button className="flex bg-blue-500 p-1 px-2.5 text-white text-[9px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">
                                                                IN TRANSIT
                                                                <span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">0</span>
                                                            </button>
                                                            <button className="flex bg-blue-500 p-1 px-2.5 text-white text-[9px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">
                                                                CANCELLED
                                                                <span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">0</span>
                                                            </button>
                                                            <button className="flex bg-blue-500 p-1 px-2.5 text-white text-[9px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">
                                                                COMPLETED
                                                                <span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">0</span>
                                                            </button>
                                                        </div>

                                                        {/* table section */}
                                                        <div className="flex flex-row w-full mt-2">
                                                            <table className="w-full">
                                                                {/* table headings */}
                                                                <thead className="bg-[#ff9920] w-full">
                                                                    <tr>
                                                                        <th className="py-1 px-1 text-left text-black w-[27%]">Order</th>
                                                                        <th className="py-1 text-left text-black w-[20%]">Location</th>
                                                                        <th className="py-1 text-left text-black w-[20%]">Date, Time</th>
                                                                        <th className="py-1 text-left text-black w-[20%] pl-6">Status</th>
                                                                    </tr>
                                                                </thead>
                                                                {/* table date */}
                                                                <tbody className="w-full">
                                                                    <tr className="w-full cursor-pointer hover:bg-gray-100" onClick={() => setShowOrderDetails(true)}>
                                                                        <td>#85025  Todaie Locnag</td>
                                                                        <td>Zurich</td>
                                                                        <td>10.07.2025  13:45</td>
                                                                        <td className="pl-6">New</td>
                                                                    </tr>
                                                                    <tr className="w-full cursor-pointer hover:bg-gray-100" onClick={() => setShowOrderDetails(true)}>
                                                                        <td>#85025  Todaie Locnag</td>
                                                                        <td>Zurich</td>
                                                                        <td>10.07.2025  13:45</td>
                                                                        <td className="pl-6">New</td>
                                                                    </tr>
                                                                    <tr className="w-full cursor-pointer hover:bg-gray-100" onClick={() => setShowOrderDetails(true)}>
                                                                        <td>#85025  Todaie Locnag</td>
                                                                        <td>Zurich</td>
                                                                        <td>10.07.2025  13:45</td>
                                                                        <td className="pl-6">New</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        {/* message setction */}
                                                        <p className="text-[9px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px] mb-1 text-black font-bold mt-3">Lorem ipsom dolor sit amet, consetetur</p>
                                                    </div>
                                                )}

                                                {/* order details */}
                                                {showOrderDetails && (
                                                    <div className="flex flex-col w-full px-2 ">
                                                        <div className="flex flex-row justify-between items-between w-full mb-3">
                                                            <h3 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold text-[#274e13]">
                                                                Order #1740
                                                            </h3>
                                                            <button onClick={() => setShowOrderDetails(false)} className="w-auto bg-red-900 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-800 transition-colors duration-200 shadow-lg text-[9px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">
                                                                ALL ORDERS
                                                            </button>
                                                        </div>
                                                        <div className="flex flex-row w-full px-2 gap-6">
                                                            {/* items */}
                                                            <div className="flex flex-col w-[45%] ml-2">
                                                                <h3 className="font-bold">Items</h3>
                                                                <div className="space-y-3">
                                                                    <div className="flex gap-x-4">
                                                                        <div className="w-20 h-20 bg-gray-600 rounded-md flex-shrink-0"></div>
                                                                        <p className="text-black mt-2 text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">
                                                                            Meal Name Lorem ipsum dolor sit
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex gap-x-4">
                                                                        <div className="w-20 h-20 bg-gray-600 rounded-md flex-shrink-0"></div>
                                                                        <p className="text-black mt-2 text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">
                                                                            Meal Name Lorem ipsum dolor sit
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex gap-x-4">
                                                                        <div className="w-20 h-20 bg-gray-600 rounded-md flex-shrink-0"></div>
                                                                        <p className="text-black mt-2 text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">
                                                                            Meal Name Lorem ipsum dolor sit
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* total items */}
                                                            <div className="flex flex-col w-[35%]">
                                                                <div className="bg-red-600 text-white font-bold px-3 py-1 flex justify-between items-center text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">
                                                                    <span>Total all Items:</span>
                                                                    <span>Fr. 135.00</span>
                                                                </div>
                                                                <div className="p-3">
                                                                    <div className="grid grid-cols-3 gap-4 text-sm font-bold mb-3 text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">
                                                                        <span className="text-left">Cost</span>
                                                                        <span className="text-center">Qty</span>
                                                                        <span className="text-right">Total per Item</span>
                                                                    </div>
                                                                    <div className="space-y-4">
                                                                        <div className="grid grid-cols-3 gap-4 text-sm text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">
                                                                            <span className="text-left">Fr 45.00</span>
                                                                            <span className="text-center">5</span>
                                                                            <span className="text-right">Fr. 45.00</span>
                                                                        </div>
                                                                        <div className="grid grid-cols-3 gap-4 text-sm text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">
                                                                            <span className="text-left">Fr 90.00</span>
                                                                            <span className="text-center">5</span>
                                                                            <span className="text-right">Fr. 45.00</span>
                                                                        </div>
                                                                        <div className="grid grid-cols-3 gap-4 text-sm text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">
                                                                            <span className="text-left">Fr 90.00</span>
                                                                            <span className="text-center">5</span>
                                                                            <span className="text-right">Fr. 45.00</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* delivery address */}
                                                            <div className="flex flex-col w-[40%] bg-yellow-300 p-2 rounded-lg">
                                                                <div className="mb-8 mt-2">
                                                                    <h3 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold text-gray-800 mb-2">Delivery Address</h3>
                                                                    <div className="mt-6 text-blue-700 font-semibold text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">
                                                                        <p>Todaie Locnag</p>
                                                                        <p>Lowenstrasse 5,</p>
                                                                        <p>8530 Zürich</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-row justify-center items-center mb-6 gap-3">
                                                                    <label className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] flex flex-row justify-center items-center font-bold text-gray-800 ">Status:</label>
                                                                    <div className="relative w-full">
                                                                        <select className="w-full bg-red-400 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-500 transition-colors duration-200 appearance-none text-[9px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">
                                                                            <option value="NEW">NEW</option>
                                                                            <option value="PROCESSING">PROCESSING</option>
                                                                            <option value="IN TRANSIT">IN TRANSIT</option>
                                                                            <option value="CANCELLED">CANCELLED</option>
                                                                        </select>
                                                                        <ChevronDown style={{ strokeWidth: 6 }} size={12} className="text-white absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                                                    </div>
                                                                </div>

                                                                {/* Update Button */}
                                                                <div className="flex flex-row justify-end items-end mr-2">
                                                                    <button className="w-auto bg-red-900 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-800 transition-colors duration-200 shadow-lg text-[9px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">
                                                                        UPDATE
                                                                    </button>
                                                                </div>
                                                            </div>


                                                        </div>

                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* menu section */}
                                        {currentView === 'MENU' && (
                                            <div className="relative w-full z-50">
                                                {/* Tab Buttons Section */}
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
                                                                    className={`
                                                                        ml-[13%] text-white font-bold py-1 px-4 rounded-lg 
                                                                        transition-colors duration-200 shadow-lg 
                                                                        text-[9px] md:text-[13px]
                                                                        ${isAddMealVisible
                                                                            ? 'bg-blue-900 hover:bg-teal-800'
                                                                            : 'bg-red-900 hover:bg-red-800'
                                                                        }
                                                                    `}
                                                                >
                                                                    ADD MEAL
                                                                </button>
                                                                <button onClick={toggleMealCardsVisibility} className="bg-black w-10 rounded text-white">test</button>
                                                            </div>
                                                            {!showMealCardsList && (
                                                                <p className="text-[9px] md:text-[13px] mb-1 text-black font-bold ">Currently no meals added</p>
                                                            )}</div>



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
                                                                                    <p className="mt-1 mb-3 text-xs font-bold text-black">
                                                                                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.m nonumy eirmod t
                                                                                    </p>
                                                                                    <div className="flex items-center justify-between">
                                                                                        <div className="flex items-center gap-2">
                                                                                            <button className="flex items-center rounded-md bg-teal-900 px-3 py-1 text-xs font-semibold text-white">
                                                                                                <span>LIVE</span>
                                                                                                <ChevronDown size={16} className="ml-1" />
                                                                                            </button>
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
                                                                        <button onClick={() => setIsAddMealVisible(false)} className="text-black hover:text-red-500">
                                                                            <X size={28} />
                                                                        </button>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <div className="space-y-2">
                                                                            <FormInput label="Title" />
                                                                            <div>
                                                                                <label className="block text-sm font-semibold text-black mb-1">Description</label>
                                                                                <textarea rows="4" className="w-full bg-white text-black px-3 py-1.5 rounded-md border-gray-400 focus:ring-2 focus:ring-amber-500"></textarea>
                                                                                <p className="text-xs italic">Max 253 characters</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-row justify-between items-start gap-10">
                                                                            <div className="flex flex-col w-1/2">
                                                                                <label className="block text-sm font-bold text-black mb-1">Image</label>
                                                                                <div className="w-full h-24 bg-gray-400 rounded-md mb-2 flex items-center justify-center"></div>
                                                                                <button className="bg-[#ff9920] text-black font-bold py-1 px-4 rounded-md text-sm hover:bg-amber-500">
                                                                                    UPLOAD
                                                                                </button>
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
                                                                    className={`
                                                                        ml-14 text-white font-bold py-1 px-4 rounded-lg 
                                                                        transition-colors duration-200 shadow-lg 
                                                                        text-[9px] md:text-[13px]
                                                                        ${isAddMealVisible
                                                                            ? 'bg-blue-900 hover:bg-teal-800'
                                                                            : 'bg-red-900 hover:bg-red-800'
                                                                        }
                                                                    `}
                                                                >
                                                                    ADD DRINKS
                                                                </button>
                                                                <button onClick={toggleDrinkCardsVisibility} className="bg-black w-10 rounded text-white">test</button>

                                                            </div>
                                                            {!showDrinkCardsList && (
                                                                <p className="text-[9px] md:text-[13px] mb-1 text-black font-bold ">Currently no drinks.</p>
                                                            )}</div>

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
                                                                                            <button className="flex items-center rounded-md bg-teal-900 px-3 py-1 text-xs font-semibold text-white">
                                                                                                <span>LIVE</span>
                                                                                                <ChevronDown size={16} className="ml-1" />
                                                                                            </button>
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
                                                                        <button onClick={() => setIsAddMealVisible(false)} className="text-black hover:text-red-500">
                                                                            <X size={28} />
                                                                        </button>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <div className="space-y-2">
                                                                            <FormInput label="Title" />
                                                                        </div>
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
                                                                    className={`
                                                                        ml-4 text-white font-bold py-1 px-4 rounded-lg 
                                                                        transition-colors duration-200 shadow-lg 
                                                                        text-[9px] md:text-[13px]
                                                                        ${isAddMealVisible
                                                                            ? 'bg-blue-900 hover:bg-teal-800'
                                                                            : 'bg-red-900 hover:bg-red-800'
                                                                        }
                                                                    `}
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
                                                                                    <div className="flex items-start justify-between">
                                                                                        <h3 className="text-[14px] font-bold text-red-800 mt-2">Meal Name</h3>
                                                                                    </div>
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
                                                                                            <button className="flex items-center rounded-md bg-teal-900 px-3 py-1 text-xs font-semibold text-white">
                                                                                                <span>LIVE</span>
                                                                                                <ChevronDown size={16} className="ml-1" />
                                                                                            </button>
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
                                                                                        <select className="w-full bg-white text-sm text-black px-3 py-1 rounded-sm ring-1 ring-black">
                                                                                            <option value="">Choose Date</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between items-end gap-4 mb-4">
                                                                                <div>
                                                                                    <FormSelect label="Category" options={["Main Dishes", "Drinks"]} />
                                                                                </div>
                                                                                <button className="bg-red-900 text-white font-semibold text-xs py-1 px-3 mr-6 rounded-md hover:bg-opacity-90 flex items-center flex-shrink-0">
                                                                                    FILTER BY <ChevronDown style={{ strokeWidth: 6 }} size={12} className="ml-2" />
                                                                                </button>
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
                                                                                        <div className="mr-4 mt-20">
                                                                                            <input type="checkbox" className="h-5 w-5 rounded border-orange-900 border-2 accent-orange-600 cursor-pointer" />
                                                                                        </div>
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
                                        )}

                                        {/* my restaurant section */}
                                        {currentView === 'MY RESTAURANT' && (
                                            <div className="relative w-full p-2 z-50">
                                                <div className="flex flex-col w-5/6">
                                                    {/* Tab Buttons Section */}
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
                                        )}


                                        {/* earning section */}
                                        {currentView === 'EARNINGS' && (
                                            <div className=" font-sans text-gray-800 mx-3 z-50">
                                                <h2 className="text-[17px] font-bold text-[#274e13] mb-8">EARNINGS</h2>
                                                <div className="flex flex-row gap-8 w-[100%] justify-start">
                                                    <div className="w-[40%]">
                                                        <h3 className="flex flex-row justify-end text-red-600 font-bold mb-3 text-[14px] ml-24">YOUR EARNINGS</h3>
                                                        <div className="space-y-2 text-[12px]">
                                                            <div className="flex justify-between"><span>Today</span><span className="font-semibold">1500</span></div>
                                                            <div className="flex justify-between"><span>This Week</span><span className="font-semibold">6500</span></div>
                                                            <div className="flex justify-between"><span>This Month</span><span className="font-semibold">10500</span></div>
                                                        </div>
                                                    </div>
                                                    <div className="w-[15%] flex flex-col items-end">
                                                        <h3 className="text-red-600 font-bold mb-3 text-[14px]">TOTAL SALES</h3>
                                                        <div className="space-y-2 text-sm text-[12px]">
                                                            <div className="flex justify-between"><span className="font-semibold">2700</span></div>
                                                            <div className="flex justify-between"><span className="font-semibold">9500</span></div>
                                                            <div className="flex justify-between"><span className="font-semibold">40500</span></div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-yellow-200 p-2 text-[14px] w-[40%] -mt-2">
                                                        <h3 className="font-bold mb-2 text-black">EARNINGS CALCULATION</h3>
                                                        <p className="text-[12px]">eatafrican.ch Commission Rate: 8%</p>
                                                        <p className="text-[12px]">Restaurant's Percentage : 100% - 8% = 92%</p>
                                                        <p className="text-[12px]">Restaurant's Earning: 92% / 100% * TOTAL SALES</p>
                                                    </div>
                                                </div>
                                                <div className="pt-6 border-t border-gray-200 text-sm mb-[72%]">
                                                    <p className="mb-2">
                                                        <span className="font-bold">Date of next Payout:</span> [Tomorrows Date], [Time]
                                                    </p>
                                                    <div className="relative flex flex-row gap-4">
                                                        <p className="font-bold mb-2">Select Dates to see payout history</p>
                                                        <div className="flex space-x-4">
                                                            <DateInput onClick={() => setShowCalendar(true)} />
                                                            <DateInput onClick={() => setShowCalendar(true)} />
                                                        </div>
                                                        {showCalendar && <CalendarPopup onApply={handleApplyDate} onCancel={() => setShowCalendar(false)} />}
                                                    </div>
                                                </div>

                                                {showHistory && (
                                                    <div className="-mt-[70%]">
                                                        <div className="grid grid-cols-2 gap-4 font-bold text-red-600 mb-2">
                                                            <div>Date</div>
                                                            <div>Total Payout</div>
                                                        </div>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="grid grid-cols-2 gap-4"><div>August 17, 2024</div><div>19000</div></div>
                                                            <div className="grid grid-cols-2 gap-4"><div>August 18, 2024</div><div>15000</div></div>
                                                            <div className="grid grid-cols-2 gap-4"><div>August 19, 2024</div><div>16000</div></div>
                                                            <div className="grid grid-cols-2 gap-4"><div>August 20, 2024</div><div>17000</div></div>
                                                        </div>
                                                        <button className="bg-red-900 text-[13px] text-white font-bold py-1 px-4 rounded-lg hover:bg-opacity-90 shadow-lg mt-6 mb-4">
                                                            DOWNLOAD PDF
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {currentView === 'TEAM MANAGEMENT' && (
                                            <div className="p-6">
                                                <h2 className="text-lg font-bold">Team Management</h2>
                                                <p>Team management UI goes here.</p>
                                            </div>
                                        )}

                                        {currentView === 'ACCOUNT' && (
                                            <div className="p-6">
                                                <h2 className="text-lg font-bold">Account Settings</h2>
                                                <p>Account management UI goes here.</p>
                                                {/* You can build out the account UI here using the state variables like 'personalInfoState', 'accountStatus', etc. */}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </main>
                    )}
                </div>
            </div >
        </>
    );
}