"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabaseClient } from '@/lib/supabase/config';

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}

interface UseRealtimeOrdersOptions {
    customerId?: string;
    restaurantId?: string;
    driverId?: string;
    enabled?: boolean;
}

export function useRealtimeOrders(options: UseRealtimeOrdersOptions = {}) {
    const { customerId, restaurantId, driverId, enabled = true } = options;
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch initial orders
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            
            let url = '/api/orders';
            const params = new URLSearchParams();
            
            if (customerId) params.append('customerId', customerId);
            if (restaurantId) params.append('restaurantId', restaurantId);
            if (driverId) params.append('driverId', driverId);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders || []);
            } else {
                throw new Error('Failed to fetch orders');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [customerId, restaurantId, driverId]);

    // Set up real-time subscription
    useEffect(() => {
        if (!enabled) return;

        fetchOrders();

        // Subscribe to order changes
        const channel = supabaseClient
            .channel('orders-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                    filter: customerId ? `customer_id=eq.${customerId}` :
                            restaurantId ? `restaurant_id=eq.${restaurantId}` :
                            driverId ? `driver_id=eq.${driverId}` : undefined
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const newOrder = formatOrder(payload.new);
                        setOrders(prev => [newOrder, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        const updatedOrder = formatOrder(payload.new);
                        setOrders(prev => prev.map(order =>
                            order.id === updatedOrder.id ? updatedOrder : order
                        ));
                    } else if (payload.eventType === 'DELETE') {
                        setOrders(prev => prev.filter(order => order.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [enabled, customerId, restaurantId, driverId, fetchOrders]);

    return { orders, loading, error, refetch: fetchOrders };
}

function formatOrder(data: any): Order {
    return {
        id: data.id,
        orderNumber: data.order_number,
        status: data.status,
        totalAmount: parseFloat(data.total_amount),
        createdAt: data.created_at,
        updatedAt: data.updated_at
    };
}

// Hook for subscribing to a single order's status
export function useOrderStatus(orderId: string | null) {
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            return;
        }

        // Fetch initial status
        const fetchStatus = async () => {
            try {
                const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
                const response = await fetch(`/api/orders/${orderId}`, {
                    headers: {
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setStatus(data.order?.status || data.status);
                }
            } catch (err) {
                console.error('Error fetching order status:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();

        // Subscribe to status changes
        const channel = supabaseClient
            .channel(`order-${orderId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${orderId}`
                },
                (payload) => {
                    setStatus(payload.new.status);
                }
            )
            .subscribe();

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [orderId]);

    return { status, loading };
}
