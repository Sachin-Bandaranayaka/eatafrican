// components/ui/Checkbox.tsx
"use client";

import React from 'react';

interface CheckboxProps {
    label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label }) => (
    <div className="flex items-center">
        <input type="checkbox" id={label} className="h-4 w-4 text-amber-600 border-gray-400 rounded focus:ring-amber-500" />
        <label htmlFor={label} className="ml-2 text-sm text-gray-800">{label}</label>
    </div>
);

export default Checkbox;