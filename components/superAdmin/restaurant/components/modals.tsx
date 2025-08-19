// src/app/super-admin/restaurant/components/modals.tsx
"use client";

import React, { useState } from 'react';

export const AddItemModal = ({ itemName, onSave, onCancel }) => {
    const [name, setName] = useState('');
    return (
        <div className="fixed inset-0 flex justify-start items-start z-50 mt-[10%] ml-[27%] ">
            <div className="bg-[#F0BE41] rounded-lg p-6 w-11/12 md:w-1/3 max-w-lg shadow-lg">
                <h3 className="font-bold text-black mb-4 text-[9px] md:text-[15px]">ADD {itemName.toUpperCase()}</h3>
                <div className="space-y-2">
                    <label className="text-black font-bold text-[7px] md:text-[12px]">Name of {itemName}</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-400 rounded-md p-2" />
                </div>
                <div className="flex justify-start gap-4 mt-6">
                    <button onClick={() => onSave(name)} className="bg-red-900 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">SAVE</button>
                    <button onClick={onCancel} className="bg-red-900 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">CANCEL</button>
                </div>
            </div>
        </div>
    );
};

export const EditItemModal = ({ itemName, itemValue, onSave, onCancel }) => {
    const [name, setName] = useState(itemValue);
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-[#F0BE41] rounded-lg p-6 w-11/12 md:w-1/3 max-w-lg shadow-lg">
                <h3 className="font-bold text-black mb-4 text-[9px] md:text-[15px]">EDIT {itemName.toUpperCase()}</h3>
                <div className="space-y-2">
                    <label className="text-black font-bold text-[7px] md:text-[12px]">Name of {itemName}</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-400 rounded-md p-2" />
                </div>
                <div className="flex justify-start gap-4 mt-6">
                    <button onClick={() => onSave(itemValue, name)} className="bg-red-900 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">SAVE</button>
                    <button onClick={onCancel} className="bg-red-900 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">CANCEL</button>
                </div>
            </div>
        </div>
    );
};

export const DeleteItemModal = ({ itemName, itemValue, onDelete, onCancel }) => {
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-red-200 border-2 border-red-500 rounded-lg p-6 w-11/12 md:w-1/3 max-w-lg shadow-lg">
                <h3 className="font-bold text-black mb-4 text-[9px] md:text-[15px]">DELETE {itemName.toUpperCase()}</h3>
                <p className="text-black text-[7px] md:text-[12px] mb-6">Are you sure you want to delete {itemValue}?</p>
                <div className="flex justify-start gap-4">
                    <button onClick={() => onDelete(itemValue)} className="bg-red-800 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">DELETE</button>
                    <button onClick={onCancel} className="bg-red-800 text-white font-bold py-1 px-6 rounded-lg text-[7px] md:text-[12px]">CANCEL</button>
                </div>
            </div>
        </div>
    );
};