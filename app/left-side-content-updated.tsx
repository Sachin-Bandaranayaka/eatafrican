import { useLocationContext } from '../lib/location-context'; // Adjusted path
import LocationSelection from '../components/location-selection'; // Adjusted path

interface LeftSideContentProps {
  onViewMenu: (restaurant: string) => void;
  isViewingMenu: boolean;
  selectedRestaurant: string | null;
  onChange: () => void;
}

export default function LeftSideContent({ onViewMenu, isViewingMenu, selectedRestaurant, onChange }: LeftSideContentProps) {
  const { t } = useLocationContext(); // Define t function

  return (
    <>
      {/* Heading Text */}
      <div className="absolute max-w-3xl mb-8 md:mb-10">
        <p className="text-white font-bold md:text-lg mb-10 uppercase ml-10">
        ORDER FRESHLY PREPARED AFRICAN FOOD DIRECTLY FROM AFRICAN RESTAURANTS AND HAVE IT CONVENIENTLY DELIVERED TO YOUR HOME
        </p>
      </div>
      <div className='mt-40'>
        {/* Location Selection Box */}
        <LocationSelection
          onViewMenu={onViewMenu}
          isViewingMenu={isViewingMenu}
          selectedRestaurant={selectedRestaurant}
          onChange={onChange}
        />
      </div>
      <div className="max-w-2xl mb-8 md:mb-10 mt-20">
        <p className="text-white font-bold md:text-lg mb-10 uppercase ml-10">
          YOUR FAVOURITE AFRICAN MEALS JUST A FEW CLICKS AWAY, WHEREVER YOU IN SWITZERLAND.
        </p>
      </div>
    </>
  );
}
