"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SuperAdminLogin from '@/components/superAdmin/auth/login';
import SuperAdminHeader from '@/components/superAdmin/header';
import { SuperAdminDashboardConnected } from '@/components/superAdmin/dashboard-connected';
import { OrdersManagementConnected } from '@/components/superAdmin/orders/OrdersManagement-connected';
import { EarningsManagementConnected } from '@/components/superAdmin/earnings/EarningsManagement-connected';
import { DriversManagementConnected } from '@/components/superAdmin/delivery-drivers/DriversManagement-connected';
import { CustomersManagementConnected } from '@/components/superAdmin/customer-accounts/CustomersManagement-connected';
import { SuperAdminRestaurant } from '@/components/superAdmin/restaurant';
import { SuperAdminSettings } from '@/components/superAdmin/settings/page';
import { SuperAdminDeliveryBackend } from '@/components/superAdmin/delivery-backend/page';

export default function AdminPortalPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [superAdminView, setSuperAdminView] = useState('DASHBOARD');

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
            
            if (user.role !== 'super_admin') {
                alert('Access denied. Super admin credentials required.');
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

    const renderSuperAdminComponent = () => {
        const ErrorDisplay = ({ name }: { name: string }) => (
            <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="font-bold">Component Loading Error</p>
                <p>The component <code className="bg-red-200 p-1 rounded">{name}</code> is undefined.</p>
                <p>Please ensure you have <code className="bg-red-200 p-1 rounded">export const {name} = ...</code> in your component file.</p>
            </div>
        );

        switch (superAdminView) {
            case 'DASHBOARD':
                return SuperAdminDashboardConnected ? <SuperAdminDashboardConnected /> : <ErrorDisplay name="SuperAdminDashboardConnected" />;
            case 'ORDERS':
                return OrdersManagementConnected ? <OrdersManagementConnected /> : <ErrorDisplay name="OrdersManagementConnected" />;
            case 'EARNINGS':
                return EarningsManagementConnected ? <EarningsManagementConnected /> : <ErrorDisplay name="EarningsManagementConnected" />;
            case 'PAYOUTS':
                return EarningsManagementConnected ? <EarningsManagementConnected /> : <ErrorDisplay name="EarningsManagementConnected" />;
            case 'RESTAURANT':
                return SuperAdminRestaurant ? <SuperAdminRestaurant /> : <ErrorDisplay name="SuperAdminRestaurant" />;
            case 'DELIVERY BACKEND':
                return SuperAdminDeliveryBackend ? <SuperAdminDeliveryBackend /> : <ErrorDisplay name="SuperAdminDeliveryBackend" />;
            case 'DELIVERY DRIVERS':
                return DriversManagementConnected ? <DriversManagementConnected /> : <ErrorDisplay name="DriversManagementConnected" />;
            case 'CUSTOMER ACCOUNT':
                return CustomersManagementConnected ? <CustomersManagementConnected /> : <ErrorDisplay name="CustomersManagementConnected" />;
            case 'SETTINGS':
                return SuperAdminSettings ? <SuperAdminSettings /> : <ErrorDisplay name="SuperAdminSettings" />;
            default:
                return SuperAdminDashboardConnected ? <SuperAdminDashboardConnected /> : <ErrorDisplay name="SuperAdminDashboardConnected" />;
        }
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
                <SuperAdminLogin onLoginSuccess={handleLoginSuccess} />
            </div>
        );
    }

    return (
        <main className="relative w-full min-h-screen">
            <SuperAdminHeader 
                currentView={superAdminView} 
                onViewChange={setSuperAdminView} 
            />
            <div className="mt-4 px-4">
                {renderSuperAdminComponent()}
            </div>
        </main>
    );
}
