"use client";

import App from "./driverPortal/auth/login";

export default function DriverPortalAuth({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    return (
        <App onLoginSuccess={onLoginSuccess} />
    );
}
