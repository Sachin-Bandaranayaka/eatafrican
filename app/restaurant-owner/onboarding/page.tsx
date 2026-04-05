import HandButton from '@/app/components/HandButton';

export default function RestaurantOnboarding() {
  return (
    <div className="flex justify-center w-full pt-32 sm:pt-20 px-0">
      <div
        style={{ backgroundColor: '#E8D7B4' }}
        className="w-[calc(100%+2rem)] -mx-4 sm:w-full sm:mx-0 sm:max-w-[768px] min-h-64 shadow-lg flex flex-col sm:flex-row text-black text-[10px] sm:text-xs opacity-85 mb-4"
      >
        {/* Left Column */}
        <div className="flex-1 p-6" style={{ flex: 1.2 }}>
          <p className="mb-6 text-green-700 text-[10px] sm:text-xs font-bold">
            Finish the steps below to get your restaurant ready to go live.
          </p>

          <ol className="space-y-6">
            <li className="flex gap-3">
              <span className="min-w-[1.5rem]">1.</span>
              <div>
                <strong className="font-bold">Logo</strong><br />
                Upload your restaurant logo (PNG/JPG/WebP).<br />
                Square works best (≥512×512).<br />
                <HandButton text="open section" variant="inline" className="mt-4 block text-[10px] sm:text-xs" />
              </div>
            </li>

            <li className="flex gap-3">
              <span className="min-w-[1.5rem]">2.</span>
              <div>
                <strong className="font-bold">Opening Times</strong><br />
                Add your opening times for <strong className="font-bold">Monday–Sunday</strong>.<br />
                <HandButton text="open section" variant="inline" className="mt-4 block text-[10px] sm:text-xs" />
              </div>
            </li>

            <li className="flex gap-3">
              <span className="min-w-[1.5rem]">3.</span>
              <div>
                <strong className="font-bold">Menu</strong><br />
                Add <strong className="font-bold">at least 4 meals</strong> to your Main Dishes Menu (each needs a name and price).<br />
                You can add Snacks/Drinks later — only Main Menu is required to submit.<br />
                <HandButton text="open section" variant="inline" className="mt-4 block text-[10px] sm:text-xs" />
              </div>
            </li>
          </ol>

          <div className="mt-8 space-y-2">
            <p className="text-green-700 text-[10px] sm:text-xs font-bold">
              After you've submitted all sections
            </p>

            <ol className="space-y-1">
              <li className="flex gap-3">
                <span className="min-w-[1.5rem]">1.</span>
                <div>
                  <strong className="font-bold">Watch the green status panel on the right</strong> — it will update per section.
                  (✅submitted/approved, or declined with a note).
                </div>
              </li>

              <li className="flex gap-3">
                <span className="min-w-[1.5rem]">2.</span>
                <div>
                  <strong className="font-bold">We'll notify you</strong> as soon as <strong className="font-bold">your restaurant is activated</strong>.
                </div>
              </li>

              <li className="flex gap-3">
                <span className="min-w-[1.5rem]">3.</span>
                <div>
                  If a section shows <strong className="font-bold">"declined – read comment"</strong> in the green box:
                </div>
              </li>

              <li className="flex gap-3">
                <span className="min-w-[1.5rem]">4.</span>
                <div>Open that section.</div>
              </li>

              <li className="flex gap-3">
                <span className="min-w-[1.5rem]">5.</span>
                <div>Read the comment at the top.</div>
              </li>

              <li className="flex gap-3">
                <span className="min-w-[1.5rem]">6.</span>
                <div>Make the change.</div>
              </li>

              <li className="flex gap-3">
                <span className="min-w-[1.5rem]">7.</span>
                <div><strong>Submit for review</strong> again.</div>
              </li>
            </ol>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 p-6">
          <h3 className="text-[10px] sm:text-xs font-bold mb-4 text-green-700">
            Onboarding Status Panel
          </h3>

          <p className="text-[10px] sm:text-xs text-black mb-2">
            • <strong className="font-bold">Submitted</strong> shows a green ✓ when you've sent a section for review.
          </p>

          <p className="text-[10px] sm:text-xs text-black mb-4">
            • <strong className="font-bold">Status</strong> shows <strong className="font-bold">approved / waiting / declined — read comment.</strong>
          </p>

          <div className="border-t pt-4">
            <table className="w-full text-[10px] sm:text-xs">
              <thead>
                <tr>
                  <th className="text-left font-bold">SECTION</th>
                  <th className="text-left font-bold">STATUS</th>
                </tr>
              </thead>
              <tbody style={{ marginTop: '1rem' }}>
                <tr>
                  <td>Logo</td>
                  <td>–</td>
                </tr>
                <tr>
                  <td>Opening Times</td>
                  <td>–</td>
                </tr>
                <tr>
                  <td>Menu</td>
                  <td>–</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

