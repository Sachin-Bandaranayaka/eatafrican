// src/app/super-admin/settings/components/CreateAccountView.tsx
"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { locationsToManage, permissionsToManage } from './data';

export const CreateAccountView = ({ onSave, onCancel }) => {
    const [role, setRole] = useState('STAFF');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [errors, setErrors] = useState({ locations: '', permissions: '' });
    const [formData, setFormData] = useState({
        username: 'staff3',
        password: '',
        locations: [],
        permissions: []
    });

    const handleCheckboxChange = (field, value) => {
        setFormData(prev => {
            const currentValues = prev[field];
            if (currentValues.includes(value)) {
                return { ...prev, [field]: currentValues.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...currentValues, value] };
            }
        });
    };

    const validateAndSave = () => {
        const newErrors = { locations: '', permissions: '' };
        let isValid = true;

        if (formData.locations.length === 0) {
            newErrors.locations = 'Please select at least 1 location';
            isValid = false;
        }
        if (formData.permissions.length === 0) {
            newErrors.permissions = 'Please select at least 1 permission';
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            console.log("Saving new account:", formData);
            onSave(); // Navigate back
        }
    };

    return (
        <div className="p-4 md:p-6">
            <h2 className="font-bold text-black text-[9px] md:text-[15px] mb-2">User Accounts</h2>
            <div className="relative inline-block mb-6">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-between w-40 bg-orange-500 text-white font-bold py-1 px-3 rounded-lg text-[7px] md:text-[12px]">
                    {role} <ChevronDown size={16} />
                </button>
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg border z-10">
                        {['SUPER ADMIN', 'STAFF'].filter(r => r !== role).map(r => (
                            <button key={r} onClick={() => { setRole(r); setIsDropdownOpen(false); }} className="block w-full text-left px-3 py-2 text-black font-bold hover:bg-gray-100 text-[7px] md:text-[12px]">{r}</button>
                        ))}
                    </div>
                )}
            </div>

            <h3 className="font-bold text-black text-[9px] md:text-[15px] mb-2">Create New User Account</h3>
            <div className="space-y-3 mb-6">
                <div>
                    <label className="block font-bold text-black text-[7px] md:text-[12px] mb-1">Username</label>
                    <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full md:w-1/2 bg-white border border-gray-400 rounded-md p-2" />
                </div>
                 <div>
                    <label className="block font-bold text-black text-[7px] md:text-[12px] mb-1">Password</label>
                    <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full md:w-1/2 bg-white border border-gray-400 rounded-md p-2" />
                </div>
            </div>

            <div className="mb-4">
                <h3 className="font-bold text-black text-[9px] md:text-[15px] mb-2">Location to Manage</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {locationsToManage.map(loc => (
                        <label key={loc} className="flex items-center gap-2">
                            <input type="checkbox" onChange={() => handleCheckboxChange('locations', loc)} className="form-checkbox h-4 w-4 text-orange-500" />
                            <span className="text-black font-semibold text-[7px] md:text-[12px]">{loc}</span>
                        </label>
                    ))}
                </div>
                {errors.locations && <p className="text-red-600 text-[7px] md:text-[12px] mt-2">{errors.locations}</p>}
            </div>

             <div className="mb-6">
                <h3 className="font-bold text-black text-[9px] md:text-[15px] mb-2">Sections to Manage</h3>
                <div className="space-y-2">
                    {permissionsToManage.map(perm => (
                        <label key={perm} className="flex items-center gap-2">
                            <input type="checkbox" onChange={() => handleCheckboxChange('permissions', perm)} className="form-checkbox h-4 w-4 text-orange-500" />
                            <span className="text-black font-semibold text-[7px] md:text-[12px]">{perm}</span>
                        </label>
                    ))}
                </div>
                 {errors.permissions && <p className="text-red-600 text-[7px] md:text-[12px] mt-2">{errors.permissions}</p>}
            </div>
            
            <div className="flex gap-4">
                <button onClick={validateAndSave} className="bg-orange-500 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">SAVE</button>
                <button onClick={onCancel} className="bg-orange-500 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">CANCEL</button>
            </div>
        </div>
    );
};
