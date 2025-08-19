// src/app/super-admin/delivery-backend/components/RadiusCard.tsx
"use client";

import React from 'react';
import { Edit2, PlusCircle, Trash2 } from 'lucide-react';

const DetailItem = ({ label, value }) => (
    <li className="flex items-center">
        <span className="font-bold text-black text-[9px] md:text-[15px] w-36">{label}:</span>
        <span className="text-gray-800 font-semibold text-[7px] md:text-[12px]">{value}</span>
        <button className="ml-2 text-gray-600 hover:text-blue-600">
            <Edit2 size={12} />
        </button>
    </li>
);

const ScheduleSlot = ({ time }) => (
    <li className="flex items-center">
        <span className="text-gray-800 font-semibold text-[7px] md:text-[12px]">{time}</span>
        <div className="flex items-center ml-2 gap-1">
            <button className="text-gray-600 hover:text-blue-600">
                <Edit2 size={12} />
            </button>
            <button className="text-red-600 hover:text-red-800">
                 <Trash2 size={12} />
            </button>
        </div>
    </li>
);

export const RadiusCard = ({ data }) => {
    return (
        <div className="bg-transperant">
            <h2 className="font-bold text-black text-[9px] md:text-[15px] mb-3">
                {data.radius} km Radius from Restaurant's Location
            </h2>
            
            <ul className="space-y-1">
                {Object.entries(data.details).map(([key, value]) => (
                    <DetailItem key={key} label={key} value={value} />
                ))}
            </ul>

            <div className="mt-4">
                <h3 className="font-bold text-black text-[9px] md:text-[15px]">Delivery Schedule</h3>
                <div className="flex items-center">
                    <p className="text-gray-800 font-semibold text-[7px] md:text-[12px]">{data.schedule.days}</p>
                    <button className="ml-2 text-gray-600 hover:text-blue-600">
                        <Edit2 size={12} />
                    </button>
                </div>

                <ul className="mt-1 space-y-1">
                    {data.schedule.slots.map((slot, index) => (
                        <ScheduleSlot key={index} time={slot} />
                    ))}
                </ul>
                <button className="flex items-center gap-1 mt-2 text-green-700 hover:text-green-900">
                    <PlusCircle size={14} />
                    <span className="font-bold text-[7px] md:text-[12px]">Add Slot</span>
                </button>
            </div>
        </div>
    );
};
