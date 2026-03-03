"use client";
import { useState, useEffect, useCallback } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";

// ============================================
// INTERFACES
// ============================================

interface OrdersViewProps {
    restaurantId: string;
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

const OrdersViewConnected = ({ restaurantId }: OrdersViewProps) => {
    
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
    const [showPickupDelivery, setShowPickupDelivery] = useState(false);
    const [showCustomerInfo, setShowCustomerInfo] = useState(false);

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

    const filteredOrders = getFilteredOrders();

    // ============================================
    // RENDER
    // ============================================
    
    return (
        <>
            {/* ============================================
            ORDERS LIST VIEW - Matches client design exactly
            ============================================ */}
            
            {!showOrderDetails && (
                <div
                    style={{ backgroundColor: '#E8D7B4' }}
                    className="w-full max-w-[768px] min-h-64 shadow-lg text-black opacity-70 mb-4 mx-auto max-h-[65vh] overflow-y-auto mt-20 p-6"
                >
                    <div className="flex flex-col w-full">
                        
                        {/* Filter Buttons - Using config to avoid repetition */}
                        <div className="flex flex-row gap-1 w-full overflow-x-auto">
                            {FILTER_CONFIGS.map((config) => (
                                <button
                                    key={config.id}
                                    onClick={() => setActiveFilter(config.id)}
                                    className={`flex ${activeFilter === config.id ? 'bg-blue-900' : 'bg-blue-500'} p-1 px-2 text-white text-[9px] md:text-[12px] whitespace-nowrap`}
                                >
                                    {config.label}
                                    <span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">
                                        {config.getCount(orders)}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Orders Table */}
                        <div className="flex flex-row w-full mt-2 overflow-auto max-h-[65vh]">
                            {loading ? (
                                <div className="flex items-center justify-center w-full py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                                </div>
                            ) : error ? (
                                <div className="flex items-center justify-center w-full py-10">
                                    <p className="text-red-500">{error}</p>
                                </div>
                            ) : filteredOrders.length === 0 ? (
                                <div className="flex items-center justify-center w-full py-10">
                                    <p className="text-gray-500">No orders found</p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead style={{ backgroundColor: '#ff9920' }} className="w-full sticky top-0">
                                        <tr>
                                            <th className="py-1 px-1 text-left text-black text-xs">Order</th>
                                            <th className="py-1 text-left text-black text-xs">Location</th>
                                            <th className="py-1 text-left text-black text-xs">Date, Time</th>
                                            <th className="py-1 text-left text-black text-xs pl-6">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="w-full">
                                        {filteredOrders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="w-full cursor-pointer hover:bg-gray-100 border-b text-xs"
                                                onClick={() => handleOrderClick(order)}
                                            >
                                                <td className="py-2">#{order.orderNumber} {order.customer?.firstName || order.customerFirstName}</td>
                                                <td>{order.deliveryCity}</td>
                                                <td>{new Date(order.createdAt).toLocaleString()}</td>
                                                <td className="pl-6">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                        {order.status.toUpperCase().replace('_', ' ')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================
            ORDER DETAILS VIEW - Matches client design exactly
            ============================================ */}
            
            {showOrderDetails && selectedOrder && (
                <div
                    style={{ backgroundColor: '#E8D7B4' }}
                    className="w-full max-w-[768px] min-h-64 shadow-lg text-black opacity-70 mb-4 mx-auto mt-20 p-6"
                >
                    <div className="flex flex-col w-full px-2 overflow-auto">
                        
                        {/* Header */}
                        <div className="flex flex-row justify-between items-center w-full mb-4">
                            <h3 className="text-[15px] font-bold" style={{ color: '#367627' }}>
                                Order #{selectedOrder.orderNumber}
                            </h3>
                            <span
                                onClick={() => {
                                    setShowOrderDetails(false);
                                    setSelectedOrder(null);
                                }}
                                className="w-auto cursor-pointer text-red-900 font-bold text-[13px] hover:underline"
                            >
                                👉🏿 Orders
                            </span>
                        </div>

                        {/* Pickup Code */}
                        {selectedOrder.pickupCode && [ORDER_STATUSES.READY_FOR_PICKUP, ORDER_STATUSES.ASSIGNED, ORDER_STATUSES.IN_TRANSIT].includes(selectedOrder.status as any) && (
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg mb-4 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold mb-1">🔑 Driver Pickup Code</p>
                                        <p className="text-xs opacity-90">Give this code to the driver when they arrive</p>
                                    </div>
                                    <div className="bg-white text-purple-600 px-6 py-3 rounded-lg">
                                        <p className="text-3xl font-bold tracking-wider">{selectedOrder.pickupCode}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Details Sections */}
                        <div className="flex flex-col w-full gap-2 pl-0">
                            
                            {/* Status Dropdown */}
                            <div className="flex flex-row items-center w-full rounded-lg relative gap-16">
                                <label className="text-m font-semibold text-gray-800 whitespace-nowrap">Status : </label>
                                <div className="relative ml-4">
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                                        disabled={statusUpdateLoading}
                                        className="w-24 px-2 py-1 border border-gray-300 rounded-lg text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed appearance-none text-[13px]" 
                                        style={{ backgroundColor: '#e26666', color: 'white', paddingLeft: '12px' }}
                                    >
                                        <option value={ORDER_STATUSES.NEW}>NEW</option>
                                        <option value={ORDER_STATUSES.CONFIRMED}>CONFIRMED</option>
                                        <option value={ORDER_STATUSES.PREPARING}>PREPARING</option>
                                        <option value={ORDER_STATUSES.READY_FOR_PICKUP}>READY FOR PICKUP</option>
                                        <option value={ORDER_STATUSES.ASSIGNED}>ASSIGNED</option>
                                        <option value={ORDER_STATUSES.IN_TRANSIT}>IN TRANSIT</option>
                                        <option value={ORDER_STATUSES.DELIVERED}>DELIVERED</option>
                                        <option value={ORDER_STATUSES.CANCELLED}>CANCELLED</option>
                                    </select>
                                    <ChevronDown style={{ strokeWidth: 6 }} size={12} className="text-white absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                            
                            {/* Pickup & Delivery Section */}
                            <div className="flex flex-col w-full rounded-lg">
                                <button
                                    onClick={() => setShowPickupDelivery(!showPickupDelivery)}
                                    className="flex items-center gap-5 w-full transition-colors text-[13px] font-bold"
                                    style={{ color: '#8f301d' }}
                                >
                                    <span className="font-bold">Pick up & Delivery</span>
                                    {showPickupDelivery ? (
                                        <Minus strokeWidth={6} className="w-3 h-3 text-black" />
                                    ) : (
                                        <Plus strokeWidth={6} className="w-3 h-3 text-black" />
                                    )}
                                </button>
                                {showPickupDelivery && (
                                    <div className="mt-3 space-y-0">
                                        <div className="flex items-center">
                                            <h3 className="text-[13px] font-semibold text-gray-800">Scheduled Delivery</h3>
                                            <span className="mx-2">:</span>
                                            <p className="text-[13px] font-semibold text-gray-700">{new Date(selectedOrder.scheduledDeliveryTime).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <h3 className="text-[13px] font-semibold text-gray-800">Estimated Pick-Up</h3>
                                            <span className="mx-2">:</span>
                                            <p className="text-[13px] font-semibold text-gray-700">{new Date(selectedOrder.scheduledDeliveryTime).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <h3 className="text-[13px] font-semibold text-gray-800">Pick Up Code</h3>
                                            <span className="mx-2">:</span>
                                            <p className="text-[13px] font-semibold text-gray-700">{selectedOrder.pickupCode || 'N/A'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Customer Info Section */}
                            <div className="flex flex-col w-full rounded-lg">
                                <button
                                    onClick={() => setShowCustomerInfo(!showCustomerInfo)}
                                    className="flex items-center gap-8 w-full transition-colors text-[13px] font-bold"
                                    style={{ color: '#8f301d' }}
                                >
                                    <span className="font-bold">Customer Info</span>
                                    {showCustomerInfo ? (
                                        <Minus strokeWidth={6} className="w-3 h-3 text-black ml-[11px]" />
                                    ) : (
                                        <Plus strokeWidth={6} className="w-3 h-3 text-black ml-[11px]" />
                                    )}
                                </button>
                                {showCustomerInfo && (
                                    <div className="mt-1 space-y-0">
                                        <div>
                                            <h3 className="text-[13px] font-semibold text-gray-800 mb-1">Customer Name</h3>
                                            <p className="text-[13px] font-semibold text-gray-700">{selectedOrder.customer?.firstName || selectedOrder.customerFirstName} {selectedOrder.customer?.lastName || selectedOrder.customerLastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[13px] text-gray-700">{selectedOrder.deliveryAddress}</p>
                                            <p className="text-[13px] text-gray-700">{selectedOrder.deliveryCity}, {selectedOrder.deliveryPostalCode}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Items Table - Keeping your exact design */}
                        <div className="w-full mt-4">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-2 text-left text-m underline text-black w-1/2">Item</th>
                                        <th colSpan={3} className="py-2 px-2 text-left text-xs font-bold text-white bg-red-600">Total all items:</th>
                                    </tr>
                                    <tr>
                                        <th className="py-2 px-2 text-left text-xs font-bold text-black w-1/2"></th>
                                        <th className="py-2 px-2 text-left text-xs font-bold text-black w-[12%]">Cost</th>
                                        <th className="py-2 px-2 text-left text-xs font-bold text-black w-[12%]">Qty</th>
                                        <th className="py-2 px-2 text-left text-xs font-bold text-black w-[12%]">Total Per Item</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item, idx) => (
                                            <tr key={idx} className="border-b">
                                                <td className="py-2 px-2 w-1/2">
                                                    <div className="flex items-center gap-2">
                                                        {item.menuItem?.imageUrl && (
                                                            <img src={item.menuItem.imageUrl} alt={item.name} className="w-10 h-10 bg-gray-200 rounded-md flex-shrink-0 object-cover" />
                                                        )}
                                                        {!item.menuItem?.imageUrl && (
                                                            <div className="w-10 h-10 bg-gray-300 rounded-md flex-shrink-0"></div>
                                                        )}
                                                        <span className="text-xs text-black">{item.menuItem?.name || item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-2 text-xs text-gray-700 w-[12%]">CHF {item.price.toFixed(2)}</td>
                                                <td className="py-2 px-2 text-xs text-gray-700 w-[12%]">{item.quantity}</td>
                                                <td className="py-2 px-2 text-xs text-gray-700 w-[12%]">CHF {(item.price * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-4 text-center text-gray-500 text-sm">No items</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default OrdersViewConnected;