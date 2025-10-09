// components/ui/FormSelect.tsx
"use client";

import React from 'react';

interface FormSelectProps {
    label: string;
    name?: string;
    options: string[];
    fullWidth?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({ label, name, options, fullWidth = false }) => (
    <div className={`mb-3 ${fullWidth ? 'w-full' : 'w-auto'}`}>
        <label className="block text-xs font-bold text-gray-800 mb-1">{label}</label>
        <div className="relative">
            <select 
                name={name}
                className="w-full bg-white text-sm text-black px-3 py-2 rounded-sm border border-gray-400 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
        </div>
    </div>
);

export default FormSelect;