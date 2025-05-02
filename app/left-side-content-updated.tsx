import { useLocationContext } from '../lib/location-context';
import LocationSelection from '../components/location-selection';
import LocationSelectionMobile from '../components/location-selection-mobile';
import Image from "next/image";
import { useIsMobile } from '../hooks/use-mobile';

interface LeftSideContentProps {
  onViewMenu: (restaurant: string) => void;
  isViewingMenu: boolean;
  selectedRestaurant: string | null;
  onChange: () => void;
}

export default function LeftSideContent({ onViewMenu, isViewingMenu, selectedRestaurant, onChange }: LeftSideContentProps) {
  const { t } = useLocationContext();
  const isMobile = useIsMobile();

  return (
    <div className="relative flex flex-col items-center w-full px-4 sm:px-0 xs:px-0 lg:px-10 min-h-[calc(100vh-64px)]">
      {/* Heading Text */}
      <div className="max-w-3xl mb-10 sm:mb-8 lg:mb-28 text-center">
        <p className="text-white font-bold text-xs xs:text-sm sm:text-base lg:text-md uppercase leading-relaxed">
          ORDER FRESHLY PREPARED AFRICAN FOOD DIRECTLY FROM AFRICAN RESTAURANTS AND HAVE IT CONVENIENTLY DELIVERED TO YOUR HOME
        </p>
      </div>

      {/* Location Selection Box */}
      {isMobile ? (
        <LocationSelectionMobile
          onViewMenu={onViewMenu}
          isViewingMenu={isViewingMenu}
          selectedRestaurant={selectedRestaurant}
          onChange={onChange}
        />
      ) : (
        <LocationSelectionMobile
          onViewMenu={onViewMenu}
          isViewingMenu={isViewingMenu}
          selectedRestaurant={selectedRestaurant}
          onChange={onChange}
        />
      )}

      <div className="absolute max-w-2xl mt-36  mb-6 xs:mb-8 sm:mb-10 text-center">
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
        <div className="block sm:hidden absolute -left-20 -top-16 w-24 xs:w-20 h-24 xs:h-20 z-10 translate-x-1/4">
          <Image
            src="/images/chef-male.png"
            alt="Male Chef"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>

        {/* Chef female - Mobile only */}
        <div className="block sm:hidden absolute -right-20 -top-16 w-24 xs:w-20 h-24 xs:h-20 z-10 -translate-x-1/4">
          <Image
            src="/images/chef-female.png"
            alt="Female Chef"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>

        <p className="text-white font-bold text-xs xs:text-sm sm:text-base lg:text-md uppercase leading-relaxed">
          YOUR FAVOURITE AFRICAN MEALS JUST A FEW CLICKS AWAY, WHEREVER YOU ARE IN SWITZERLAND.
        </p>
      </div>
    </div>
  );
}
