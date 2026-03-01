"use client";
import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    type: 'order' | 'system' | 'payment' | 'review';
}

export default function NotificationPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const response = await fetch('/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.notifications?.filter((n: Notification) => !n.read).length || 0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setNotifications(prev => 
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            await fetch('/api/notifications/read-all', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'order':
                return '🍽️';
            case 'payment':
                return '💰';
            case 'review':
                return '⭐';
            default:
                return '🔔';
        }
    };

    const formatTime = (timestamp: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(timestamp).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="relative pointer-events-auto">
            <button 
                className="relative w-8 h-8 hover:scale-110 transition cursor-pointer" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={24} className="text-white" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
            
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Notification Panel */}
                    <div 
                        className="absolute w-96 max-h-[600px] rounded-lg shadow-2xl z-50 flex flex-col ml-2"
                        style={{ backgroundColor: '#FFE59E', top: '30px', left: '100%' }}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-2 right-2 p-1 hover:bg-orange-200 rounded-full transition"
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={20} style={{ color: '#5C0F01' }} />
                        </button>
                        
                        {/* Welcome Section */}
                        <div className="flex items-center justify-between gap-4 p-4 border-b border-orange-300">
                            <div className="flex items-center gap-4">
                                <img 
                                    src="/Assets/chef male 2.png" 
                                    alt="Chef Male" 
                                    className="w-24 h-24 rounded-full object-contain"
                                />
                                <div className="rounded-lg px-4 py-2 shadow" style={{ backgroundColor: '#FFDA76' }}>
                                    <p className="text-sm font-semibold" style={{ color: '#5C0F01' }}>Hallo Restaurant 89</p>
                                    <p className="text-black text-xs mt-1">Welcome to your Eat African Restaurant Management Portal</p>
                                </div>
                            </div>
                            <img 
                                src="/Assets/Chef Female 1.png" 
                                alt="Chef Female" 
                                className="w-20 h-20 rounded-full object-contain"
                            />
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-black text-sm font-semibold">No notifications yet</p>
                                    <p className="text-black text-xs mt-1">We'll notify you when something important happens</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-orange-200">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 cursor-pointer hover:bg-orange-100 transition ${
                                                !notification.read ? 'bg-orange-50' : ''
                                            }`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="text-black text-sm font-bold">
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.read && (
                                                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                                                        )}
                                                    </div>
                                                    <p className="text-black text-xs mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-gray-600 text-xs mt-1">
                                                        {formatTime(notification.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-orange-300 text-center">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                                    View all notifications
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
