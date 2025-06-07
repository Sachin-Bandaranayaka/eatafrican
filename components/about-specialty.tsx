"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Flag, X } from "lucide-react";

interface AboutSpecialtyProps {
    cuisineType: string;
    onClose: () => void;
}

export default function AboutSpecialty({ cuisineType, onClose }: AboutSpecialtyProps) {
    const [isDragging, setIsDragging] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const paginationRef = useRef<HTMLDivElement>(null);
    const initialMouseX = useRef<number | null>(null);
    const initialThumbLeft = useRef<number>(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);

    const specialtyContent = {
        "ETHIOPIAN, ERITREAN": {
            title: "ETHIOPIAN & ERITREAN CUISINE",
            description: "Experience the ancient flavors of Ethiopia and Eritrea where every meal centers around injera—a tangy sourdough flatbread made from teff grain that serves as both plate and eating utensil. This distinctive cuisine features richly spiced wats (stews) including berbere-infused doro wat (chicken), tender tibs (sautéed meat), and flavorful vegetarian options like misir wat (lentils) and shiro (chickpea puree). With a 3,000-year culinary heritage blending aromatic spices and unique techniques, Ethiopian and Eritrean food offers a communal dining experience where the hands become instruments of enjoyment, delivering perfectly balanced bites of injera topped with savory, complex flavors.",
            image: "/images/ethiopian-cuisine.jpg",
            flags: ["/flags/ethiopia.png", "/flags/eritrea.png"],
            meals: [
                { name: "Doro Wat", description: "A spicy chicken stew made with berbere and spiced butter, often served with a boiled egg.", image: "/images/doro-wat.jpg" },
                { name: "Tsebhi (Zigni)", description: "A slow-cooked beef or lamb stew in a smoky, tomato-based sauce", image: "/images/tsebhi-zigni.jpg" },
                { name: "Kitfo", description: "Finely minced raw or lightly cooked beef, seasoned with spiced butter and chili.", image: "/images/tsebhi-zigni.jpg" },
                { name: "Shiro", description: "A creamy chickpea or lentil stew flavored with garlic, onion, and berbere.", image: "/images/tsebhi-zigni.jpg" },
                { name: "Atkilt Wat", description: "A sautéed mix of cabbage, carrots, and potatoes spiced with turmeric.", image: "/images/tsebhi-zigni.jpg" },
                { name: "Chechebsa", description: "Shredded flatbread tossed with spiced butter and berbere - a quick, satisfying treat", image: "/images/tsebhi-zigni.jpg" },
                { name: "Ambasha", description: "Lightly sweetened bread flavored with cardamom and coriander, often decorated with patterns.", image: "/images/tsebhi-zigni.jpg" },
            ],
            endDescription: "With just a few clicks, eatafrican.ch brings the authentic tastes of Ethiopia and Eritrea straight to your doorstep.",
        },
        "KENYAN": {
            title: "KENYAN CUISINE",
            description: "Kenya's food culture blends indigenous ingredients with influences from Arab, Indian, and European cuisines. From the hearty stews of the highlands to the spiced dishes of the Swahili coast, each bite offers a taste of the country's rich history and vibrant diversity.",
            image: "/images/kenyan-cuisine.jpg",
            flag: "/flags/kenya.png",
            meals: [
                { name: "Ugali", description: "Hearty cornmeal staple that pairs perfectly with stews and vegetables", image: "/images/nyama-choma.jpg" },
                { name: "Pilau", description: "Spiced rice infused with cardamom, cloves, and cinnamon, often cooked with beef or chicken.", image: "/images/nyama-choma.jpg" },
                { name: "Chapati", description: "Faky flatbread with Indian roots—ideal for wrapping, dipping, or pairing with stews.", image: "/images/ugali-sukuma.jpg" },
                { name: "Kuku wa Kupaka", description: "Chicken simmered in coconut sauce with ginger and tamarind.", image: "/images/ugali-sukuma.jpg" },
                { name: "Viazi Karai", description: "Crispy turmeric-battered potatoes served with tangy tamarind sauce. A coastal street food favorite.", image: "/images/ugali-sukuma.jpg" },
                { name: "Sambusa", description: "Deep-fried pastries filled with spiced meat or lentils. Crunchy, savory, and highly addictive.", image: "/images/ugali-sukuma.jpg" },
            ],
            endDescription: "With just a few clicks, eatafrican.ch brings the authentic tastes of Kenya straight to your doorstep.",
        },
        "NIGERIAN, GHANAIAN": {
            title: "NIGERIAN & GHANAIAN CUISINE",
            description: "Discover West Africa's vibrant flavors through Nigerian and Ghanaian cuisine, where bold spices and hearty ingredients combine in community-centered dishes. Both culinary traditions feature beloved jollof rice alongside regional specialties like Nigerian egusi soup with pounded yam and Ghanaian fufu with groundnut soup. Enjoy Ghana's waakye and spiced kelewele plantains or Nigeria's fiery pepper soup and suya skewers. These generations-old recipes offer a delicious gateway to West Africa's rich food heritage that satisfies both body and soul.",
            image: "/images/nigerian-ghanaian-cuisine.jpg",
            flags: ["/flags/nigeria.png", "/flags/ghana.png"],
            meals: [
                { name: "Jollof Rice", description: "A vibrant rice dish cooked in a tomato-pepper sauce, often served with meat or fried plantains.", image: "/images/jollof-rice.jpg", flag: "/flags/nigeria.png", countryName: "NIGERIA" },
                { name: "Egusi Soup", description: "A rich, nutty soup made from ground melon seeds, leafy greens, and assorted meats.", image: "/images/egusi-soup.jpg", flag: "/flags/nigeria.png", countryName: "NIGERIA" },
                { name: "Puff-Puff", description: "Sweet, fluffy deep-fried dough balls - Nigeria's beloved street snack.", image: "/images/egusi-soup.jpg", flag: "/flags/nigeria.png", countryName: "NIGERIA" },
                { name: "Chin Chin", description: "Crunchy, slightly sweet fried pastry bites perfect for on-the-go munching.", image: "/images/egusi-soup.jpg", flag: "/flags/nigeria.png", countryName: "NIGERIA" },
                { name: "Waakye", description: "A savory mix of rice and beans, cooked with millet leaves and served with varied sides.", image: "/images/egusi-soup.jpg", flag: "/flags/ghana.png", countryName: "GAHANA" },
                { name: "Fufu", description: "A smooth dough of cassava and plantain served with a mildly spicy tomato-based soup.", image: "/images/egusi-soup.jpg", flag: "/flags/ghana.png", countryName: "GAHANA" },
                { name: "Red-Red", description: "Black-eyed peas stewed with palm oil and served with fried plantains.", image: "/images/egusi-soup.jpg", flag: "/flags/ghana.png", countryName: "GAHANA" },
                { name: "Kelewele", description: "Spiced fried plantains seasoned with ginger, cayenne, and cloves.", image: "/images/egusi-soup.jpg", flag: "/flags/ghana.png", countryName: "GAHANA" },
            ],
            endDescription: "With just a few clicks, eatafrican.ch brings the authentic tastes of Nigeria and Ghana straight to your doorstep.",
        },
    };

    const content = specialtyContent[cuisineType as keyof typeof specialtyContent] || {
        title: "UNKNOWN CUISINE",
        description: "No information available for this cuisine.",
        image: "/images/placeholder.jpg",
        flag: "/flags/placeholder.png",
        meals: [],
    };

    const carouselImages = [
        { src: "/images/ethiopia-eritrea01.png", alt: content.title },
        { src: "/images/ethiopia-eritrea02.png", alt: content.title },
    ];

    const mealsPerPair = 2;
    const totalPairs = Math.ceil(content.meals.length / mealsPerPair);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [carouselImages.length]);

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    };

    const scrollToPair = (pairIndex: number) => {
        if (scrollContainerRef.current) {
            const cardWidth = scrollContainerRef.current.querySelector(".meal-card")?.clientWidth || 0;
            const gap = 8;
            const pairWidth = (cardWidth * 2) + gap;
            scrollContainerRef.current.scrollTo({
                left: pairIndex * pairWidth,
                behavior: "smooth",
            });
        }
    };

    const updatePagination = () => {
        if (scrollContainerRef.current && paginationRef.current) {
            const scrollPos = scrollContainerRef.current.scrollLeft;
            const cardWidth = scrollContainerRef.current.querySelector(".meal-card")?.clientWidth || 0;
            const gap = 8;
            const pairWidth = (cardWidth * 2) + gap;
            const newPairIndex = Math.round(scrollPos / pairWidth);
            setCurrentPairIndex(newPairIndex);
            const scrollBarWidth = paginationRef.current.clientWidth;
            const thumbWidth = 40;
            const maxThumbLeft = scrollBarWidth - thumbWidth;
            const thumbLeft = totalPairs > 1 ? (newPairIndex / (totalPairs - 1)) * maxThumbLeft : 0;
            const bar = paginationRef.current.querySelector(".pagination-bar");
            if (bar) {
                bar.style.width = `${thumbWidth}px`;
                bar.style.left = `${thumbLeft}px`;
            }
        }
    };

    useEffect(() => {
        updatePagination();
        setCurrentPairIndex(0);
        scrollToPair(0);
    }, [cuisineType, content.meals.length]);

    useEffect(() => {
        if (isDragging) {
            const handleMouseMove = (e: MouseEvent) => {
                if (paginationRef.current && scrollContainerRef.current && initialMouseX.current !== null) {
                    const scrollBarRect = paginationRef.current.getBoundingClientRect();
                    const thumb = paginationRef.current.querySelector(".pagination-bar");
                    if (thumb) {
                        const thumbWidth = 40;
                        const maxThumbLeft = scrollBarRect.width - thumbWidth;
                        const mouseDelta = e.clientX - initialMouseX.current;
                        const newThumbLeft = Math.max(0, Math.min(initialThumbLeft.current + mouseDelta, maxThumbLeft));
                        thumb.style.left = `${newThumbLeft}px`;
                        const thumbRatio = maxThumbLeft > 0 ? newThumbLeft / maxThumbLeft : 0;
                        const newPairIndex = Math.round(thumbRatio * (totalPairs - 1));
                        scrollToPair(newPairIndex);
                    }
                }
            };

            const handleMouseUp = () => {
                setIsDragging(false);
                initialMouseX.current = null;
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);

            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, totalPairs]);

    const getDisplayCountryName = (countryName: string) => {
        return countryName === "GAHANA" ? "GHANA" : countryName;
    };

    return (
        <>
            <div className="flex flex-col bg-transparent text-gray-900 font-sans p-4 w-[90vw] md:ml-[18vw] md:w-[35vw] md:max-h-[80vh] -mt-[90%] md:mt-0 ml-3 md:overflow-y-auto hide-scrollbar">
            
                <div className="flex flex-col justify-between  ml-auto max-w-6xl w-full">
                    <div className="relative flex justify-end items-center p-0 ">
                        {/* title */}
                        <div className="absolute left-0 top-14 z-10 bg-[url('/images/Content_Title_Background.png')] bg-contain border border-[2px] pr-5 border-[#fff2ccff] rounded-r-full p-6 pr-2 py-2">
                            <h2 className="block text-black text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold uppercase rounded whitespace-nowrap">
                                {content.title}
                            </h2>
                        </div>
                        {/* cancel btn and chef image */}
                        <div className="flex items-center md:space-x-4 mt-6 md:mt-0 lg:mt-0 xl:mt-0 m2xl:mt-0">
                            <div className="flex flex-col z-0">
                                <div className="w-[70%] md:w-full lg:w-full xl:w-full 2xl:w-full h-[70%] md:h-full lg:h-full xl:h-full 2xl:h-full 
                                flex items-end justify-end rounded-lg ">
                                    <Image
                                        src={"/images/kenyaspecialty1.png"}
                                        alt={"kenyaspecialty1.png"}
                                        width={250}
                                        height={250}
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="bg-[#ff9920] text-black border rounded-full p-1 z-50 -ml-16"
                                type="button"
                            >
                                <img
                                    src="/images/cancelBtnBlack.png"
                                    alt="Close"
                                    className="w-4 h-4 object-contain"
                                />
                            </button>
                        </div>
                    </div>

                    {/* description div */}
                    <div className="flex flex-col z-10 ">

                        {/* background chef image with the main */}
                        <div className="border border-[#f1c232] rounded-[10px] -mt-10 relative h-auto "
                            style={{
                                backgroundImage: `url('/images/kenyaspecialty2.png')`,
                                backgroundSize: '50%',
                                backgroundPosition: 'left bottom',
                                backgroundRepeat: 'no-repeat'
                            }}>
                            {/* dark overlay */}
                            <div
                                className="absolute inset-0 z-20"
                                style={{
                                    borderRadius: '10px',
                                    opacity: '75%',
                                    background: '#312708'
                                }}
                            ></div>

                            <div className="relative h-full p-2 mt-4">
                                {/* flag image */}
                                <div className="float-left mr-4 z-30 relative">
                                    {(content.flags && content.flags.length > 1 ? content.flags : [content.flag]).map((flag, index) => (
                                        <Image
                                            key={index}
                                            src={flag || "/flags/placeholder.png"}
                                            alt={`${content.title} flag ${index + 1}`}
                                            width={60}
                                            height={40}
                                            className="mb-2"
                                        />
                                    ))}
                                </div>

                                {/* description */}
                                <div className="z-30 relative">
                                    <p className="text-white text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">
                                        {content.description}
                                    </p>
                                </div>

                                {/* end description */}
                                <div className="z-30 relative">
                                    <p className="text-white text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] mt-2">
                                        {content.endDescription}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* meal card */}
                    {content.meals.length > 0 && (
                        <div className="relative mx-1 md:mr-4 mt-4 md:ml-9 z-50">
                            <div className="bg-transparent overflow-hidden" >
                                <div className="flex items-start">
                                    <div
                                        ref={scrollContainerRef}
                                        className="flex space-x-2 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
                                        style={{
                                            scrollbarWidth: "none",
                                            msOverflowStyle: "none",
                                            width: "calc(80vw + 0.5rem)",
                                        }}
                                        onScroll={updatePagination}
                                    >
                                        {content.meals.map((meal, index) => (
                                            <div
                                                key={index}
                                                className="meal-card flex-none w-[38vw] md:w-[220px] md:ml-10 border border-[#ffe599] rounded-lg snap-start overflow-hidden"
                                                style={{
                                                    backgroundImage: `url('/images/dishbck.png')`,
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    borderColor: '#f1c232',
                                                    borderRadius: '10px'
                                                }}
                                            >
                                                <div style={{ background: 'rgba(49, 39, 8, 0.75)' }} className="h-full">
                                                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-2 rounded-lg">
                                                        <Image
                                                            src={meal.image || "/images/meal-placeholder.jpg"}
                                                            alt={meal.name}
                                                            width={128}
                                                            height={128}
                                                            className="object-cover w-full h-full rounded-lg p-0"
                                                        />
                                                    </div>
                                                    <div className="px-2 text-white" >
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-[10px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px] flex-1">
                                                                <span className="text-amber-300 font-semibold whitespace-nowrap overflow-auto">{meal.name}:</span>{" "}
                                                                {meal.description}
                                                            </p>
                                                            {meal.flag && (
                                                                <div className="flex flex-col items-center">
                                                                    {/* <Image
                                                                        src={meal.flag}
                                                                        alt={`${meal.name} flag`}
                                                                        width={60}
                                                                        height={40}
                                                                        className="ml-0 object-contain"
                                                                    /> */}
                                                                    {/* {meal.countryName && (
                                                                        <span className="pt-[3px] font-bold uppercase text-[7px]">
                                                                            {getDisplayCountryName(meal.countryName)}
                                                                        </span>
                                                                    )} */}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div
                                        ref={paginationRef}
                                        className="relative border-yellow-300 w-1/2 h-7 bg-white border-2 mt-0 rounded-full overflow-hidden"
                                    >
                                        <button
                                            type="button"
                                            className="pagination-bar absolute h-6 w-10 bg-[#274e13ff] rounded-full cursor-pointer z-50 pointer-events-auto"
                                            style={{
                                                left: totalPairs > 1
                                                    ? `${(currentPairIndex / (totalPairs - 1)) * (100 - (40 / (paginationRef.current?.clientWidth || 1)) * 100)}%`
                                                    : "0",
                                            }}
                                            onClick={() => console.log("Button clicked via onClick!")}
                                            onMouseDown={(e) => {
                                                console.log("Button mousedown triggered!");
                                                setIsDragging(true);
                                                const thumb = e.currentTarget;
                                                const thumbRect = thumb.getBoundingClientRect();
                                                const scrollBarRect = paginationRef.current!.getBoundingClientRect();
                                                initialMouseX.current = e.clientX;
                                                initialThumbLeft.current = thumbRect.left - scrollBarRect.left;
                                                e.preventDefault();
                                            }}
                                        ></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style>
                {`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        scrollbar-width: none;
                        -ms-overflow-style: none;
                    }
                `}
            </style>
        </>
    );
}