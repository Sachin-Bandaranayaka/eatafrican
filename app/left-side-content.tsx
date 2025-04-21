import { useLocationContext } from 'lib/location-context';
import LocationSelection from 'components/location-selection';

<div className="text-center max-w-xl mb-8 md:mb-10">
  <h1 className="text-white text-base md:text-lg mb-10">
    {t('order_food_title')}
  </h1>
  <p className="text-white text-base md:text-lg">
    {t('delivery_subtitle')}
  </p>
</div>

{/* Location Selection Box */}
<LocationSelection />
