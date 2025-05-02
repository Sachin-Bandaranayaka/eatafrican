import React from 'react';

interface RightSideContentProps {
  setHowItWorksOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeliveryGuideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RightSideContent: React.FC<RightSideContentProps> = ({ setHowItWorksOpen, setDeliveryGuideOpen }) => {
  return (
    <div className="flex flex-col items-start mt-24 md:mt-24 w-full max-w-md md:max-w-lg">
      {/* Buttons side by side on medium screens and up */}
      {/* <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mb-8">
        <button
          onClick={() => setDeliveryGuideOpen(true)}
          className="flex items-center justify-center gap-2 text-white text-sm p-3 hover:text-amber-200 transition duration-200 w-full md:w-auto"
        >
          <span className="font-bold">❯❯</span>
          HOW WE DELIVER
        </button>

        <button
          onClick={() => setHowItWorksOpen(true)}
          className="flex items-center justify-center gap-2 text-white text-sm p-3 hover:text-amber-200 transition duration-200 w-full md:w-auto"
        >
          <span className="font-bold">❯❯</span>
          HOW IT WORKS
        </button>
      </div> */}


      <div className="flex flex-col items-start ml-72 mt-16 gap-4">
        <button
          onClick={() => setDeliveryGuideOpen(true)}
          className="bg-amber-900 text-white py-1.5 px-4 rounded-l-2xl border-r-2 border-t-2 border-b-2 border-amber-600"
        >
          <span className="text-sm font-bold uppercase">DELIVERY GUIDE</span>
        </button>

        <button
          onClick={() => setHowItWorksOpen(true)}
          className="bg-amber-900 text-white py-1.5 px-4 rounded-l-2xl border-r-2 border-t-2 border-b-2 border-amber-600"
        >
          <span className="text-sm font-bold uppercase">HOW IT WORKS</span>
        </button>
      </div>


      {/* Heading on top */}
      <h1 className="text-white font-bold text-base md:text-lg mb-4">
        YOUR FAVORITE AFRICAN MEALS—JUST A FEW CLICKS AWAY, WHEREVER YOU ARE IN SWITZERLAND.
      </h1>


    </div>

  );
}

export default RightSideContent;
