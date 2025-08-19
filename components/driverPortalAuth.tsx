"use client";

import { useRef } from "react";
import Login from "./driverPortal/auth/login";

export default function DriverPortalAuth({ onLoginSuccess }: { onLoginSuccess: () => void }) {

    const dashboardRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex flex-col justify-center items-center">
            <div ref={dashboardRef} className="z-0 w-1/2 bg-transparent xs:p-6 flex flex-col md:flex-row space-y-4 xs:space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-[80%] md:mt-0 ml-3">

                <main className="w-full p-2 md:p-0 flex flex-col xs:space-y-6">
                    <Login onLoginSuccess={onLoginSuccess} />
                </main>
            </div>
        </div>
    );
}