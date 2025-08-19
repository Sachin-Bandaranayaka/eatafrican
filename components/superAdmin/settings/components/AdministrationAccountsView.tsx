// src/app/super-admin/settings/components/AdministrationAccountsView.tsx
"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { userAccountsData } from './data';

export const AdministrationAccountsView = () => {
    const [filter, setFilter] = useState('SUPER ADMIN');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const accountTypes = ['SUPER ADMIN', 'STAFF'];

    const filteredAccounts = userAccountsData.filter(acc => acc.role === filter);

    return (
        <>
            {/* The header with title and button is now in the parent controller */}
            
            {/* --- UPDATED TOGGLE TO DROPDOWN --- */}
            <div className="relative inline-block mb-4">
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                    className="flex items-center justify-between w-48 bg-orange-500 text-white font-bold py-1 px-3 rounded-lg text-[7px] md:text-[12px]"
                >
                    {filter}
                    <ChevronDown size={16} />
                </button>
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg border z-10">
                        {accountTypes.filter(r => r !== filter).map(r => (
                            <button 
                                key={r} 
                                onClick={() => { setFilter(r); setIsDropdownOpen(false); }} 
                                className="block w-full text-left px-3 py-2 text-black font-bold hover:bg-gray-100 text-[7px] md:text-[12px]"
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#FFE59E]">
                            <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">ACCOUNT</th>
                            <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">PERMISSIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAccounts.map(acc => (
                             <tr key={acc.id}>
                                <td className="p-2 text-black font-semibold text-[7px] md:text-[12px]">{acc.account}</td>
                                <td className="p-2 text-black font-semibold text-[7px] md:text-[12px]">{acc.permissions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};
