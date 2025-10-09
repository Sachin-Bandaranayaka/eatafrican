"use client";

import React, { useState, useEffect } from 'react';

export const CustomersManagementConnected = () => {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            
            const response = await fetch('/api/admin/customers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setCustomers(data.data || data.customers || []);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer =>
        customer.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading customers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="bg-white/90 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Customer Accounts</h2>
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900 bg-white w-64"
                    />
                </div>

                <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Customers</p>
                        <p className="text-2xl font-bold text-blue-600">{customers.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Active</p>
                        <p className="text-2xl font-bold text-green-600">
                            {customers.filter(c => c.status === 'active').length}
                        </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Inactive</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {customers.filter(c => c.status === 'inactive').length}
                        </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {customers.reduce((sum, c) => sum + (c.total_orders || 0), 0)}
                        </p>
                    </div>
                </div>

                {filteredCustomers.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No customers found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Phone</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Orders</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Loyalty Points</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {customer.first_name} {customer.last_name}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{customer.email}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{customer.phone || 'N/A'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{customer.total_orders || 0}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{customer.loyalty_points || 0}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {customer.status?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelectedCustomer(customer)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Customer Details Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Customer Details</h3>
                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Personal Information</h4>
                                    <p><span className="font-semibold">Name:</span> {selectedCustomer.first_name} {selectedCustomer.last_name}</p>
                                    <p><span className="font-semibold">Email:</span> {selectedCustomer.email}</p>
                                    <p><span className="font-semibold">Phone:</span> {selectedCustomer.phone || 'N/A'}</p>
                                    <p><span className="font-semibold">Status:</span> {selectedCustomer.status}</p>
                                    <p><span className="font-semibold">Joined:</span> {new Date(selectedCustomer.created_at).toLocaleDateString()}</p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Order Statistics</h4>
                                    <p><span className="font-semibold">Total Orders:</span> {selectedCustomer.total_orders || 0}</p>
                                    <p><span className="font-semibold">Total Spent:</span> CHF {selectedCustomer.total_spent || 0}</p>
                                    <p><span className="font-semibold">Average Order:</span> CHF {selectedCustomer.average_order || 0}</p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Loyalty Program</h4>
                                    <p><span className="font-semibold">Points Balance:</span> {selectedCustomer.loyalty_points || 0}</p>
                                    <p><span className="font-semibold">Lifetime Points:</span> {selectedCustomer.lifetime_points || 0}</p>
                                    <p><span className="font-semibold">Referral Code:</span> {selectedCustomer.referral_code || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-4">
                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
