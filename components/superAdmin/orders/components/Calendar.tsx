// src/app/super-admin/orders/components/Calendar.tsx
"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export const CalendarPopup = ({ onApply, onCancel }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2017, 7, 1));
    const [startDate, setStartDate] = useState(new Date(2017, 7, 20));
    const [endDate, setEndDate] = useState(new Date(2017, 7, 20));

    const handleDateClick = (date) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else if (date < startDate) {
            setStartDate(date);
        } else {
            setEndDate(date);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'DD/MM/YYYY';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleApply = () => {
        onApply({
            start: formatDate(startDate),
            end: formatDate(endDate || startDate)
        });
    };

    const renderCalendar = (dateToRender) => {
        const year = dateToRender.getFullYear();
        const month = dateToRender.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-start-${i}`} />);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const fullDate = new Date(year, month, i);
            let classes = "w-1/2 md:w-full py-1 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]";
            const isSelected = (startDate && fullDate.getTime() === startDate.getTime()) || (endDate && fullDate.getTime() === endDate.getTime());
            const isInRange = startDate && endDate && fullDate > startDate && fullDate < endDate;
            if (isSelected) classes += " bg-green-600 text-white";
            else if (isInRange) classes += " bg-green-200";
            days.push(<div key={i} className={classes} onClick={() => handleDateClick(fullDate)}>{i}</div>);
        }
        return days;
    };

    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    return (
        <div className="absolute top-0 right-0 mt-0 w-[300px] md:w-[400px] bg-white shadow-2xl p-2 md:p-4 z-20 border border-gray-200">
            <div className="flex justify-center gap-4 mb-4">
                <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-1.5 w-48">
                    <CalendarIcon size={16} className="text-black mr-2" />
                    <span className="text-gray-700 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{formatDate(startDate)}</span>
                </div>
                <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-1.5 w-48">
                    <CalendarIcon size={16} className="text-black mr-2" />
                    <span className="text-gray-700 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{formatDate(endDate)}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="hover:bg-gray-100 rounded-full p-1"><ChevronLeft size={18} /></button>
                        <span className="font-bold text-black text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">{currentMonth.toLocaleString('en-US', { month: 'short' }).toUpperCase()} {currentMonth.getFullYear()}</span>
                        <span className="w-6"></span>
                    </div>
                    <div className="grid grid-cols-7 text-center font-bold text-black mb-2 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">
                        {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => <div key={day}>{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1 text-center text-black text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{renderCalendar(currentMonth)}</div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="w-6"></span>
                        <span className="font-bold text-black text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">{nextMonth.toLocaleString('en-US', { month: 'short' }).toUpperCase()} {nextMonth.getFullYear()}</span>
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="hover:bg-gray-100 rounded-full p-1"><ChevronRight size={18} /></button>
                    </div>
                    <div className="grid grid-cols-7 text-center font-bold text-black mb-2 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">
                        {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => <div key={day}>{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1 text-center text-black text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{renderCalendar(nextMonth)}</div>
                </div>
            </div>
            <div className="flex justify-between gap-4 mt-4">
                <button onClick={handleApply} className="bg-green-600 text-white font-bold py-1 px-6 rounded-md hover:bg-green-700 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">Apply</button>
                <button onClick={onCancel} className="bg-red-600 text-white font-bold py-1 px-6 rounded-md hover:bg-red-700 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">Cancel</button>
            </div>
        </div>
    );
};
