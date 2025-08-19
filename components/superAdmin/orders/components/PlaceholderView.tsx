// src/app/super-admin/orders/components/PlaceholderView.tsx
"use client";

import React from 'react';

export const PlaceholderView = ({ status }: { status: string }) => {
    return (
        <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-4 min-h-[550px] flex justify-center items-center">
            <p className="text-gray-500 font-bold text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">{status} view is not built yet.</p>
        </div>
    );
};
