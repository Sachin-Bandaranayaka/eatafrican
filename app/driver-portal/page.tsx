"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DriverPortalAuth from '@/components/driverPortalAuth';
import DriverPortal from '@/components/driverPortal';

export default function DriverPortalPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        try {
            const token = localStorage.getItem('accessToken');
            const userStr = localStorage.getItem('user');

            if (!token || !userStr) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            const user = JSON.parse(userStr);
            
            if (user.role !== 'driver') {
                alert('Access denied. Drivers only.');
                router.push('/');
                return;
            }

            setIsAuthenticated(true);
            setLoading(false);
        } catch (error) {
            console.error('Auth check error:', error);
            setIsAuthenticated(false);
            setLoading(false);
        }
    };

    const handleLoginSuccess = () => {
        checkAuth();
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
                <DriverPortalAuth onLoginSuccess={handleLoginSuccess} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
            <DriverPortal onClose={handleLogout} />
        </div>
    );
}
