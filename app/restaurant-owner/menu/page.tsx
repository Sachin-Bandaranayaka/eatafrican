"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MenuViewConnected from '@/components/admin/dashboard/components/views/MenuView-connected';

function MainDishesContent() {
    const searchParams = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');
    const [activeTab, setActiveTab] = useState('Main Dishes');

    if (!restaurantId) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-600">No restaurant selected. Please select a restaurant from the dashboard.</p>
            </div>
        );
    }

    return (
        <MenuViewConnected 
            restaurantId={restaurantId} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
        />
    );
}

export default function MainDishesPage() {
    return (
        <div className="min-h-screen">
            <Suspense fallback={
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-600">Loading...</p>
                </div>
            }>
                <MainDishesContent />
            </Suspense>
        </div>
    );
}
