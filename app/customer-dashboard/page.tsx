"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated, logout } from '@/lib/auth/client';
import CustomerDashboard from '@/components/customer/CustomerDashboard';

export default function CustomerDashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
        
        // Listen for auth changes
        const handleAuthChange = () => checkAuth();
        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, []);

    const checkAuth = () => {
        if (!isAuthenticated()) {
            router.push('/?login=true');
            return;
        }

        const currentUser = getCurrentUser();
        if (!currentUser) {
            router.push('/?login=true');
            return;
        }

        // Only customers can access this dashboard
        if (currentUser.role !== 'customer') {
            router.push('/');
            return;
        }

        setUser(currentUser);
        setLoading(false);
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
            <CustomerDashboard user={user} onLogout={handleLogout} />
        </div>
    );
}
