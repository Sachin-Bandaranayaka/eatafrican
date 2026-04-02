"use client";

import { useState } from "react";
import CollapsibleSection from "@/app/components/CollapsibleSection";

export default function SettingsView() {
    const [settingsSection, setSettingsSection] = useState<string | null>(null);

    return (
        <div className="flex justify-center w-full pt-20">
            <div 
                style={{ backgroundColor: '#E8D7B4' }}
                className="w-full max-w-[768px] min-h-64 shadow-lg flex text-black text-xs opacity-70 mb-4"
            >
                <div className="flex-1 p-6">
                    <p className="text-red-800 text-sm font-bold mb-4">SETTINGS</p>
                    
                    <CollapsibleSection
                        title="Change Password"
                        isOpen={settingsSection === 'password'}
                        onToggle={() => setSettingsSection(settingsSection === 'password' ? null : 'password')}
                        textColor="#000000"
                        iconSpacing="6rem"
                    >
                        <div className="text-black space-y-3">
                            <div>
                                <label className="block text-xs font-bold mb-1">Current Password</label>
                                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1">New Password</label>
                                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1">Confirm New Password</label>
                                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded text-xs" />
                            </div>
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                        title="Deactivate Restaurant Account"
                        isOpen={settingsSection === 'deactivate'}
                        onToggle={() => setSettingsSection(settingsSection === 'deactivate' ? null : 'deactivate')}
                        textColor="#000000"
                        iconSpacing="1.5rem"
                    >
                        <div className="text-black">
                            <p className="mb-2">Deactivate restaurant form will go here</p>
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                        title="Delete Restaurant Account"
                        isOpen={settingsSection === 'delete'}
                        onToggle={() => setSettingsSection(settingsSection === 'delete' ? null : 'delete')}
                        textColor="#000000"
                        iconSpacing="2.9rem"
                    >
                        <div className="text-black">
                            <p className="mb-2">Delete restaurant form will go here</p>
                        </div>
                    </CollapsibleSection>
                </div>
            </div>
        </div>
    );
}
