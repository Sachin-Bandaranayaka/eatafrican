"use client";

import React, { useState, useEffect } from 'react';

export const OrdersManagementConnected = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            
            const url = statusFilter === 'all' 
                ? '/api/admin/orders'
                : `/api/admin/orders?status=${statusFilter}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data.data || data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: any = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-blue-100 text-blue-800',
            'preparing': 'bg-purple-100 text-purple-800',
            'ready_for_pickup': 'bg-indigo-100 text-indigo-800',
            'picked_up': 'bg-cyan-100 text-cyan-800',
            'out_for_delivery': 'bg-orange-100 text-orange-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="bg-white/90 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900 bg-white"
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready_for_pickup">Ready for Pickup</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Order ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Restaurant</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Total</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">#{order.id.slice(0, 8)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {order.customer?.first_name} {order.customer?.last_name}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{order.restaurant?.name || 'N/A'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">CHF {order.total_amount}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status.replace(/_/g, ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
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

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Order Information</h4>
                                    <p><span className="font-semibold">Order ID:</span> {selectedOrder.id}</p>
                                    <p><span className="font-semibold">Status:</span> {selectedOrder.status}</p>
                                    <p><span className="font-semibold">Created:</span> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Customer</h4>
                                    <p>{selectedOrder.customer?.first_name} {selectedOrder.customer?.last_name}</p>
                                    <p>{selectedOrder.customer?.email}</p>
                                    <p>{selectedOrder.customer?.phone}</p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Delivery Address</h4>
                                    <p>{selectedOrder.delivery_address}</p>
                                    <p>{selectedOrder.delivery_city}, {selectedOrder.delivery_postal_code}</p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Order Items</h4>
                                    {selectedOrder.items?.map((item: any, index: number) => (
                                        <div key={index} className="flex justify-between py-2 border-b">
                                            <span>{item.quantity}x {item.menu_item?.name || 'Item'}</span>
                                            <span>CHF {item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total:</span>
                                        <span>CHF {selectedOrder.total_amount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-4">
                                <button
                                    onClick={() => setSelectedOrder(null)}
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
