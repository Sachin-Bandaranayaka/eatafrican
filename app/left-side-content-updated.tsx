import { useLocationContext } from '../lib/location-context'; // Adjusted path
import LocationSelection from '../components/location-selection'; // Adjusted path

export default function LeftSideContent() {
  const { t } = useLocationContext(); // Define t function

  return (
    <>
      {/* Heading Text */}
      <div className="max-w-2xl mb-8 md:mb-10">
        <p className="text-white font-bold md:text-lg mb-10 uppercase">
          Order freshly prepared African food directly from African restaurants and have it conveniently delivered to your home
        </p>
        {/* Location Selection Box */}
        <LocationSelection />
      </div>
    </>
  );
}
