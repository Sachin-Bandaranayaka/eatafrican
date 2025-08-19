// src/app/super-admin/settings/components/CurrentLoginView.tsx
"use client";

import React from 'react';

const InfoRow = ({ label, value }: { label: string, value: string }) => (
    <div className="mb-3">
        <p className="font-bold text-green-800 text-[9px] md:text-[15px]">{label}</p>
        <p className="text-black font-semibold text-[7px] md:text-[12px]">{value}</p>
    </div>
);

export const CurrentLoginView = () => {
    // This would typically come from an authentication context
    const currentUser = {
        username: '§æ¢†%',
        email: '%ad_f*#idca@eatafrican.ch',
        role: 'Super Admin',
    };

    return (
        <div className="p-4 md:p-6 -mt-10">
            <InfoRow label="Logged in as" value={currentUser.username} />
            <InfoRow label="Email" value={currentUser.email} />
            <InfoRow label="Role" value={currentUser.role} />
        </div>
    );
};
