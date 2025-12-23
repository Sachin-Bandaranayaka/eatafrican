"use client";

import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronDown, ChevronUp, Star } from 'lucide-react';
import ReviewModal from './ReviewModal';

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
    totalAmount: number;
    deliveryFee: number;
    subtotal: number;
    restaurant: {
        id: string;
        name: string;
        logoUrl?: string;
    };
    orderItems: Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
        subtotal: number;
    }>;
    deliveryAddress: string;
    paymentStatus: string;
    hasReview?: boolean;
}

interface OrderHistoryProps {
    userId: string;
}

const statusConfig: Record<string, { icon: any; color: string; bgColor: string; label: string }> = {
    new: { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'New' },
    confirmed: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Confirmed' },
    preparing: { icon: Package, color: 'text-amber-600', bgColor: 'bg-amber-100', label: 'Preparing' },
    ready_for_pickup: { icon: Package, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Ready for Pickup' },
    assigned: { icon: Truck, color: 'text-indigo-600', bgColor: 'bg-indigo-100', label: 'Driver Assigned' },
    in_transit: { icon: Truck, color: 'text-cyan-600', bgColor: 'bg-cyan-100', label: 'On the Way' },
    delivered: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Delivered' },
    cancelled: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Cancelled' },
};

export default function OrderHistory({ userId }: OrderHistoryProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; order: Order | null }>({
        isOpen: false,
        order: null
    });

    useEffect(() => {
        fetchOrders();
    }, [userId]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            const response = await fetch(`/api/customers/${userId}/orders`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'active') return !['delivered', 'cancelled'].includes(order.status);
        if (filter === 'completed') return ['delivered', 'cancelled'].includes(order.status);
        return true;
    });

    const handleReviewSubmit = async (orderId: string, rating: number, comment: string) => {
        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            const order = orders.find(o => o.id === orderId);
            
            const response = await fetch(`/api/restaurants/${order?.restaurant.id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                    orderId,
                    rating,
                    comment,
                    customerId: userId
                })
            });

            if (response.ok) {
                setOrders(orders.map(o => 
                    o.id === orderId ? { ...o, hasReview: true } : o
                ));
                setReviewModal({ isOpen: false, order: null });
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800">Order History</h2>
                <div className="flex gap-2">
                    {(['all', 'active', 'completed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                filter === f
                                    ? 'bg-red-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => {
                        const status = statusConfig[order.status] || statusConfig.new;
                        const StatusIcon = status.icon;
                        const isExpanded = expandedOrder === order.id;

                        return (
                            <div
                                key={order.id}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                                <div
                                    className="p-4 cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                >
                                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                {order.restaurant.logoUrl ? (
                                                    <img
                                                        src={order.restaurant.logoUrl}
                                                        alt={order.restaurant.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {order.restaurant.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Order #{order.orderNumber}
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bgColor}`}>
                                                <StatusIcon className={`w-4 h-4 ${status.color}`} />
                                                <span className={`text-sm font-medium ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-800">
                                                    CHF {order.totalAmount.toFixed(2)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {order.orderItems.length} items
                                                </p>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-semibold text-gray-700 mb-3">Order Items</h4>
                                                <div className="space-y-2">
                                                    {order.orderItems.map((item) => (
                                                        <div key={item.id} className="flex justify-between text-sm">
                                                            <span className="text-gray-600">
                                                                {item.quantity}x {item.name}
                                                            </span>
                                                            <span className="text-gray-800">
                                                                CHF {item.subtotal.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    <div className="border-t pt-2 mt-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Subtotal</span>
                                                            <span>CHF {order.subtotal.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Delivery Fee</span>
                                                            <span>CHF {order.deliveryFee.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between font-bold mt-1">
                                                            <span>Total</span>
                                                            <span>CHF {order.totalAmount.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-700 mb-3">Delivery Details</h4>
                                                <p className="text-sm text-gray-600 mb-4">{order.deliveryAddress}</p>
                                                
                                                {order.status === 'delivered' && !order.hasReview && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setReviewModal({ isOpen: true, order });
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                                                    >
                                                        <Star size={18} />
                                                        Leave a Review
                                                    </button>
                                                )}
                                                {order.hasReview && (
                                                    <div className="flex items-center gap-2 text-green-600">
                                                        <CheckCircle size={18} />
                                                        <span className="text-sm">Review submitted</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {reviewModal.isOpen && reviewModal.order && (
                <ReviewModal
                    order={reviewModal.order}
                    onClose={() => setReviewModal({ isOpen: false, order: null })}
                    onSubmit={handleReviewSubmit}
                />
            )}
        </div>
    );
}
