"use client";

import { useState } from "react";
import { useLocationContext } from "../lib/location-context";
import LocationSelectionMobile from "../components/location-selection-mobile";
import Image from "next/image";
import { useIsMobile } from "../hooks/use-mobile";
import DeliveryGuide from "../components/delivery-guide";
import DeliveryGuideMobile from "../components/delivery-guide-mobile";
import HowItWorksMobile from "../components/how-it-works-mobile";
import HowItWorks from "../components/how-it-works";
import RestaurantListing from "../components/restaurant-list";
import ViewMenu from "../components/view-menu";
import UserDashboardComponent from "../components/userDashboard";
import TribalButton from "../components/tribal-button";
import AboutSpecialty from "../components/about-specialty";
import AboutUs from "../components/aboutUs";
import LegalNotice from "../components/legalNotice";
import Terms from "../components/termsConditions";
import PrivacyPolicy from "../components/privacyPolicy";

interface LeftSideContentProps {
  visibleComponent: string | null;
  setVisibleComponent: (component: string | null) => void;
  onViewMenu: (restaurant: string) => void;
  isViewingMenu: boolean;
  selectedRestaurant: string | null;
  onChange: () => void;
}

export default function LeftSideContent({
  visibleComponent,
  setVisibleComponent,
  onViewMenu,
  isViewingMenu,
  selectedRestaurant,
  onChange,
}: LeftSideContentProps) {
  const { t } = useLocationContext();
  const isMobile = useIsMobile();
  const [aboutSpecialtyCuisineType, setAboutSpecialtyCuisineType] = useState<string | null>(null);

  const activeButton = ["deliveryGuide", "howItWorks", "restaurantList", "viewMenu"].includes(
    visibleComponent
  )
    ? visibleComponent
    : null;

  const openDeliveryGuide = () => {
    setVisibleComponent("deliveryGuide");
  };

  const openHowItWorks = () => {
    setVisibleComponent("howItWorks");
  };

  const openRestaurantList = () => {
    setVisibleComponent("restaurantList");
  };

  const openViewMenu = () => {
    setVisibleComponent("viewMenu");
    if (selectedRestaurant && !isViewingMenu) {
      onViewMenu(selectedRestaurant);
    }
  };

  const closeComponents = () => {
    setVisibleComponent(null);
  };

  const handleViewMenu = (restaurant: string) => {
    setVisibleComponent("viewMenu");
    onViewMenu(restaurant);
  };

  const handleAboutSpecialtyOpen = (cuisineType: string) => {
    setAboutSpecialtyCuisineType(cuisineType);
    setVisibleComponent("aboutSpecialty");
  };

  const handleAboutSpecialtyClose = () => {
    setVisibleComponent(null);
    setAboutSpecialtyCuisineType(null);
  };

  const handleOpenComponent = (component: string) => {
    setVisibleComponent(component);
  };

  return (
    <div className="relative flex flex-col items-center w-full px-0 md:px-4 sm:px-0 xs:px-0 lg:px-10 h-full">
      {!isMobile && (
        <div className="hidden md:fixed md:left-[2px] md:top-1/2 md:transform md:-translate-y-1/2 md:flex md:flex-col md:items-start md:gap-4 md:ml-1 md:z-50">
          <TribalButton
            text={t('how_we_deliver')}
            onClick={openDeliveryGuide}
            isActive={activeButton === "deliveryGuide"}
          />
          <TribalButton
            text={t('how_it_works')}
            onClick={openHowItWorks}
            isActive={activeButton === "howItWorks"}
          />
        </div>
      )}

      <LocationSelectionMobile
        onViewMenu={handleViewMenu}
        isViewingMenu={isViewingMenu}
        selectedRestaurant={selectedRestaurant}
        onChange={onChange}
        onAboutSpecialtyOpen={handleAboutSpecialtyOpen}
      />

      {!isMobile && isViewingMenu && (
        <nav className="z-50 hidden sm:flex flex-col md:top-[55%] space-y-4 absolute right-10 top-1/3 transform -translate-y-1/2">
          <TribalButton
            text="RESTAURANTS IN LUZERN"
            onClick={openViewMenu}
            isActive={activeButton === "viewMenu"}
          />
          <TribalButton
            text="AFRICAN RESTAURANTS"
            onClick={openRestaurantList}
            isActive={activeButton === "restaurantList"}
          />
        </nav>
      )}

      <div className="relative mt-2 mb-4 text-start hidden lg:block">
        {(!isMobile || (visibleComponent !== "viewMenu" && visibleComponent !== "restaurantList")) && (
          <p className="w-[90%] text-white font-bold text-xs xs:text-sm sm:text-base mt-10 md:-ml-4 lg:text-md uppercase leading-relaxed">
            {t('tagline')}
          </p>
        )}
      </div>

      {isMobile && (
        <div
          className={`block top-1/3 flex flex-col space-y-3 z-20 w-6 ${visibleComponent ? "mr-[100%]" : "left-1/2 -translate-x-1/2"
            }`}
        >
          <TribalButton
            text={t('how_we_deliver')}
            onClick={openDeliveryGuide}
            isActive={activeButton === "deliveryGuide"}
          />
          <TribalButton
            text={t('how_it_works')}
            onClick={openHowItWorks}
            isActive={activeButton === "howItWorks"}
          />
        </div>
      )}

      {isMobile && isViewingMenu && (
        <nav
          className={`block top-1/4 pt-4 flex flex-col space-y-3 z-50 w-6 ${visibleComponent ? "mr-[100%]" : "left-1/2 -translate-x-1/2"
            }`}
        >
          <TribalButton
            text="RESTAURANTS IN LUZERN"
            onClick={openViewMenu}
            isActive={activeButton === "viewMenu"}
          />
          <TribalButton
            text="AFRICAN RESTAURANTS"
            onClick={openRestaurantList}
            isActive={activeButton === "restaurantList"}
          />
        </nav>
      )}

      {isMobile ? (
        <>
          {visibleComponent === "deliveryGuide" && (
            <>
              {console.log("Rendering DeliveryGuideMobile")}
              <DeliveryGuideMobile isOpen={true} onClose={closeComponents} />
            </>
          )}
          {visibleComponent === "howItWorks" && (
            <>
              {console.log("Rendering HowItWorksMobile")}
              <HowItWorksMobile isOpen={true} onClose={closeComponents} />
            </>
          )}
          {visibleComponent === "restaurantList" && (
            <>
              {console.log("Rendering RestaurantListing")}
              <RestaurantListing />
            </>
          )}
          {visibleComponent === "viewMenu" && (
            <>
              {console.log("Rendering ViewMenu")}
              <ViewMenu />
            </>
          )}
          {visibleComponent === "aboutSpecialty" && aboutSpecialtyCuisineType && (
            <>
              {console.log("Rendering AboutSpecialty")}
              <AboutSpecialty cuisineType={aboutSpecialtyCuisineType} onClose={handleAboutSpecialtyClose} />
            </>
          )}
          {visibleComponent === "dashboard" && (
            <>
              {console.log("Rendering UserDashboardComponent")}
              <UserDashboardComponent onClose={closeComponents} />
            </>
          )}
          {visibleComponent === "about" && (
            <>
              {console.log("Rendering AboutUs")}
              <AboutUs isOpen={true} onClose={closeComponents} />
            </>
          )}
          {visibleComponent === "legal" && (
            <>
              {console.log("Rendering LegalNotice")}
              <LegalNotice isOpen={true} onClose={closeComponents} />
            </>
          )}
          {visibleComponent === "termsConditions" && (
            <>
              {console.log("Rendering Terms")}
              <Terms isOpen={true} onClose={closeComponents} />
            </>
          )}
          {visibleComponent === "privacy" && (
            <>
              {console.log("Rendering PrivacyPolicy")}
              <PrivacyPolicy isOpen={true} onClose={closeComponents} />
            </>
          )}
        </>
      ) : (
        <>
          <DeliveryGuide isOpen={visibleComponent === "deliveryGuide"} onClose={closeComponents} />
          <HowItWorks isOpen={visibleComponent === "howItWorks"} onClose={closeComponents} />
          <div className="fixed right-0 w-[850px] top-16 mb-10 h-[85vh] overflow-x-hidden z-20 bg-transparent p-4 box-border [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {visibleComponent === "restaurantList" && (
              <>
                {console.log("Rendering RestaurantListing (Desktop)")}
                <RestaurantListing />
              </>
            )}
            {visibleComponent === "viewMenu" && (
              <>
                {console.log("Rendering ViewMenu (Desktop)")}
                <ViewMenu />
              </>
            )}
            {visibleComponent === "aboutSpecialty" && aboutSpecialtyCuisineType && (
              <>
                {console.log("Rendering AboutSpecialty (Desktop)")}
                <AboutSpecialty cuisineType={aboutSpecialtyCuisineType} onClose={handleAboutSpecialtyClose} />
              </>
            )}
            {visibleComponent === "dashboard" && (
              <>
                {console.log("Rendering UserDashboardComponent (Desktop)")}
                <UserDashboardComponent onClose={closeComponents} />
              </>
            )}
            {visibleComponent === "about" && (
              <>
                {console.log("Rendering AboutUs (Desktop)")}
                <AboutUs isOpen={true} onClose={closeComponents} />
              </>
            )}
            {visibleComponent === "legal" && (
              <>
                {console.log("Rendering LegalNotice (Desktop)")}
                <LegalNotice isOpen={true} onClose={closeComponents} />
              </>
            )}
            {visibleComponent === "termsConditions" && (
              <>
                {console.log("Rendering Terms (Desktop)")}
                <Terms isOpen={true} onClose={closeComponents} />
              </>
            )}
            {visibleComponent === "privacy" && (
              <>
                {console.log("Rendering PrivacyPolicy (Desktop)")}
                <PrivacyPolicy isOpen={true} onClose={closeComponents} />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}