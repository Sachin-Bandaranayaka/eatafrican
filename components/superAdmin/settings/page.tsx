// src/app/super-admin/settings/page.tsx
"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrentLoginView } from './components/CurrentLoginView';
import { AdministrationAccountsView } from './components/AdministrationAccountsView';
import { CreateAccountView } from './components/CreateAccountView';
import { ChangePasswordView } from './components/ChangePasswordView';

const SettingsController = () => {
    const [mainView, setMainView] = useState('CURRENT LOGIN');
    const [subView, setSubView] = useState('main');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const mainViewOptions = ['CURRENT LOGIN', 'ADMINISTRATION ACCOUNTS'];

    const renderContent = () => {
        // Views that take up the whole panel are rendered first
        if (subView === 'change_password') {
            return <ChangePasswordView onSave={() => setSubView('main')} onCancel={() => setSubView('main')} />;
        }
        if (subView === 'create_account') {
            return <CreateAccountView onSave={() => setSubView('main')} onCancel={() => setSubView('main')} />;
        }

        // Determine the title and content for the main views
        let content;
        let title = '';
        if (mainView === 'ADMINISTRATION ACCOUNTS') {
            title = 'User Accounts';
            content = <AdministrationAccountsView />;
        } else {
            // Default is CurrentLoginView, which doesn't have a title
            content = <CurrentLoginView />;
        }

        // Return the main content wrapped in a consistent header
        return (
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-black text-[9px] md:text-[15px]">{title}</h2>
                    {mainView === 'CURRENT LOGIN' && subView !== 'change_password' && (
                        <button onClick={() => setSubView('change_password')} className="bg-orange-500 text-white font-bold py-1 px-4 rounded-lg text-[7px] md:text-[12px]">
                            CHANGE PASSWORD
                        </button>
                    )}
                    {mainView === 'ADMINISTRATION ACCOUNTS' && subView !== 'change_password' && (
                        <button
                            onClick={() => setSubView('create_account')}
                            className="bg-orange-500 text-white font-bold py-1 px-4 rounded-lg text-[7px] md:text-[12px]"
                        >
                            CREATE ACCOUNT
                        </button>
                    )}
                </div>
                {content}
            </div>
        );
    };

    return (
        <div className="w-full md:w-5/6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between w-60 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-[7px] md:text-[12px]"
                    >
                        {mainView}
                        <ChevronDown size={16} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 w-full bg-blue-600 rounded-lg shadow-lg border z-10">
                            {mainViewOptions.filter(opt => opt !== mainView).map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => { setMainView(opt); setSubView('main'); setIsDropdownOpen(false); }}
                                    className="block w-full text-left px-4 py-2 text-black font-bold hover:bg-gray-100 text-[7px] md:text-[12px]"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg min-h-[550px]">
                {renderContent()}
            </div>
        </div>
    );
};

export const SuperAdminSettings = () => {
    return (
        <div className="w-full bg-transparent p-2 md:p-6">
            <SettingsController />
        </div>
    );
};
