import HandButton from '@/app/components/HandButton';

export default function OverviewPage() {
  return (
    <div className="flex justify-center w-full pt-28 sm:pt-20">
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-4 w-full max-w-3xl">
        {/* First Rectangle - Orders */}
        <div
          style={{ backgroundColor: '#E8D7B4' }}
          className="flex-1 min-h-40 shadow-lg flex flex-col opacity-85"
        >
          <div className="p-4 flex-1">
            <h3 className="text-xs font-bold text-green-700 mb-2">Orders</h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-black">New</span>
                <span className="text-xs font-bold text-black">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-black">In Processing</span>
                <span className="text-xs font-bold text-black">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-black">In Transit</span>
                <span className="text-xs font-bold text-black">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-black">Delivered</span>
                <span className="text-xs font-bold text-black">0</span>
              </div>
            </div>
          </div>

          <HandButton />
        </div>

        {/* Second Rectangle - Earnings Today */}
        <div
          style={{ backgroundColor: '#E8D7B4' }}
          className="flex-1 min-h-40 shadow-lg flex flex-col opacity-85"
        >
          <div className="p-4 flex-1">
            <h3 className="text-xs font-bold text-green-700 mb-2">Earnings Today</h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-black">Total Earnings Today</span>
                <span className="text-xs font-bold text-black">CHF 0</span>
              </div>
            </div>
          </div>

          <HandButton />
        </div>
      </div>
    </div>
  );
}
