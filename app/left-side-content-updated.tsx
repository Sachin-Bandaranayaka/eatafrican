"use client";

import { useState } from "react";
import { useLocationContext } from '../lib/location-context';
import LocationSelectionMobile from '../components/location-selection-mobile';
import Image from "next/image";
import { useIsMobile } from '../hooks/use-mobile';
import DeliveryGuide from '../components/delivery-guide';
import DeliveryGuideMobile from '../components/delivery-guide-mobile';
import HowItWorksMobile from '../components/how-it-works-mobile';
import HowItWorks from '../components/how-it-works';
import RestaurantListing from '../components/restaurant-list';
import ViewMenu from '../components/view-menu';
import TribalButton from '../components/tribal-button'; // Adjust the import path as needed

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
    setVisibleComponent('viewMenu');
    setActiveButton('viewMenu');
    onViewMenu(restaurant);
  };

  return (
    <div className="relative flex flex-col items-center w-full px-0 md:px-4 sm:px-0 xs:px-0 lg:px-10 h-full">
      {/* Side Buttons 02 - Desktop View (Left Side, Between Heading and Ending Text) */}
      {!isMobile && (
        <div className="hidden md:fixed md:left-0 md:top-1/2 md:transform md:-translate-y-1/2 md:flex md:flex-col md:items-start md:gap-4 md:ml-1 md:z-20">
          <TribalButton
            text="HOW WE DELIVER"
            onClick={openDeliveryGuide}
            isActive={activeButton === 'deliveryGuide'}
          />
          <TribalButton
            text="HOW IT WORKS"
            onClick={openHowItWorks}
            isActive={activeButton === 'howItWorks'}
          />
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
        <nav className="hidden sm:flex flex-col md:top-[60%] space-y-4 absolute right-0 top-1/3 transform -translate-y-1/2">
          <TribalButton
            text="RESTAURANTS IN LUZERN"
            onClick={openViewMenu}
            isActive={activeButton === 'viewMenu'}
          />
          <TribalButton
            text="AFRICAN RESTAURANTS"
            onClick={openRestaurantList}
            isActive={activeButton === 'restaurantList'}
          />
        </nav>
      )}

      {/* Lower Section */}
      <div className="relative max-w-2xl mt-2 xs:mt-6 sm:mt-8 lg:mt-2 mb-4 xs:mb-4 sm:mb-5 text-start hidden lg:block">
        {/* Ending Text */}
        {(!isMobile || (visibleComponent !== 'viewMenu' && visibleComponent !== 'restaurantList')) && (
          <p className="text-white font-bold text-xs xs:text-sm sm:text-base md:-ml-4 lg:text-md uppercase leading-relaxed">
            YOUR FAVOURITE AFRICAN MEALS JUST A FEW CLICKS AWAY, WHEREVER YOU ARE IN SWITZERLAND.
          </p>
        )}
      </div>

      {/* Side Buttons 02 - Mobile View (Centered or Left Side, Floating Vertical Stack) */}
      {isMobile && (
        <div className={`block top-1/3 flex flex-col space-y-3 z-20 w-6 ${visibleComponent ? 'mr-[100%]' : 'left-1/2 -translate-x-1/2'}`}>
          <TribalButton
            text="HOW WE DELIVER"
            onClick={openDeliveryGuide}
            isActive={activeButton === 'deliveryGuide'}
          />
          <TribalButton
            text="HOW IT WORKS"
            onClick={openHowItWorks}
            isActive={activeButton === 'howItWorks'}
          />
        </div>
      )}

      {/* Side Buttons - Mobile View (Left Side or Centered, Floating Vertical Stack) */}
      {isMobile && isViewingMenu && (
        <nav className={`block top-1/4 flex flex-col space-y-3 z-50 w-6 ${visibleComponent ? '-ml-[450px]' : 'left-1/2 -translate-x-1/2'}`}>
          <TribalButton
            text="RESTAURANTS IN LUZERN"
            onClick={openViewMenu}
            isActive={activeButton === 'viewMenu'}
          />
          <TribalButton
            text="AFRICAN RESTAURANTS"
            onClick={openRestaurantList}
            isActive={activeButton === 'restaurantList'}
          />
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
        <div className="fixed right-0 top-0 w-1/2 max-w-2xl h-full overflow-y-auto overflow-x-hidden z-20 bg-transparent p-4 box-border [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {visibleComponent === 'restaurantList' && <RestaurantListing />}
          {visibleComponent === 'viewMenu' && <ViewMenu />}
        </div>
      )}
    </div>
  );
}