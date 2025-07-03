// components/ui/FormInput.tsx
"use client";

import React from 'react';

// Define the types for the component's props
interface FormInputProps {
    label: string;
    placeholder: string;
    type?: string;
    fullWidth?: boolean;
    required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ label, placeholder, type = "text", fullWidth = false, required = false }) => (
    <div className={`mb-3 ${fullWidth ? 'w-full' : 'w-auto'}`}>
        <label className="block text-xs font-bold text-gray-800 mb-1">
            {label}{required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            placeholder={placeholder}
            className="w-full bg-white text-sm text-black px-3 py-1 rounded-sm border border-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
    </div>
);

export default FormInput;