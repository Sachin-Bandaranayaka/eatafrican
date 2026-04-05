"use client";

import { useState, useEffect, useCallback } from "react";
import OrdersListView from "./OrdersListView";
import OrderDetailsView from "./OrderDetailsView";

// ============================================
// INTERFACES
// ============================================

interface OrdersViewProps {
    restaurantId: string;
    orderStatusTab?: string;
}

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    menuItem?: {
        name: string;
        imageUrl?: string;
    };
}

interface Customer {
    firstName: string;
    lastName: string;
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    deliveryCity: string;
    createdAt: string;
    totalAmount: number;
    subtotal: number;
    deliveryFee: number;
    taxAmount: number;
    deliveryAddress: string;
    deliveryPostalCode: string;
    scheduledDeliveryTime: string;
    pickupCode?: string;
    customerFirstName?: string;
    customerLastName?: string;
    customer?: Customer;
    items?: OrderItem[];
}

// ============================================
// CONSTANTS - Single source of truth
// ============================================

const ORDER_STATUSES = {
    NEW: 'new',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    READY_FOR_PICKUP: 'ready_for_pickup',
    ASSIGNED: 'assigned',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
} as const;

const STATUS_COLORS: Record<string, string> = {
    'new': 'bg-blue-100 text-blue-800',
    'confirmed': 'bg-yellow-100 text-yellow-800',
    'preparing': 'bg-orange-100 text-orange-800',
    'ready_for_pickup': 'bg-purple-100 text-purple-800',
    'assigned': 'bg-cyan-100 text-cyan-800',
    'in_transit': 'bg-indigo-100 text-indigo-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
};

// Filter configurations - makes it easy to add/remove filters
const FILTER_CONFIGS = [
    { 
        id: 'all', 
        label: 'ALL', 
        getCount: (orders: Order[]) => orders.length,
        filter: (orders: Order[]) => orders 
    },
    { 
        id: 'new', 
        label: 'NEW', 
        getCount: (orders: Order[]) => orders.filter(o => o.status === ORDER_STATUSES.NEW).length,
        filter: (orders: Order[]) => orders.filter(o => o.status === ORDER_STATUSES.NEW) 
    },
    { 
        id: 'processing', 
        label: 'PROCESSING', 
        getCount: (orders: Order[]) => orders.filter(o => 
            [ORDER_STATUSES.CONFIRMED, ORDER_STATUSES.PREPARING].includes(o.status as any)
        ).length,
        filter: (orders: Order[]) => orders.filter(o => 
            [ORDER_STATUSES.CONFIRMED, ORDER_STATUSES.PREPARING].includes(o.status as any)
        ) 
    },
    { 
        id: 'in_transit', 
        label: 'IN TRANSIT', 
        getCount: (orders: Order[]) => orders.filter(o => 
            [ORDER_STATUSES.READY_FOR_PICKUP, ORDER_STATUSES.ASSIGNED, ORDER_STATUSES.IN_TRANSIT].includes(o.status as any)
        ).length,
        filter: (orders: Order[]) => orders.filter(o => 
            [ORDER_STATUSES.READY_FOR_PICKUP, ORDER_STATUSES.ASSIGNED, ORDER_STATUSES.IN_TRANSIT].includes(o.status as any)
        ) 
    },
    { 
        id: 'cancelled', 
        label: 'CANCELLED', 
        getCount: (orders: Order[]) => orders.filter(o => o.status === ORDER_STATUSES.CANCELLED).length,
        filter: (orders: Order[]) => orders.filter(o => o.status === ORDER_STATUSES.CANCELLED) 
    },
    { 
        id: 'completed', 
        label: 'COMPLETED', 
        getCount: (orders: Order[]) => orders.filter(o => o.status === ORDER_STATUSES.DELIVERED).length,
        filter: (orders: Order[]) => orders.filter(o => o.status === ORDER_STATUSES.DELIVERED) 
    }
];

// ============================================
// MAIN COMPONENT
// ============================================

const OrdersViewConnected = ({ restaurantId, orderStatusTab }: OrdersViewProps) => {
    
    // ============================================
    // STATE
    // ============================================
    
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

    // ============================================
    // API FUNCTIONS
    // ============================================
    
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        let mounted = true;

        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const response = await fetch(`/api/restaurants/${restaurantId}/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (mounted) {
                    setOrders(data.orders || []);
                }
                return data.orders || [];
            } else {
                if (mounted) {
                    setError('Failed to fetch orders');
                }
                return [];
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (mounted) {
                setError('Error loading orders. Please try again.');
            }
            return [];
        } finally {
            if (mounted) {
                setLoading(false);
            }
        }
    }, [restaurantId]);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        setStatusUpdateLoading(true);
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                const updatedOrders = await fetchOrders();
                const statusMessage = newStatus === ORDER_STATUSES.READY_FOR_PICKUP
                    ? 'Order marked as ready! A pickup code has been generated for the driver.'
                    : 'Order status updated successfully';

                alert(statusMessage);

                if (selectedOrder?.id === orderId && updatedOrders) {
                    const updatedOrder = updatedOrders.find((o: Order) => o.id === orderId);
                    if (updatedOrder) {
                        setSelectedOrder(updatedOrder);
                    }
                }
            } else {
                alert('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Error updating order status');
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    // ============================================
    // EFFECTS
    // ============================================
    
    useEffect(() => {
        let mounted = true;

        if (restaurantId) {
            fetchOrders();
        }

        return () => {
            mounted = false;
        };
    }, [restaurantId, fetchOrders]);

    // Sync activeFilter with orderStatusTab prop
    useEffect(() => {
        if (orderStatusTab) {
            const filterId = orderStatusTab.toLowerCase().replace(' ', '_');
            const matchingFilter = FILTER_CONFIGS.find(f => f.id === filterId || f.label === orderStatusTab.toUpperCase());
            if (matchingFilter) {
                setActiveFilter(matchingFilter.id);
            }
        }
    }, [orderStatusTab]);

    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    const getFilteredOrders = () => {
        const filterConfig = FILTER_CONFIGS.find(f => f.id === activeFilter);
        return filterConfig ? filterConfig.filter(orders) : orders;
    };

    const getStatusColor = (status: string) => {
        return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
    };

    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const handleBack = () => {
        setShowOrderDetails(false);
        setSelectedOrder(null);
    };

    const filteredOrders = getFilteredOrders();
    const activeFilterLabel = FILTER_CONFIGS.find(f => f.id === activeFilter)?.label || 'ALL';
    const tableTitle = `${activeFilterLabel} ORDERS`;

    // ============================================
    // RENDER
    // ============================================
    
    return (
        <>
            {!showOrderDetails && (
                <OrdersListView 
                    orders={filteredOrders}
                    loading={loading}
                    error={error}
                    tableTitle={tableTitle}
                    onOrderClick={handleOrderClick}
                />
            )}

            {showOrderDetails && selectedOrder && (
                <OrderDetailsView 
                    order={selectedOrder}
                    onUpdateStatus={updateOrderStatus}
                    onBack={handleBack}
                />
            )}
        </>
    );
};

export default OrdersViewConnected;
