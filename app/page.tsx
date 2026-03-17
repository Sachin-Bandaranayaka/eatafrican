// app/page.tsx
"use client";

import ClientOnly from '../components/client-only';
import NewHomepage from '../components/new-homepage';

export default function Home() {
    return (
        <ClientOnly>
            <main className="relative w-full min-h-screen">
                <NewHomepage />
            </main>
        </ClientOnly>
    );
}
