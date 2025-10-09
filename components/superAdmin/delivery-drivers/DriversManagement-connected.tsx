"use client";

import React, { useState, useEffect } from 'react';

export const DriversManagementConnected = () => {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedDriver, setSelectedDriver] = useState<any>(null);

    useEffect(() => {
        fetchDrivers();
    }, [statusFilter]);

    const fetchDrivers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            
            const url = statusFilter === 'all' 
                ? '/api/admin/drivers'
                : `/api/admin/drivers?status=${statusFilter}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setDrivers(data.data || data.drivers || []);
            }
        } catch (error) {
            console.error('Error fetching drivers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (driverId: string) => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            
            const response = await fetch(`/api/admin/drivers/${driverId}/approve`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'active' })
            });

            if (response.ok) {
                alert('Driver approved successfully!');
                fetchDrivers();
            }
        } catch (error) {
            console.error('Error approving driver:', error);
            alert('Failed to approve driver');
        }
    };

    const handleReject = async (driverId: string) => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            
            const response = await fetch(`/api/admin/drivers/${driverId}/approve`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'suspended' })
            });

            if (response.ok) {
                alert('Driver rejected successfully!');
                fetchDrivers();
            }
        } catch (error) {
            console.error('Error rejecting driver:', error);
            alert('Failed to reject driver');
        }
    };

    const getStatusColor = (status: string) => {
        const colors: any = {
            'active': 'bg-green-100 text-green-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'inactive': 'bg-gray-100 text-gray-800',
            'suspended': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading drivers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="bg-white/90 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Driver Management</h2>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900 bg-white"
                    >
                        <option value="all">All Drivers</option>
                        <option value="pending">Pending Approval</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>

                {drivers.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No drivers found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Phone</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Pickup Zone</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {drivers.map((driver) => (
                                    <tr key={driver.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {driver.user?.first_name} {driver.user?.last_name}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{driver.user?.email}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{driver.user?.phone}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{driver.pickup_zone || 'N/A'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(driver.status)}`}>
                                                {driver.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                {driver.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(driver.id)}
                                                            className="text-green-600 hover:text-green-800 text-sm font-semibold"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(driver.id)}
                                                            className="text-red-600 hover:text-red-800 text-sm font-semibold"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => setSelectedDriver(driver)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Driver Details Modal */}
            {selectedDriver && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Driver Details</h3>
                                <button
                                    onClick={() => setSelectedDriver(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Personal Information</h4>
                                    <p><span className="font-semibold">Name:</span> {selectedDriver.user?.first_name} {selectedDriver.user?.last_name}</p>
                                    <p><span className="font-semibold">Email:</span> {selectedDriver.user?.email}</p>
                                    <p><span className="font-semibold">Phone:</span> {selectedDriver.user?.phone}</p>
                                    <p><span className="font-semibold">Status:</span> {selectedDriver.status}</p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Work Information</h4>
                                    <p><span className="font-semibold">Pickup Zone:</span> {selectedDriver.pickup_zone || 'Not set'}</p>
                                    <p><span className="font-semibold">Vehicle Type:</span> {selectedDriver.vehicle_type || 'N/A'}</p>
                                    <p><span className="font-semibold">License Plate:</span> {selectedDriver.vehicle_plate || 'N/A'}</p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Statistics</h4>
                                    <p><span className="font-semibold">Total Deliveries:</span> {selectedDriver.total_deliveries || 0}</p>
                                    <p><span className="font-semibold">Rating:</span> {selectedDriver.rating || 0} ⭐</p>
                                    <p><span className="font-semibold">Joined:</span> {new Date(selectedDriver.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-4">
                                <button
                                    onClick={() => setSelectedDriver(null)}
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
