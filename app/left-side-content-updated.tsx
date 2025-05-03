"use client";

import { useState } from "react";
import { useLocationContext } from '../lib/location-context';
import LocationSelection from '../components/location-selection';
import LocationSelectionMobile from '../components/location-selection-mobile';
import Image from "next/image";
import { useIsMobile } from '../hooks/use-mobile';
import DeliveryGuide from '../components/delivery-guide';
import HowItWorks from '../components/how-it-works';
import DeliveryGuideMobile from '../components/delivery-guide-mobile';
import HowItWorksMobile from '../components/how-it-works-mobile';
import RestaurantListing from '../components/restaurant-list';
import ViewMenu from '../components/view-menu';

interface LeftSideContentProps {
  onViewMenu: (restaurant: string) => void;
  isViewingMenu: boolean;
  selectedRestaurant: string | null;
  onChange: () => void;
}

export default function LeftSideContent({ onViewMenu, isViewingMenu, selectedRestaurant, onChange }: LeftSideContentProps) {
  const { t } = useLocationContext();
  const isMobile = useIsMobile();

  // State to track which component is visible: 'deliveryGuide', 'howItWorks', 'restaurantList', 'viewMenu', or null
  const [visibleComponent, setVisibleComponent] = useState<string | null>(null);
  // State to track the active button: 'deliveryGuide', 'howItWorks', 'restaurantList', 'viewMenu', or null
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const openDeliveryGuide = () => {
    setVisibleComponent('deliveryGuide');
    setActiveButton('deliveryGuide');
  };

  const openHowItWorks = () => {
    setVisibleComponent('howItWorks');
    setActiveButton('howItWorks');
  };

  const openRestaurantList = () => {
    setVisibleComponent('restaurantList');
    setActiveButton('restaurantList');
  };

  const openViewMenu = () => {
    setVisibleComponent('viewMenu');
    setActiveButton('viewMenu');
    if (selectedRestaurant && !isViewingMenu) {
      onViewMenu(selectedRestaurant);
    }
  };

  const closeComponents = () => {
    setVisibleComponent(null);
    setActiveButton(null);
  };

  // Handle VIEW MENU from LocationSelectionMobile
  const handleViewMenu = (restaurant: string) => {
    setVisibleComponent('viewMenu'); // Show ViewMenu immediately
    setActiveButton('viewMenu'); // Set VIEW MENU as active
    onViewMenu(restaurant); // Update parent state
  };

  return (
    <div className="relative flex flex-col items-center w-full px-4 sm:px-0 xs:px-0 lg:px-10 min-h-[calc(100vh-64px)]">
      {/* Heading Text */}
      <div className="max-w-3xl mb-10 sm:mb-8 lg:mb-28 text-center">
        <p className="text-white font-bold text-xs xs:text-sm sm:text-base lg:text-md uppercase leading-relaxed">
          ORDER FRESHLY PREPARED AFRICAN FOOD DIRECTLY FROM AFRICAN RESTAURANTS AND HAVE IT CONVENIENTLY DELIVERED TO YOUR HOME
        </p>
      </div>

      {/* Side Buttons 02 - Desktop View (Left Side, Between Heading and Ending Text) */}
      {!isMobile && (
        <div className="hidden md:fixed md:left-0 md:top-1/2 md:transform md:-translate-y-1/2 md:flex md:flex-col md:items-start md:gap-4 md:ml-4 md:z-50">
          <button
            onClick={openDeliveryGuide}
            className={`bg-${activeButton === 'deliveryGuide' ? 'green-600' : 'amber-900'} text-white py-6 px-0 rounded-2xl border-2 border-amber-600 hover:text-amber-200 transition duration-200 transform rotate-180`}
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            <span className="text-xs font-bold uppercase">HOW WE DELIVER</span>
          </button>
          <button
            onClick={openHowItWorks}
            className={`bg-${activeButton === 'howItWorks' ? 'green-600' : 'amber-900'} text-white py-6 px-0 rounded-2xl border-2 border-amber-600 hover:text-amber-200 transition duration-200 transform rotate-180`}
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            <span className="text-xs font-bold uppercase">HOW IT WORKS</span>
          </button>
        </div>
      )}

      {/* Location Selection Box */}
      <LocationSelectionMobile
        onViewMenu={handleViewMenu}
        isViewingMenu={isViewingMenu}
        selectedRestaurant={selectedRestaurant}
        onChange={onChange}
      />

      {/* Side Buttons - Desktop View (Right Side, Between Heading and Ending Text) */}
      {!isMobile && isViewingMenu && (
        <nav className="hidden sm:flex flex-col space-y-4 absolute right-0 top-1/3 transform -translate-y-1/2">
          <button
            onClick={openViewMenu}
            className={`w-6 bg-${activeButton === 'viewMenu' ? 'green-600' : 'amber-900'} text-white py-4 xs:py-6 px-0 rounded-2xl border-2 border-white hover:text-amber-200 transition duration-200 transform rotate-180`}
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            <span className="text-[10px] xs:text-xs font-bold uppercase">RESTAURANTS IN LUZERN</span>
          </button>
          <button
            onClick={openRestaurantList}
            className={`w-6 bg-${activeButton === 'restaurantList' ? 'green-600' : 'amber-900'} text-white py-4 xs:py-6 px-0 rounded-2xl border-2 border-white hover:bg-[#2E552B] transition duration-200 transform rotate-180`}
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            <span className="text-[10px] xs:text-xs font-bold uppercase">AFRICAN RESTAURANTS</span>
          </button>
        </nav>
      )}

      {/* Chef Images */}
      <div className="absolute max-w-2xl mt-36 mb-6 xs:mb-8 sm:mb-10 text-center">
        {/* Chef male - Desktop only */}
        <div className="hidden sm:block absolute -ml-40 -top-56 w-32 h-32 lg:-left-40 lg:-top-28 lg:w-40 lg:h-40 z-10 translate-x-1/4">
          <Image
            src="/images/chef-male.png"
            alt="Male Chef"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>

        {/* Chef female - Desktop only */}
        <div className="hidden sm:block absolute -mr-40 -top-24 w-32 h-32 lg:-right-40 lg:-top-28 lg:w-40 lg:h-40 z-10 -translate-x-1/4">
          <Image
            src="/images/chef-female.png"
            alt="Female Chef"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>
      </div>

      {/* Lower Section */}
      <div className="relative max-w-2xl mt-10 xs:mt-12 sm:mt-16 lg:mt-10 mb-6 xs:mb-8 sm:mb-10 text-center">
        {/* Chef male - Mobile only */}
        {(!isMobile || (visibleComponent !== 'viewMenu' && visibleComponent !== 'restaurantList')) && (
          <div className="block sm:hidden absolute -left-20 -top-16 w-24 xs:w-20 h-24 xs:h-20 z-10 translate-x-1/4">
            <Image
              src="/images/chef-male.png"
              alt="Male Chef"
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        )}

        {/* Chef female - Mobile only */}
        {(!isMobile || (visibleComponent !== 'viewMenu' && visibleComponent !== 'restaurantList')) && (
          <div className="block sm:hidden absolute -right-20 -top-16 w-24 xs:w-20 h-24 xs:h-20 z-10 -translate-x-1/4">
            <Image
              src="/images/chef-female.png"
              alt="Female Chef"
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        )}

        {/* Ending Text */}
        {(!isMobile || (visibleComponent !== 'viewMenu' && visibleComponent !== 'restaurantList')) && (
          <p className="text-white font-bold text-xs xs:text-sm sm:text-base lg:text-md uppercase leading-relaxed">
            YOUR FAVOURITE AFRICAN MEALS JUST A FEW CLICKS AWAY, WHEREVER YOU ARE IN SWITZERLAND.
          </p>
        )}
      </div>


      {/* Side Buttons 02 - Mobile View (Centered or Left Side, Floating Vertical Stack) */}
      {isMobile && (
        <div className={`block top-1/3 flex flex-col space-y-3 z-50 w-6 ${visibleComponent ? '-ml-[450px]' : 'left-1/2 -translate-x-1/2'}`}>
          <button
            onClick={openDeliveryGuide}
            className={`bg-${activeButton === 'deliveryGuide' ? 'green-600' : 'amber-900'} text-white py-6 rounded-2xl border-2 border-amber-600 hover:text-amber-200 shadow-lg transition duration-200 transform rotate-180`}
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            <span className="text-xs font-bold uppercase">HOW WE DELIVER</span>
          </button>
          <button
            onClick={openHowItWorks}
            className={`bg-${activeButton === 'howItWorks' ? 'green-600' : 'amber-900'} text-white py-6 rounded-2xl border-2 border-amber-600 hover:text-amber-200 shadow-lg transition duration-200 transform rotate-180`}
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            <span className="text-xs font-bold uppercase">HOW IT WORKS</span>
          </button>
        </div>
      )}

      {/* Side Buttons - Mobile View (Left Side or Centered, Floating Vertical Stack) */}
      {isMobile && isViewingMenu && (
        <nav className={`block top-1/4 flex flex-col space-y-3 z-50 w-6 ${visibleComponent ? '-ml-[450px]' : 'left-1/2 -translate-x-1/2'}`}>
          <button
            onClick={openViewMenu}
            className={`w-6 bg-${activeButton === 'viewMenu' ? 'green-600' : 'amber-900'} text-white py-4 xs:py-6 px-0 rounded-2xl border-2 border-white hover:text-amber-200 transition duration-200 transform rotate-180`}
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            <span className="text-[10px] xs:text-xs font-bold uppercase">RESTAURANTS IN LUZERN</span>
          </button>
          <button
            onClick={openRestaurantList}
            className={`w-6 bg-${activeButton === 'restaurantList' ? 'green-600' : 'amber-900'} text-white py-4 xs:py-6 px-0 rounded-2xl border-2 border-white hover:bg-[#2E552B] transition duration-200 transform rotate-180`}
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            <span className="text-[10px] xs:text-xs font-bold uppercase">AFRICAN RESTAURANTS</span>
          </button>
        </nav>
      )}
      
      {/* Render DeliveryGuide and HowItWorks components with controlled visibility */}
      {isMobile ? (
        <>
          <DeliveryGuideMobile isOpen={visibleComponent === 'deliveryGuide'} onClose={closeComponents} />
          <HowItWorksMobile isOpen={visibleComponent === 'howItWorks'} onClose={closeComponents} />
          {/* Mobile view: Render ViewMenu and RestaurantListing below ending text */}
          {visibleComponent === 'restaurantList' && <RestaurantListing />}
          {visibleComponent === 'viewMenu' && <ViewMenu />}
        </>
      ) : (
        <>
          <DeliveryGuide isOpen={visibleComponent === 'deliveryGuide'} onClose={closeComponents} />
          <HowItWorks isOpen={visibleComponent === 'howItWorks'} onClose={closeComponents} />
        </>
      )}

      {/* Desktop view: Render ViewMenu and RestaurantListing on the right side */}
      {!isMobile && (
        <div className="fixed right-0 top-0 w-1/2 max-w-2xl h-full overflow-y-auto overflow-x-hidden z-40 bg-transparent p-4 box-border [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {visibleComponent === 'restaurantList' && <RestaurantListing />}
          {visibleComponent === 'viewMenu' && <ViewMenu />}
        </div>
      )}
    </div>
  );
}