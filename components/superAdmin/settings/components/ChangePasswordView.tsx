// src/app/super-admin/settings/components/ChangePasswordView.tsx
"use client";

import React, { useState } from 'react';

const InfoRow = ({ label, value }: { label: string, value: string }) => (
    <div className="mb-3">
        <p className="font-bold text-green-800 text-[9px] md:text-[15px]">{label}</p>
        <p className="text-black font-semibold text-[7px] md:text-[12px]">{value}</p>
    </div>
);

const InputField = ({ label, type = "password" }: { label: string, type?: string }) => (
    <div className="mb-3">
        <label className="block font-bold text-black text-[9px] md:text-[15px] mb-1">{label}</label>
        <input
            type={type}
            className="w-full md:w-1/2 bg-white border border-gray-400 rounded-md p-2"
        />
    </div>
);


export const ChangePasswordView = ({ onSave, onCancel }) => {
    const [successMessage, setSuccessMessage] = useState('');

    const handleSave = () => {
        // Add validation logic here
        setSuccessMessage("Password successfully changed. You'll be logged out shortly.");
        // Trigger logout logic after a delay
        setTimeout(() => {
            // onSave(); // This would trigger the actual logout in a real app
            console.log("Logging out...");
        }, 3000);
    };

    const currentUser = {
        username: '§æ¢†%',
        email: '%ad_f*#idca@eatafrican.ch',
        role: 'Super Admin',
    };

    return (
        <div className="p-4 md:p-6">
            <InfoRow label="Logged in as" value={currentUser.username} />
            <InfoRow label="Email" value={currentUser.email} />
            <InfoRow label="Role" value={currentUser.role} />

            <h3 className="font-bold text-green-800 text-[9px] md:text-[15px] mt-6 mb-2">Change Password</h3>
            <InputField label="Current Password" />
            <InputField label="New Password" />
            <InputField label="Confirm Password" />
            
            {successMessage && <p className="text-blue-600 font-bold text-[7px] md:text-[12px] mt-4">{successMessage}</p>}

            {!successMessage && (
                 <div className="flex gap-4 mt-6">
                    <button onClick={handleSave} className="bg-orange-500 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">SAVE</button>
                    <button onClick={onCancel} className="bg-orange-500 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">CANCEL</button>
                </div>
            )}
        </div>
    );
};
