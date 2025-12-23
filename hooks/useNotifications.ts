"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabaseClient } from '@/lib/supabase/config';

interface Notification {
    id: string;
    type: 'order_status' | 'account' | 'system' | 'promotion';
    title: string;
    message: string;
    data?: any;
    read: boolean;
    createdAt: string;
}

export function useNotifications(userId: string | null) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            const response = await fetch(`/api/notifications?userId=${userId}`, {
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                const data = await response.json();
                const formattedNotifications = (data.notifications || []).map(formatNotification);
                setNotifications(formattedNotifications);
                setUnreadCount(formattedNotifications.filter((n: Notification) => !n.read).length);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            setNotifications(prev => prev.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
        if (!userId) return;

        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            await fetch(`/api/notifications/read-all?userId=${userId}`, {
                method: 'PUT',
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    }, [userId]);

    // Set up real-time subscription
    useEffect(() => {
        if (!userId) return;

        fetchNotifications();

        // Subscribe to new notifications
        const channel = supabaseClient
            .channel(`notifications-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    const newNotification = formatNotification(payload.new);
                    setNotifications(prev => [newNotification, ...prev]);
                    setUnreadCount(prev => prev + 1);

                    // Show browser notification if permitted
                    if (Notification.permission === 'granted') {
                        new Notification(newNotification.title, {
                            body: newNotification.message,
                            icon: '/images/logo.png'
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [userId, fetchNotifications]);

    // Request notification permission
    const requestPermission = useCallback(async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    }, []);

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        requestPermission,
        refetch: fetchNotifications
    };
}

function formatNotification(data: any): Notification {
    return {
        id: data.id,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data,
        read: data.read,
        createdAt: data.created_at
    };
}
