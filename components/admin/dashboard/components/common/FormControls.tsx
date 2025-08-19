"use client";

interface FormInputProps {
    label: string;
    type?: string;
    placeholder?: string;
}

// A reusable input component for the form
export const FormInput = ({ label, type = "text", placeholder = "" }: FormInputProps) => (
    <div className="mb-1">
        <label className="block text-[13px] font-bold text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className="w-full bg-white text-[13px] text-black px-3 py-1 rounded-md border border-black shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-black"
        />
    </div>
);

interface FormSelectProps {
    label: string;
    options: string[];
}

// A reusable select/dropdown component for the form
export const FormSelect = ({ label, options }: FormSelectProps) => (
    <div className="relative">
        <label className="block text-sm font-bold text-black mb-1">{label}</label>
        <select className="w-full bg-white text-sm text-black px-3 py-1 rounded-sm ring-1 ring-black">
            {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
    </div>
);

export const ChangeButton = () => (
    <button className="bg-orange-400 text-[13px] text-black font-bold py-1 px-5 rounded-md hover:bg-orange-500 transition-colors">
        CHANGE
    </button>
);