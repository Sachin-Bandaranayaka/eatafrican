// src/app/super-admin/restaurant/components/settings/GenericSettingsView.tsx
"use client";

import React, { useState } from 'react';
import { Edit2, X } from 'lucide-react';

export const GenericSettingsView = ({ title, initialItems }) => {
    // --- STATE MANAGEMENT IS NOW INSIDE THIS COMPONENT ---
    const [items, setItems] = useState(initialItems);
    const [modal, setModal] = useState(null); // Can be 'add', 'edit', 'delete', or null
    const [currentItem, setCurrentItem] = useState(null); // For editing/deleting
    const [inputValue, setInputValue] = useState(''); // For the input fields in modals

    // --- HANDLER FUNCTIONS ARE NOW INSIDE THIS COMPONENT ---
    const handleSave = () => {
        if (!inputValue || inputValue.trim() === '') {
            handleCancel();
            return;
        }

        if (modal === 'add') {
            setItems(prev => [...prev, inputValue].sort());
        } else if (modal === 'edit') {
            setItems(prev => prev.map(i => (i === currentItem ? inputValue : i)).sort());
        }
        handleCancel();
    };

    const handleDelete = () => {
        setItems(prev => prev.filter(i => i !== currentItem));
        handleCancel();
    };

    const handleCancel = () => {
        setModal(null);
        setCurrentItem(null);
        setInputValue('');
    };

    const openModal = (type, item = null) => {
        setModal(type);
        if (item) {
            setCurrentItem(item);
            setInputValue(item); // Pre-fill input for editing
        }
    };

    // --- MODAL JSX IS NOW HARDCODED HERE ---
    const renderModal = () => {
        if (modal === 'add' || modal === 'edit') {
            const isEdit = modal === 'edit';
            return (
                <div className="inset-0 flex justify-start items-center z-50">
                    <div className="bg-[#F0BE41] rounded-lg p-6 w-11/12 md:w-1/3 max-w-lg shadow-lg">
                        <h3 className="font-bold text-black mb-4 text-[9px] md:text-[15px]">{isEdit ? 'EDIT' : 'ADD'} {title.toUpperCase()}</h3>
                        <div className="space-y-2">
                            <label className="text-black font-bold text-[7px] md:text-[12px]">Name of {title}</label>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full border border-gray-400 rounded-md p-2"
                            />
                        </div>
                        <div className="flex justify-start gap-4 mt-6">
                            <button onClick={handleSave} className="bg-red-900 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">SAVE</button>
                            <button onClick={handleCancel} className="bg-red-900 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">CANCEL</button>
                        </div>
                    </div>
                </div>
            );
        }

        if (modal === 'delete') {
            return (
                <div className="inset-0 flex justify-start items-center z-50">
                    <div className="bg-red-200 rounded-lg p-6 w-11/12 md:w-1/3 max-w-lg shadow-lg">
                        <h3 className="font-bold text-black mb-4 text-[9px] md:text-[15px]">DELETE {title.toUpperCase()}</h3>
                        <p className="text-black text-[7px] md:text-[12px] mb-6">Are you sure you want to delete {currentItem}?</p>
                        <div className="flex justify-start gap-4">
                            <button onClick={handleDelete} className="bg-red-800 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">DELETE</button>
                            <button onClick={handleCancel} className="bg-red-800 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">CANCEL</button>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-3">
            {/* Render the modal if it's active */}
            {renderModal()}

            {/* The main content is only visible when no modal is open */}
            {modal === null && (
                <>
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border-b md:w-1/2">
                            <p className="font-bold text-black text-[9px] md:text-[15px]">{item}</p>
                            <div className="flex items-center gap-4">
                                <button onClick={() => openModal('edit', item)} title="Edit">
                                    <Edit2 className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                                </button>
                                <button onClick={() => openModal('delete', item)} title="Delete">
                                    <X className="w-5 h-5 text-gray-600 hover:text-red-600" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="mt-8 mb-4">
                        <button onClick={() => openModal('add')} className="bg-red-900 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">
                            ADD {title.toUpperCase()}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
