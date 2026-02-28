import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

const BackgroundLayout = ({ children }: { children?: React.ReactNode }) => (
  <div className="relative w-full min-h-screen bg-black text-white overflow-hidden font-sans p-8">
    {/* Language Selector */}
    <div className="absolute top-3 left-0 z-20 ml-10">
      <div className="flex items-center">
        <select className="bg-black text-white font-bold px-1 py-4 pl-8 rounded text-xs appearance-none">
          <option value="en">EN</option>
          <option value="fr">FR</option>
          <option value="es">ES</option>
        </select>
        <ChevronDown size={18} strokeWidth={4} className="text-white ml-1" />
      </div>
    </div>

    {/* Portal and Login Information */}
    <div className="absolute top-2 left-0.5 z-20">
      <div
        className="text-white text-sm font-bold mt-20 px-4 py-2 border"
        style={{ backgroundColor: '#2F6B2F', borderColor: '#2F6B2F' }}
      >
        EAT AFRICAN RESTAURANTS PORTAL
      </div>

      <div className="flex items-center gap-1 font-bold text-xs mt-8 ml-10 pl-4">
        <span style={{ backgroundColor: '#2F6B2F' }} className="text-white px-2 py-1 rounded flex items-center">
          ONBOARDING
          <ChevronDown size={18} strokeWidth={4} className="ml-2" />
        </span>
      </div>
    </div>

    {/* Top Right Buttons */}
    <div className="absolute top-4 right-12 z-20 w-fit flex items-center space-x-6">
       <button
        // onClick={() => setIsLoginModalOpen(true)}
        className="group flex items-center"
      >
        <span className="relative text-xs font-bold text-yellow-500 pr-4 pb-1">
          LOGOUT
          <span
            className="absolute bottom-0 h-[1.5px] bg-white transition-all
                       group-hover:bg-yellow-500"
            style={{ left: '-1rem', width: 'calc(100% + 2rem)' }}
          />
        </span>
      
        <span className="relative w-10 h-10 -ml-3">
          <Image
            src="/images/UserIcon (1).png"
            alt="Profile"
            fill
            className="object-contain"
          />
        </span>
      </button>

      <button className="relative w-8 h-8 hover:scale-110 transition">
        <Image src="/images/cart_icon.png" alt="Cart" fill className="object-contain" />
      </button>
    </div>

    {/* Background Image */}
    <div className="absolute inset-0 z-0">
      <Image
        src="/images/eatafricanbck1 (1).png"
        alt="Background"
        fill
        className="object-cover opacity-60"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
    </div>

    {children}
  </div>
);

export default function RestaurantOnboarding() {
  return (
    <BackgroundLayout>
      <div className="absolute z-10 top-36 left-1/2 transform -translate-x-1/2">
        <div
          style={{ backgroundColor: '#E8D7B4' }}
          className="w-full max-w-[768px] min-h-64 shadow-lg flex text-black text-xs opacity-70 mb-4"
        >
          {/* Left Column */}
          <div className="flex-1 p-6" style={{ flex: 1.2 }}>
            <p className="mb-6 text-green-700 text-xs font-bold">
              Finish the steps below to get your restaurant ready to go live.
            </p>

            <ol className="space-y-6">
              <li className="flex gap-3">
                <span className="min-w-[1.5rem]">1.</span>
                <div>
                  <strong className="font-bold">Logo</strong><br />
                  Upload your restaurant logo (PNG/JPG/WebP).<br />
                  Square works best (≥512×512).<br />
                  <span className="text-orange-800 text-xs mt-4 block font-bold">
                    👉🏿 open section
                  </span>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="min-w-[1.5rem]">2.</span>
                <div>
                  <strong className="font-bold">Opening Times</strong><br />
                  Add your opening times for <strong className="font-bold">Monday–Sunday</strong>.<br />
                  <span className="text-orange-800 text-xs mt-4 block font-bold">
                    👉🏿 open section
                  </span>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="min-w-[1.5rem]">3.</span>
                <div>
                  <strong className="font-bold">Menu</strong><br />
                  Add <strong className="font-bold">at least 4 meals</strong> to your Main Dishes Menu (each needs a name and price).<br />
                  You can add Snacks/Drinks later — only Main Menu is required to submit.<br />
                  <span className="text-orange-800 text-xs mt-4 block font-bold">
                    👉🏿 open section
                  </span>
                </div>
              </li>
            </ol>

            <div className="mt-8 space-y-2">
              <p className="text-green-700 text-xs font-bold">
                After you’ve submitted all sections
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
                    <strong className="font-bold">We’ll notify you</strong> as soon as <strong className="font-bold">your restaurant is activated</strong>.
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="min-w-[1.5rem]">3.</span>
                  <div>
                    If a section shows <strong className="font-bold">“declined – read comment”</strong> in the green box:
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
            <h3 className="text-xs font-bold mb-4 text-green-700">
              Onboarding Status Panel
            </h3>

            <p className="text-xs text-black mb-2">
              • <strong className="font-bold">Submitted</strong> shows a green ✓ when you’ve sent a section for review.
            </p>

            <p className="text-xs text-black mb-4">
              • <strong className="font-bold">Status</strong> shows <strong className="font-bold">approved / waiting / declined — read comment.</strong>
            </p>

            <div className="border-t pt-4">
              <table className="w-full text-xs">
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
    </BackgroundLayout>
  );
}
