// src/app/super-admin/customer-accounts/page.tsx
"use client";

import React, { useState } from 'react';
import { allCustomerData, Customer, Order } from './components/data';
import { AllCustomersView } from './components/AllCustomersView';
import { CustomerDetailsView } from './components/CustomerDetailsView';
import { OrderInfoView } from './components/OrderInfoView';

const CustomerManagementController = () => {
    const [view, setView] = useState('all_customers');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailsInitialTab, setDetailsInitialTab] = useState<'PERSONAL INFO' | 'ORDERS'>('PERSONAL INFO');

    const handleSelectCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setDetailsInitialTab('PERSONAL INFO');
        setView('customer_details');
    };

    const handleSelectOrder = (order: Order) => {
        setSelectedOrder(order);
        setView('order_details');
    };
    
    const handleBackToAllCustomers = () => {
        setSelectedCustomer(null);
        setSelectedOrder(null);
        setView('all_customers');
    };

    const handleBackToDetailsView = (tab: 'PERSONAL INFO' | 'ORDERS') => {
        setSelectedOrder(null);
        setDetailsInitialTab(tab);
        setView('customer_details');
    };

    switch (view) {
        case 'order_details':
            return <OrderInfoView 
                        customer={selectedCustomer} 
                        order={selectedOrder} 
                        onBackToOrders={() => handleBackToDetailsView('ORDERS')} 
                        onBackToOverview={() => handleBackToDetailsView('PERSONAL INFO')} 
                    />;
        case 'customer_details':
            return <CustomerDetailsView 
                        customer={selectedCustomer} 
                        onSelectOrder={handleSelectOrder} 
                        onBackToAll={handleBackToAllCustomers}
                        initialTab={detailsInitialTab}
                    />;
        case 'all_customers':
        default:
            return <AllCustomersView customers={allCustomerData} onSelectCustomer={handleSelectCustomer} />;
    }
};

export const SuperAdminCustomerAccount = () => {
    return (
        <div className="w-full md:w-5/6 max-w-7xl mx-auto md:px-6 bg-transparent">
            <CustomerManagementController />
        </div>
    );
};
