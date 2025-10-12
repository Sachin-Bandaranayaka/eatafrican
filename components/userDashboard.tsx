"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Heart, Search, ChevronDown, Plus, Minus, Share, Share2, X } from "lucide-react";
import RestaurantList from "./restaurant-list";
import { OrderCardWithPayment } from "./order-card-with-payment";
import { PaymentStatus } from "./payment-status-badge";

function ItemQuantitySelector({ quantity, setQuantity }) {
    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 rounded-full bg-amber-300 hover:bg-amber-400 transition"
                aria-label="Decrease quantity"
            >
                <Minus size={12} className="xs:size-16" />
            </button>
            <span className="w-6 text-center font-semibold text-xs xs:text-base">{quantity}</span>
            <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 rounded-full bg-amber-300 hover:bg-amber-400 transition"
                aria-label="Increase quantity"
            >
                <Plus size={12} className="xs:size-16" />
            </button>
        </div>
    );
}

export default function UserDashboardComponent({ onClose }) {
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
    const [currentView, setCurrentView] = useState('orders');
    const dashboardRef = useRef(null);

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


    const order = [
        {
            id: "ORD-5400",
            status: "In Transit",
            title: "Meal Name Lorem ipsum dolor sit",
            adress: "Restaurant Tastes of Africa, Zurich",
            date: "26. June 2025",
            time: "15.30",
            order: "1x Doro Wat, 2X Injera +more",
            price: 45.0,
            qty: 5,
            paymentStatus: "completed" as PaymentStatus,
            paymentMethod: "stripe",
            paymentReference: "pi_3QRxyz123456789",
        },
        {
            id: "ORD-5401",
            status: "Delivered",
            title: "Another Meal Lorem Ipsum",
            adress: "Restaurant Flavors of Ethiopia, Geneva",
            date: "25. June 2025",
            time: "19.00",
            order: "1x Kitfo, 1x Veggie Combo",
            price: 55.0,
            qty: 2,
            paymentStatus: "completed" as PaymentStatus,
            paymentMethod: "stripe",
            paymentReference: "pi_3QRabc987654321",
        },
        {
            id: "ORD-5402",
            status: "Pending",
            title: "Spicy Chicken Dish",
            adress: "Accra Restaurant, Bern",
            date: "27. June 2025",
            time: "12.00",
            order: "2x Spicy Chicken, 1x Fufu",
            price: 65.0,
            qty: 3,
            paymentStatus: "pending" as PaymentStatus,
            paymentMethod: "stripe",
            paymentReference: "pi_3QRdef456789012",
        },
    ];

    const meals = [
        {
            id: 1,
            title: "Meal Name Lorem ipsum dolor sit",
            description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.",
            vegan: true,
            price: 45.0,
        },
        {
            id: 2,
            title: "Meal Name Lorem ipsum dolor sit",
            description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.",
            vegan: true,
            price: 45.0,
        },
        {
            id: 3,
            title: "Meal Name Lorem ipsum dolor sit",
            description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.",
            vegan: true,
            price: 45.0,
        },
        {
            id: 4,
            title: "Meal Name Lorem ipsum dolor sit",
            description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.",
            vegan: true,
            price: 45.0,
        },
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

    return (
        <>
            <div className="flex flex-col">
                <div
                    ref={dashboardRef}
                    className="z-0 w-[100%] bg-transparent xs:p-6 flex flex-col md:flex-row space-y-4 xs:space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-[80%] md:mt-0 ml-3"
                >
                    {showRestaurantList ? (
                        <RestaurantList />
                    ) : (
                        <main className="md:w-[95%] p-2 md:p-0 flex flex-col space-y-4 xs:space-y-6">
                            {/* Dashboard header - Always visible */}
                            <header className="flex flex-row justify-between items-center mr-2">
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
                                                backgroundColor: "#f1c232ff",
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
                                                        Hallo John Doe
                                                    </h1>
                                                    <h1 className="text-[#274e13] text-[8px] md:text-[13px] font-bold lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">
                                                        Welcome to your dashboard
                                                    </h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side content */}
                                <div className="flex flex-col items-center -mr-3 md:-mr-10 md:items-end space-y-3">
                                    <div className="flex flex-wrap justify-center md:justify-end gap-2">
                                        <button
                                            onClick={() => setCurrentView('orders')}
                                            className={`${currentView === 'orders' ? 'bg-amber-900' : 'bg-red-900'} text-white rounded-[9px] w-12 md:w-20 border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] font-semibold hover:bg-amber-900 transition duration-200 whitespace-nowrap`}
                                        >
                                            ORDERS
                                        </button>
                                        <button
                                            onClick={() => setCurrentView('favourites')}
                                            className={`${currentView === 'favourites' ? 'bg-amber-900' : 'bg-red-900'} text-white rounded-[9px] w-12 md:w-20 border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] font-semibold hover:bg-amber-900 transition duration-200 whitespace-nowrap`}
                                        >
                                            FAVOURITES
                                        </button>
                                        <button
                                            onClick={() => setCurrentView('loyalty')}
                                            className={`${currentView === 'loyalty' ? 'bg-amber-900' : 'bg-red-900'} text-white rounded-[9px] w-12 md:w-auto border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] font-semibold hover:bg-amber-900 transition duration-200 whitespace-nowrap`}
                                        >
                                            LOYALTY POINTS
                                        </button>
                                        <button
                                            onClick={() => setCurrentView('news')}
                                            className={`${currentView === 'news' ? 'bg-amber-900' : 'bg-red-900'} text-white rounded-[9px] w-12 md:w-20 border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] font-semibold hover:bg-amber-900 transition duration-200 whitespace-nowrap`}
                                        >
                                            NEWS
                                        </button>
                                    </div>

                                    <div className="flex flex-row gap-1 md:gap-5 items-center justify-center">
                                        {/* Filter & Sort buttons */}
                                        <div className="flex flex-row gap-2">
                                            <div className="items-center justify-center">
                                                {/* Account */}
                                                <button
                                                    onClick={() => setCurrentView('account')}
                                                    className={`${currentView === 'account' ? 'bg-amber-900' : 'bg-red-900'} text-white rounded-[9px] w-12 md:w-20 border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] font-semibold hover:bg-amber-900 transition duration-200 whitespace-nowrap`}
                                                >
                                                    ACCOUNT
                                                </button>
                                            </div>
                                            {/* empty box for layout */}
                                            <div className="w-8 md:w-10 p-1"> </div>
                                            <div className="w-32 md:w-56 flex flex-row justify-end gap-2 p-0.5">
                                                {/* Conditionally render Sort by and Filter by */}
                                                {currentView !== 'favourites' && (
                                                    <>
                                                        <button className="text-white text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] flex items-center rounded-[9px] w-14 md:w-20 border-2 space-x-2 bg-amber-900 font-bold pl-2 transition">
                                                            <span>SORT BY</span>
                                                            <div className="ml-1">
                                                                <ChevronDown style={{ strokeWidth: 6 }} size={12} />
                                                            </div>
                                                        </button>
                                                        <button className="text-white text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] flex items-center rounded-[9px] w-14 md:w-20 border-2 space-x-2 bg-amber-900 font-bold pl-2 transition">
                                                            <span>FILTER BY</span>
                                                            <div className="ml-1">
                                                                <ChevronDown style={{ strokeWidth: 6 }} size={12} />
                                                            </div>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </header>

                            {/* Ordercard section - Shown by default */}
                            {currentView === 'orders' && (
                                <section className="flex flex-col w-[102%] space-y-3 z-10">
                                    {order.map((order) => (
                                        <OrderCardWithPayment
                                            key={order.id}
                                            orderId={order.id}
                                            orderNumber={order.id}
                                            status={order.status}
                                            title={order.title}
                                            address={order.adress}
                                            date={order.date}
                                            time={order.time}
                                            orderItems={order.order}
                                            price={order.price}
                                            paymentStatus={order.paymentStatus}
                                            paymentMethod={order.paymentMethod}
                                            paymentReference={order.paymentReference}
                                            onViewDetails={() => setCurrentView('orderDetails')}
                                            onViewMore={() => {}}
                                            showPaymentDetails={false}
                                        />
                                    ))}
                                </section>
                            )}


                            {/* Meal card section - Hidden by default */}
                            {currentView === 'favourites' && (
                                <section className="flex flex-col w-[102%] space-y-3 z-10">
                                    {meals.map((meal) => (
                                        <div
                                            key={meal.id}
                                            className="flex flex-col shadow-md overflow-hidden border-2 border-[#f1c232] relative -mt-2"
                                            style={{
                                                backgroundImage: 'url("/images/Box_Restaurant_BckgImg01.png")',
                                                backgroundSize: "contain",
                                                backgroundPosition: "center",
                                                borderRadius: "10px",
                                            }}
                                        >
                                            {/* overlay */}
                                            <div
                                                className="absolute inset-0"
                                                style={{
                                                    backgroundColor: "c",
                                                    opacity: '70%',
                                                    zIndex: 1,
                                                    borderRadius: "8px"
                                                }}
                                            ></div>
                                            <div className="relative z-10 w-auto">
                                                <div className="flex flex-row w-auto">
                                                    <div className="m-[1%] w-1/2 h-auto bg-gray-200 flex items-start justify-start text-gray-500 text-[10px] xs:text-sm font-semibold rounded-[10px] border border-amber-400 xs:mr-4">
                                                        {/* image will appear here */}
                                                    </div>
                                                    <div className="p-[1%] w-1/2 flex flex-col justify-around">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <h3 className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold text-[#ebeb48]">
                                                                {meal.title}
                                                            </h3>
                                                            <span className="inline-block bg-[#367627] border border-[#f1c232] text-white py-1 px-4 xs:px-4 xs:py-2 rounded-full text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">
                                                                VEGAN
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-col w-[100%] items-between justify-between">
                                                            <div className="w-full flex flex-row items-between justify-between">
                                                                <p className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] mb-1 text-[#ebeb48] w-1/3">Restaurant Name</p>
                                                                <p className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] mb-1 text-white w-2/3">Lorem ipsom dolor sit amet, consetetur</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col w-[100%] items-between justify-between">
                                                            <div className="w-full flex flex-row items-between justify-between">
                                                                <p className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] mb-1 text-[#ebeb48] w-1/3">Restaurant Location</p>
                                                                <p className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] mb-1 text-white w-2/3">sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore.m</p>
                                                            </div>
                                                        </div>
                                                        {/* btn section */}
                                                        <div className="flex items-center justify-between md:mt-[1%] space-x-4">
                                                            <div className="flex items-center space-x-6 xs:space-x-4 ">
                                                                <button className="bg-[#670402] text-white py-[3%] px-3 border border-amber-400 rounded-[10px] font-semibold transition duration-200 whitespace-nowrap text-[8px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">
                                                                    ADD TO CART
                                                                </button>
                                                                <button className="px-2 border-2 rounded-[20%] bg-white text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">
                                                                    1+
                                                                </button>
                                                                <span className="text-[8px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] xs:text-sm sm:text-lg text-white">
                                                                    Fr. {meal.price.toFixed(2)}.-
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-4">
                                                                <button className="relative p-0 text-green-600 hover:text-green-800 transition rounded-lg">
                                                                    <img
                                                                        src="/images/recycleBin.png"
                                                                        alt="Add to favorites"
                                                                        style={{ width: 20, height: 20 }}
                                                                        className="w-auto h-auto md:w-14 md:h-14"
                                                                    />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {/* Order details section - Hidden by default */}
                            {currentView === 'orderDetails' && (
                                <section className="flex flex-col w-[102%] h-auto space-y-3 z-10 border-2 border-white "
                                    style={{
                                        backgroundImage: 'url("/images/orderstatus.png")',
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        borderRadius: "10px",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                >
                                    <div className="relative h-auto">
                                        {/* overlay */}
                                        <div
                                            className="absolute inset-0 "
                                            style={{
                                                backgroundColor: "#783f04ff",
                                                opacity: '70%',
                                                zIndex: 1,
                                                borderRadius: "10px",
                                            }}
                                        ></div>
                                        <div className="flex justify-between z-10">
                                            {/* left side */}
                                            <div className="flex flex-col w-1/2 mb-20 ml-4">
                                                <div className="relative z-10 p-3 text-white">
                                                    <h1 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">ORDER DETAILS</h1>
                                                </div>
                                                <div className="flex flex-row justify-between">
                                                    <div className="relative z-10 p-3 text-white font-bold">
                                                        <h1 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]"> ORD-5400</h1>
                                                    </div>
                                                    <div className="relative z-10 p-3 text-white">
                                                        <h1 className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]"> IN TRANSIT</h1>
                                                    </div>
                                                </div>
                                                <div className="relative z-10 space-y-4">
                                                    {order.slice(0, 1).map((order) => (
                                                        <div key={order.id}>
                                                            <h1 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] text-amber-400 font-bold">{order.adress}</h1>
                                                            <div className="space-y-4 mt-2">
                                                                <div className="flex flex-row w-auto h-auto">
                                                                    <div className="m-[1%] w-1/3 h-20 bg-gray-200 flex items-start justify-start text-gray-500 text-[10px] xs:text-sm font-semibold border border-amber-400 xs:mr-4">
                                                                        {/* image will appear here */}
                                                                    </div>
                                                                    <div className="flex flex-col text-white ml-4 text-[15px] ">
                                                                        <p className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold">Jollof Rice With Plantain</p>
                                                                        <p className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Fr. {order.price}.- </p>
                                                                        <p className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Qty - {order.qty} </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-row w-auto h-auto">
                                                                    <div className="m-[1%] w-1/3 h-20 bg-gray-200 flex items-start justify-start text-gray-500 text-[10px] xs:text-sm font-semibold border border-amber-400 xs:mr-4">
                                                                        {/* image will appear here */}
                                                                    </div>
                                                                    <div className="flex flex-col text-white ml-4 text-[15px] ">
                                                                        <p className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold">Jollof Rice With Plantain</p>
                                                                        <p className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Fr. {order.price}.- </p>
                                                                        <p className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Qty - {order.qty} </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-row w-auto h-auto">
                                                                    <div className="m-[1%] w-1/3 h-20 bg-gray-200 flex items-start justify-start text-gray-500 text-[10px] xs:text-sm font-semibold border border-amber-400 xs:mr-4">
                                                                        {/* image will appear here */}
                                                                    </div>
                                                                    <div className="flex flex-col text-white ml-4 text-[15px] ">
                                                                        <p className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold">Jollof Rice With Plantain</p>
                                                                        <p className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Fr. {order.price}.- </p>
                                                                        <p className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Qty - {order.qty} </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* right side */}
                                            <div className="relative z-10 p-3 w-1/2">
                                                <div className="flex flex-col justify-end items-end">
                                                    {/* cancel btn */}
                                                    <button
                                                        onClick={() => setCurrentView('orders')}
                                                        className="rounded-full p-1 z-50 ml-2"
                                                        type="button"
                                                        aria-label="Close"
                                                    >
                                                        <img
                                                            src="/images/cancelBtnWhite.png"
                                                            alt="Close"
                                                            className="w-4 h-4 object-contain"
                                                        />
                                                    </button>
                                                </div>
                                                <div className="w-[80%] flex flex-col space-y-3 mt-[20%] ml-[5%]">
                                                    <div className="w-auto h-auto">
                                                        <div className="relative w-full bg-[#df9f5b] border border-white opacity-75 p-4 rounded-lg flex justify-between text-black">
                                                            <div>
                                                                <h1 className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] font-bold text-red-600">Order Date and Time:</h1>
                                                                <div className="text-[7px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">June 28.2025 at 12.30 pm</div>
                                                                <h1 className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] font-bold text-red-600">Expected Delivery Date and Time:</h1>
                                                                <div className="text-[7px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">June 28.2025 at 12.30 pm</div>
                                                                <h1 className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] font-bold text-red-600">Delivery To:</h1>
                                                                <div className="text-[7px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">
                                                                    <p>john Dankbarkeit</p>
                                                                    <p>Erfullstreasse 43,</p>
                                                                    <p>8300 Zurich</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-auto h-auto">
                                                        <div className="relative w-full bg-[#cfe2f3] border border-white opacity-75 p-4 rounded-lg flex justify-between">
                                                            <div className="text-red-600 font-bold">
                                                                <div className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Subtotal</div>
                                                                <div className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Delivery Fee</div>
                                                                <div className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] font-bold">Total</div>
                                                            </div>
                                                            <div className="text-center">
                                                                <div className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Fr. 250.000.-</div>
                                                                <div className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Fr. 250.000.-</div>
                                                                <div className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] font-bold">Fr. 250.000.-</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}


                            {/* account section - Hidden by default */}
                            {currentView === 'account' && (
                                <section className="flex flex-col w-[102%] h-auto space-y-3 z-10 border-2 border-white "
                                    style={{
                                        backgroundImage: 'url("/images/accountbck.png")',
                                        backgroundSize: "cover",
                                        backgroundPosition: "top",
                                        borderRadius: "10px",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                >
                                    <div className="relative h-auto">
                                        {/* overlay */}
                                        <div
                                            className="absolute inset-0 "
                                            style={{
                                                backgroundColor: "#783f04ff",
                                                opacity: '70%',
                                                zIndex: 1,
                                                borderRadius: "10px",
                                            }}
                                        ></div>
                                        <div className="flex justify-between z-10">
                                            {/* left side */}
                                            <div className="flex flex-col w-3/4 mb-4 md:mb-20 ml-2 md:ml-4 mt-2 md:mt-4">

                                                {accountStatus === 'deactivated' ? (
                                                    <div className="relative z-10 text-white p-4">
                                                        <h1 className="text-[#ebeb48] font-base text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] md:mb-3">ACCOUNT DEACTIVATED</h1>
                                                        <div className="flex flex-col">
                                                            <p className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Your account has been successfully deactivated. You can reactivate it anytime by signing back in. You will be logged out shortly.</p>
                                                            <p className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] mt-3 md:mt-6">Thank you for being a part of eatafrican.ch. We hope to serve you again in the future</p>
                                                        </div>
                                                    </div>
                                                ) : accountStatus === 'deleted' ? (
                                                    <div className="relative z-10 text-white p-4">
                                                        <h1 className="text-[#ebeb48] font-base text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] md:mb-3">ACCOUNT DELETED</h1>
                                                        <div className="flex flex-col">
                                                            <p className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Your account has been successfully deleted. We're sorry to see you go. If you change your mind, you're always welcome to create a new account anytime. You'll be logged out shortly.</p>
                                                            <p className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] mt-3 md:mt-6">Thank you for being a part of eatafrican.ch. We hope to serve you again in the future</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {/* personal informations header */}
                                                        <div className="relative z-10 text-white">
                                                            <h1 className="text-[#ebeb48] font-base text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] md:mb-3">PERSONAL INFORMATION</h1>
                                                            <p className="text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] italic">Update your phone number and delivery address here to enjoy a faster, smoother with your details automatically filled in.</p>
                                                        </div>

                                                        {/* personal informations */}
                                                        <div className="relative z-10 space-y-4 mt-3 w-full">
                                                            {/* name */}
                                                            <div className="flex flex-row gap-3">
                                                                <div className="flex flex-col">
                                                                    <p className="text-white text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Firstname</p>
                                                                    <input type="text"
                                                                        className="rounded border border-black focus:border-red-500 focus:ring-0 w-full h-3 md:h-6" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <p className="text-white text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Lastname</p>
                                                                    <input type="text"
                                                                        className="rounded border border-black focus:border-red-500 focus:ring-0 w-full h-3 md:h-6" />
                                                                </div>
                                                            </div>
                                                            {/* mail & nmb */}
                                                            <div className="flex flex-row gap-3">
                                                                <div className="flex flex-col">
                                                                    <p className="text-white text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">E-Mail Address</p>
                                                                    <input type="text"
                                                                        className="rounded border border-black focus:border-red-500 focus:ring-0 w-full h-3 md:h-6" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <p className="text-white text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Telephone Number</p>
                                                                    <input type="text"
                                                                        className="rounded border border-black focus:border-red-500 focus:ring-0 w-full h-3 md:h-6" />
                                                                </div>
                                                            </div>

                                                            {personalInfoState === 'initial' && (
                                                                <button onClick={() => setPersonalInfoState('saved')} className="bg-[#e69138ff] text-white rounded-md md:rounded-[9px] w-12 md:w-20 border-2 border-white py-1 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition duration-200 whitespace-nowrap">
                                                                    SAVE
                                                                </button>
                                                            )}

                                                            {personalInfoState === 'saved' && (
                                                                <button onClick={() => setPersonalInfoState('editing')} className="bg-[#e69138ff] text-white rounded-md md:rounded-[9px] w-12 md:w-20 border-2 border-white py-1 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition duration-200 whitespace-nowrap">
                                                                    CHANGE
                                                                </button>
                                                            )}

                                                            {personalInfoState === 'editing' && (
                                                                <div className="flex flex-row gap-0 justify-between md:w-[65%] ">
                                                                    <button onClick={() => setPersonalInfoState('saved')} className="bg-[#e69138ff] text-white rounded-md md:rounded-[9px] w-12 md:w-20 border-2 border-white py-1 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition duration-200 whitespace-nowrap">
                                                                        SAVE
                                                                    </button>
                                                                    <button onClick={() => setPersonalInfoState('saved')} className="bg-[#e69138ff] text-white rounded-md md:rounded-[9px] w-12 md:w-20 border-2 border-white py-1 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition duration-200 whitespace-nowrap">
                                                                        CANCEL
                                                                    </button>
                                                                </div>
                                                            )}


                                                            {/* delivery informations */}
                                                            <div className="relative z-10 space-y-4 mt-3 w-full mb-4">
                                                                <div>
                                                                    <h1 className="text-[#ebeb48] font-base text-[9px] md:text-[15px] md:mb-3">DELIVERY ADDRESS</h1>
                                                                </div>

                                                                {deliveryAddressState === 'saved' && (
                                                                    <div className="space-y-3">
                                                                        <div className="flex flex-row">
                                                                            <label className="custom-radio text-white flex flex-col items-start cursor-pointer gap-2 flex-wrap">
                                                                                <div className="flex items-center md:ml-0 gap-2">
                                                                                    <input type="radio" name="restaurant" defaultChecked />
                                                                                    <span className="text-[7px] md:text-[11px] font-bold">Erfolgsstrasse 56, 8000 Zurich</span>
                                                                                    <button onClick={() => setDeliveryAddressState('editing')} className="bg-[#e69138ff] text-white rounded-md md:rounded-[9px] w-12 md:w-20 border-2 border-white py-1 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition duration-200 whitespace-nowrap">
                                                                                        EDIT
                                                                                    </button>
                                                                                </div>
                                                                                <p className="text-[7px] md:text-[12px] italic">Add up to three delivery addresses and select the one you prefer at checkout</p>
                                                                            </label>
                                                                        </div>
                                                                        <div className="flex flex-row justify-start items-start ml-1">
                                                                            <button onClick={() => setDeliveryAddressState('editing')} className="bg-[#e69138ff] text-white rounded-md md:rounded-[9px] border-2 border-white py-1 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition duration-200 whitespace-nowrap">
                                                                                ADD ADDRESS
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {(deliveryAddressState === 'initial' || deliveryAddressState === 'editing') && (
                                                                    <>
                                                                        <div className="space-y-3">
                                                                            <div className="flex flex-row gap-3">
                                                                                <div className="flex flex-col">
                                                                                    <p className="text-[#ebeb48] text-[9px] md:text-[14px]">Postal Code</p>
                                                                                    <input type="text" className="rounded border border-black focus:border-red-500 focus:ring-0 w-full h-3 md:h-6" />
                                                                                </div>
                                                                                <div className="flex flex-col">
                                                                                    <p className="text-[#ebeb48] text-[9px] md:text-[14px]">City</p>
                                                                                    <input type="text" className="rounded border border-black focus:border-red-500 focus:ring-0 w-full h-3 md:h-6" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex flex-row gap-3">
                                                                                <div className="flex flex-col w-full md:w-[65%]">
                                                                                    <p className="text-[#ebeb48] text-[9px] md:text-[14px]">Street and House Number</p>
                                                                                    <input type="text" className="rounded border border-black focus:border-red-500 focus:ring-0 w-full h-3 md:h-6" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {deliveryAddressState === 'initial' && (
                                                                            <button onClick={() => setDeliveryAddressState('saved')} className="bg-[#e69138ff] text-white rounded-md md:rounded-[9px] w-12 md:w-20 border-2 border-white py-1 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition duration-200 whitespace-nowrap">
                                                                                SAVE
                                                                            </button>
                                                                        )}
                                                                        {deliveryAddressState === 'editing' && (
                                                                            <div className="flex flex-row gap-2">
                                                                                <button onClick={() => setDeliveryAddressState('saved')} className="bg-[#e69138ff] text-white rounded-md md:rounded-[9px] w-12 md:w-20 border-2 border-white py-1 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition duration-200 whitespace-nowrap">
                                                                                    SAVE
                                                                                </button>
                                                                                <button onClick={() => setDeliveryAddressState('saved')} className="bg-[#e69138ff] text-white rounded-md md:rounded-[9px] w-12 md:w-20 border-2 border-white py-1 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition duration-200 whitespace-nowrap">
                                                                                    CANCEL
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}

                                                                {/* Password and Account Deletion Section */}
                                                                <div className="mb-56 md:mb-96" />
                                                                <div className="z-20 relative">

                                                                    <div className="flex flex-col gap-2 mt-2">
                                                                        {!showPasswordFields && (
                                                                            <button onClick={() => { setShowPasswordFields(true); setPasswordUpdateSuccess(false); }} className="bg-[#e69138ff] text-white rounded md:rounded-[9px] w-1/2 border-2 border-white py-0.5 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition duration-200 whitespace-nowrap">
                                                                                CHANGE PASSWORD
                                                                            </button>
                                                                        )}

                                                                        {showPasswordFields && (
                                                                            <div className="flex flex-row gap-2 md:gap-3">
                                                                                <div className="flex flex-col w-full">
                                                                                    <p className="text-[#ebeb48] text-[9px] md:text-[14px]">Change Password</p>
                                                                                    <div className="flex flex-col w-full gap-2 mt-2">
                                                                                        <div className="flex flex-col">
                                                                                            <p className="text-[#ebeb48] text-[9px] md:text-[14px]">Current Password</p>
                                                                                            <input type="password" className="rounded border border-black focus:border-red-500 focus:ring-0 w-full h-3 md:h-6" />
                                                                                        </div>
                                                                                        <div className="flex flex-col">
                                                                                            <p className="text-[#ebeb48] text-[9px] md:text-[14px]">New password</p>
                                                                                            <input type="password" className="rounded border border-black focus:border-red-500 focus:ring-0 w-full h-3 md:h-6" />
                                                                                        </div>
                                                                                        <div className="flex flex-col">
                                                                                            <p className="text-[#ebeb48] text-[9px] md:text-[14px]">Confirm password</p>
                                                                                            <input type="password" className="rounded border border-black focus:border-red-500 focus:ring-0 w-full h-3 md:h-6" />
                                                                                        </div>
                                                                                    </div>

                                                                                    {passwordUpdateSuccess && (
                                                                                        <div className="mt-1">
                                                                                            <p className="text-white text-[7px] md:text-[12px] italic">All set! Your password is updated. We'll log you out in a moment to keep your account safe</p>
                                                                                        </div>
                                                                                    )}

                                                                                    {!passwordUpdateSuccess && (
                                                                                        <button onClick={() => setPasswordUpdateSuccess(true)} className="mt-2 bg-[#e69138ff] text-white rounded md:rounded-[9px] w-full border-2 border-white py-0.5 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition duration-200 whitespace-nowrap">
                                                                                            SET NEW PASSWORD
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                                <div className="w-auto h-auto w-full mt-10">
                                                                                    <div className="flex flex-col w-full bg-[#cfe2f3] border-2 border-white opacity-75 p-2 md:p-4 rounded-2xl justify-between">
                                                                                        <p className="text-black font-bold text-[6px] md:text-[10px] mb-2">Your Password Must Include:</p>
                                                                                        <p className="text-black text-[6px] md:text-[10px]">-At least 8 characters.</p>
                                                                                        <p className="text-black text-[6px] md:text-[10px]">-At least one Upper case character.</p>
                                                                                        <p className="text-black text-[6px] md:text-[10px]">-At least one special character.</p>
                                                                                        <p className="text-black text-[6px] md:text-[10px]">-At least one Number.</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {!showDeleteConfirmation && (
                                                                            <button onClick={() => setShowDeleteConfirmation(true)} className="bg-[#e69138ff] text-white rounded md:rounded-[9px] w-1/2 border-2 border-white py-0.5 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition duration-200 whitespace-nowrap">
                                                                                DELETE ACCOUNT
                                                                            </button>
                                                                        )}
                                                                    </div>



                                                                    {showDeleteConfirmation && (
                                                                        <div className="w-full">
                                                                            <p className="text-[#ebeb48] text-[9px] md:text-[14px]">Delete Account</p>
                                                                            <div className="w-2/3 mt-2">
                                                                                <p className="text-white text-[7px] md:text-[12px]"> Would you prefer to deactivate your account instead?</p>
                                                                                <p className="text-white text-[7px] md:text-[12px]"> Deactivating keeps your data safe and lets you come back anytime. if you still wish to delete it permanently, please confirm below</p>
                                                                            </div>
                                                                            <div className="flex flex-row w-full gap-2 mt-2">
                                                                                <button onClick={() => setShowDeleteConfirmation(false)} className="bg-[#e69138ff] text-white rounded-md md:rounded-[9px] w-12 md:w-20 border-2 border-white py-1 md:py-1.5 text-[5px] md:text-[9px] font-semibold transition whitespace-nowrap">
                                                                                    CANCEL
                                                                                </button>
                                                                                <button onClick={() => setAccountStatus('deactivated')} className="bg-[#e69138ff] text-white rounded-md md:rounded-[9px] w-auto border-2 border-white py-1 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition whitespace-nowrap">
                                                                                    DEACTIVATE
                                                                                </button>
                                                                                <button onClick={() => setAccountStatus('deleted')} className="bg-[#e69138ff] text-white rounded-md md:rounded-[9px] border-2 border-white py-1 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition whitespace-nowrap">
                                                                                    DELETE ACCOUNT
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* right side */}
                                            <div className="relative z-10 p-3 w-1/4">
                                                <div className="flex flex-col justify-end items-end">
                                                    <button
                                                        onClick={() => setCurrentView('orders')}
                                                        className="rounded-full p-1 z-50 ml-2"
                                                        type="button"
                                                        aria-label="Close"
                                                    >
                                                        <img
                                                            src="/images/cancelBtnWhite.png"
                                                            alt="Close"
                                                            className="w-4 h-4 object-contain"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* loyalty section - Hidden by default */}
                            {currentView === 'loyalty' && (
                                <section className="flex flex-col w-[102%] h-auto space-y-3 z-10 border-2 border-white "
                                    style={{
                                        backgroundImage: 'url("/images/loyaltypointbck.png")',
                                        backgroundSize: "cover",
                                        backgroundPosition: "top",
                                        borderRadius: "10px",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                >
                                    <div className="relative h-auto">
                                        {/* overlay */}
                                        <div
                                            className="absolute inset-0 "
                                            style={{
                                                backgroundColor: "#783f04ff",
                                                opacity: '70%',
                                                zIndex: 1,
                                                borderRadius: "10px",
                                            }}
                                        ></div>
                                        <div className="flex justify-between z-10">
                                            {/* left side */}
                                            <div className="flex flex-col w-4/5 mb-4 md:mb-20 ml-2 md:ml-4 mt-2 md:mt-4">
                                                <div className="flex flex-col gap-3">
                                                    {/* loyalty points header */}
                                                    <div className="relative z-10 text-white">
                                                        <h1 className="text-[#ebeb48] font-base text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] md:mb-3">YOUR LOYALTY POINTS</h1>
                                                        <p className="text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">You current have no ponits. Please refer to the "Ways to Earn Points" section to begin earning points.</p>
                                                    </div>

                                                    {/* rewards section */}
                                                    <div className="relative z-10 text-white">
                                                        <h1 className="text-[#ebeb48] font-base text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] md:mb-3">YOUR AVAILABLE REWARDS</h1>
                                                        <div className="flex flex-row gap-4 md:gap-10 mt-2">
                                                            {rewards.map(reward => (
                                                                <div key={reward.points} className="flex flex-col">
                                                                    <span className="text-[7px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px] font-bold">{reward.discount}</span>
                                                                    <span className="text-[7px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px] font-bold">{reward.points} POINTS</span>
                                                                    <button
                                                                        onClick={() => handleRedeem(reward.points)}
                                                                        className={`${redeemedState[reward.points] ? 'bg-black' : 'bg-[#999999ff]'} text-white mt-4 rounded-md md:rounded-[9px] w-auto border-2 border-white py-1 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition duration-200 whitespace-nowrap`}
                                                                    >
                                                                        {redeemedState[reward.points] ? 'REDEEMED' : 'REDEEM AWARDS'}
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {!isRewardActive ? (
                                                            <p className="text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] mt-3">The option to redeem a reward will be available once you've earned enough points.</p>
                                                        ) : (
                                                            <>
                                                                <p className="text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] mt-3">Your reward is now active! Use the code below at checkout.</p>
                                                                <div className="flex bg-white border-2 border-black rounded-md w-[20%] h-4 md:h-6 flex-row justify-center items-center mt-2">
                                                                    <p className="text-[8px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] text-black ">XMALEEUA</p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* way to earn points */}
                                                <div className="relative z-10 text-white mt-3">
                                                    <h1 className="text-[#ebeb48] font-base text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] md:mb-3">WAYS TO EARN POINTS</h1>
                                                    <div className="flex flex-col md:gap-2 mt-2">
                                                        <div className="flex flex-row gap-4 md:gap-14">
                                                            <span className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] font-bold">Order a meal</span>
                                                            <span className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] ">+10 Points</span>
                                                        </div>
                                                        <div className="flex flex-row gap-4 md:gap-14">
                                                            <span className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] font-bold">Order a meal</span>
                                                            <span className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] ">+10 Points</span>
                                                        </div>
                                                    </div>

                                                    <p className="text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] mt-3">The option to redeem a reward will be available once you've earned enough points.</p>
                                                </div>

                                                {/* reffer to a friend earn points */}
                                                <div className="relative z-10 text-white mt-3">
                                                    <h1 className="text-[#ebeb48] font-base text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] md:mb-3">REFFER TO A FRIEND AND EARN POINTS</h1>
                                                    <p className="text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] mt-3">After earning 100 points, click the button below to generate your invitelink. Share it with a friend and earn 100 points when they place their first order!</p>

                                                    <div className="flex flex-col justify-between items-between w-1/2 md:w-1/3">
                                                        {isRewardActive && (
                                                            <div className="flex bg-white border-2 border-black rounded-md h-4 md:h-6 flex-row justify-center items-center mt-2">
                                                                <p className="text-[8px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] text-black ">eatafrican.ch?invitefriend#98021</p>
                                                            </div>
                                                        )}

                                                        <div className="flex flex-row w-full gap-2 md:gap-4">
                                                            <button className={`${isRewardActive ? 'bg-[#e69138ff]' : 'bg-[#999999ff]'} text-white mt-4 rounded-md md:rounded-[9px] w-auto border-2 border-white py-1 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition duration-200 whitespace-nowrap`}>
                                                                {isRewardActive ? 'GENERATE LINK' : 'INVITE LINK'}
                                                            </button>
                                                            {isRewardActive && (
                                                                <button
                                                                    onClick={handleCopyLink}
                                                                    className={`${isLinkCopied ? 'bg-[#e69138ff]' : 'bg-black'} text-white mt-4 rounded-md md:rounded-[9px] w-auto border-2 border-white py-1 md:py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold transition duration-200 whitespace-nowrap`}
                                                                >
                                                                    COPY LINK
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] mt-3">An invite link can be used once by one person. Generate a new link whenever you want to invite a friend!</p>
                                                </div>

                                                {/* recent activity section */}
                                                <div className="relative z-10 text-white mt-3">
                                                    <h1 className="text-[#ebeb48] font-base text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] md:mb-3">RECENT ACTIVITY</h1>
                                                    <div className="flex flex-row md:gap-2 mt-2">
                                                        <div className="flex flex-row gap-4 md:gap-14">
                                                            <div className="flex flex-col">
                                                                <span className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] font-bold">Order a meal</span>
                                                                <span className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] font-bold">referred a friend</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">+10 pts</span>
                                                                <span className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">+50 Pts</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">25.05.2025</span>
                                                                <span className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">28.05.2025</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                        </main>
                    )}

                    {showArrow && (
                        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-transparent p-2 z-10">
                            <img
                                src="/images/scrollArrow.png"
                                alt="Scroll down"
                                className="w-14 h-40 object-contain animate-bounce"
                            />
                        </div>
                    )}
                </div>
            </div >
            {/* Scroll animation */}
            < style > {`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce {
          animation: bounce 1.5s ease-in-out infinite;
        }
      `}</style >
        </>
    );
}