"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Flag, X } from "lucide-react";

interface AboutSpecialtyProps {
    cuisineType: string;
    onClose: () => void;
}

export default function AboutSpecialty({ cuisineType, onClose }: AboutSpecialtyProps) {
    const [showFullDescription, setShowFullDescription] = useState(false);
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
        "NIGERIAN, GHANA": {
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

    const halfDescription = content.description.split(" ").slice(0, 20).join(" ") + "...";

    // Carousel images
    const carouselImages = [
        { src: "/images/ethiopia-eritrea01.png", alt: content.title },
        { src: "/images/ethiopia-eritrea02.png", alt: content.title },
    ];

    // Calculate the number of pairs (2 meals per pair)
    const mealsPerPair = 2;
    const totalPairs = Math.ceil(content.meals.length / mealsPerPair);

    // Auto-rotate carousel
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

    // Scroll to a specific pair
    const scrollToPair = (pairIndex: number) => {
        if (scrollContainerRef.current) {
            const cardWidth = scrollContainerRef.current.querySelector(".meal-card")?.clientWidth || 0;
            const gap = 8; // space-x-2 = 0.5rem = 8px
            const pairWidth = (cardWidth * 2) + gap; // Width of two cards + gap
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
            const gap = 8; // space-x-2 = 0.5rem = 8px
            const pairWidth = (cardWidth * 2) + gap; // Width of two cards + gap

            // Update current pair index
            const newPairIndex = Math.round(scrollPos / pairWidth);
            setCurrentPairIndex(newPairIndex);

            // Update pagination bar
            const scrollBarWidth = paginationRef.current.clientWidth;
            const thumbWidth = 40; // w-10 = 40px
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
        // Reset to first pair when cuisine changes
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
                        const thumbWidth = 40; // w-10 = 40px
                        const maxThumbLeft = scrollBarRect.width - thumbWidth;
                        const mouseDelta = e.clientX - initialMouseX.current;
                        const newThumbLeft = Math.max(0, Math.min(initialThumbLeft.current + mouseDelta, maxThumbLeft));

                        thumb.style.left = `${newThumbLeft}px`;

                        // Calculate the corresponding pair index
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

    // Correct country name typo for display
    const getDisplayCountryName = (countryName: string) => {
        return countryName === "GAHANA" ? "GHANA" : countryName;
    };

    return (
        <div className="flex flex-col bg-transparent text-gray-900 font-sans p-4 w-[100vw] md:ml-[38vw] md:w-[35vw]">
            <div className="relative ml-auto max-w-6xl w-full">
                <div className="flex justify-end items-center p-0 z-10">
                    <div className="bg-[#85200cff] border border-[2px] border-[#fff2ccff] inline-block rounded-l-full rounded-r-sm pl-6 pr-2 py-2 relative mr-2">
                        <div className="bg-[url('/images/title-background.png')] bg-contain bg-center px-10 py-1">
                            <h2 className="block bg-[#2A5910] text-white text-[11px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] font-bold uppercase rounded whitespace-nowrap">
                                {content.title}
                            </h2>
                        </div>
                    </div>
                    {/* close button */}
                    <button
                        onClick={onClose}
                        className="bg-[#FFF3C7] text-black rounded-full p-1 mr-2 z-30"
                        type="button"
                    >
                        <img
                            src="/images/cancelBtn.png"
                            alt="Close"
                            className="w-4 h-4 object-contain"
                        />
                    </button>
                </div>

                <div className="mx-auto mt-1 flex flex-row justify-between">
                    <div className="bg-[#FFF3C7] bg-opacity-90 rounded-xl w-1/2 h-auto p-2 -mr-56 z-50 mt-4 overflow-auto ">
                        <div className="float-left mr-4">
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
                        <div className="">
                            <p className="text-[7px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px] text-gray-700">
                                {showFullDescription ? content.description : halfDescription}
                            </p>
                            {content.description.split(" ").length > 60 && (
                                <span
                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                    className="text-red-500 text-[3px] md:text-[7px] lg:text-[7px] xl:text-[7px] 2xl:text-[7px] cursor-pointer underline"
                                >
                                    {showFullDescription ? "<-Read Less" : "Read More ->"}
                                </span>
                            )}
                        </div>
                        <p className="text-[7px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px] bottom text-gray-700 mt-2">
                            {content.endDescription}
                        </p>
                    </div>

                    <div className="w-1/2 md:w-1/2 bg-gray-200 flex items-center justify-center m-2 rounded-lg relative z-10 h-full">
                        <div className="relative w-auto h-[250px]">
                            <Image
                                src={carouselImages[currentImageIndex].src}
                                alt={carouselImages[currentImageIndex].alt}
                                width={128}
                                height={132}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                </div>

                {/* meal card */}
                {content.meals.length > 0 && (
                    <div className="relative mx-1 mr-4 mt-4 ml-10">
                        <div className="bg-transparent overflow-hidden">
                            <div className="flex items-start">
                                <div
                                    ref={scrollContainerRef}
                                    className="flex space-x-2 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
                                    style={{
                                        scrollbarWidth: "none",
                                        msOverflowStyle: "none",
                                        width: "calc(80vw + 0.5rem)", // 2 cards (40vw each) + space-x-2 (0.5rem)
                                    }}
                                    onScroll={updatePagination}
                                >
                                    {content.meals.map((meal, index) => (
                                        <div
                                            key={index}
                                            className="meal-card flex-none w-[40vw] md:w-[220px] md:ml-10 bg-[#ebd1dc] p-1 rounded-lg border border-gray-300 snap-start"
                                        >
                                            <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-2 rounded-lg">
                                                <Image
                                                    src={meal.image || "/images/meal-placeholder.jpg"}
                                                    alt={meal.name}
                                                    width={128}
                                                    height={128}
                                                    className="object-cover w-full h-full rounded-lg"
                                                />
                                            </div>
                                            <div className="p-2">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[7px] flex-1">
                                                        <span className="font-semibold whitespace-nowrap overflow-auto">{meal.name}:</span>{" "}
                                                        {meal.description}
                                                    </p>
                                                    {meal.flag && (
                                                        <div className="flex flex-col items-center">
                                                            <Image
                                                                src={meal.flag}
                                                                alt={`${meal.name} flag`}
                                                                width={60}
                                                                height={40}
                                                                className="ml-0 object-contain"
                                                            />
                                                            {meal.countryName && (
                                                                <span className="pt-[3px] font-bold uppercase text-[7px]">
                                                                    {getDisplayCountryName(meal.countryName)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* pagination button */}
                            <div className="flex justify-center">
                                <div
                                    ref={paginationRef}
                                    className="relative border-yellow-300 w-1/2 h-6 bg-white border-2 mt-2 rounded-full overflow-hidden"
                                >
                                    <button
                                        type="button"
                                        className="pagination-bar absolute h-6 w-10 bg-red-900 rounded-full cursor-pointer z-50 pointer-events-auto"
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
    );
}