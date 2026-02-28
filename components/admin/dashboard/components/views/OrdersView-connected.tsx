"use client";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface OrdersViewProps {
    restaurantId: string;
}

const OrdersViewConnected = ({ restaurantId }: OrdersViewProps) => {
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        if (restaurantId) {
            fetchOrders();
        }
    }, [restaurantId]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const response = await fetch(`/api/restaurants/${restaurantId}/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
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

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
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
                await fetchOrders();
                const statusMessage = newStatus === 'ready_for_pickup'
                    ? 'Order marked as ready! A pickup code has been generated for the driver.'
                    : 'Order status updated successfully';
                alert(statusMessage);

                // Refresh the selected order if it's the one being updated
                if (selectedOrder?.id === orderId) {
                    const updatedOrder = orders.find(o => o.id === orderId);
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
        }
    };

    const getFilteredOrders = () => {
        if (activeFilter === 'all') return orders;
        if (activeFilter === 'new') return orders.filter(o => o.status === 'new');
        if (activeFilter === 'processing') return orders.filter(o => ['confirmed', 'preparing'].includes(o.status));
        if (activeFilter === 'in_transit') return orders.filter(o => ['ready_for_pickup', 'assigned', 'in_transit'].includes(o.status));
        if (activeFilter === 'cancelled') return orders.filter(o => o.status === 'cancelled');
        if (activeFilter === 'completed') return orders.filter(o => o.status === 'delivered');
        return orders;
    };

    const filteredOrders = getFilteredOrders();

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'new': 'bg-blue-100 text-blue-800',
            'confirmed': 'bg-yellow-100 text-yellow-800',
            'preparing': 'bg-orange-100 text-orange-800',
            'ready_for_pickup': 'bg-purple-100 text-purple-800',
            'assigned': 'bg-cyan-100 text-cyan-800',
            'in_transit': 'bg-indigo-100 text-indigo-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const handleOrderClick = (order: any) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    return (
        <>
            {!showOrderDetails && (
                <div
                    style={{ backgroundColor: '#E8D7B4' }}
                    className="w-full max-w-[768px] min-h-64 shadow-lg text-black opacity-70 mb-4 mx-auto max-h-[65vh] overflow-y-auto mt-20 p-6"
                >
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row gap-1 w-full overflow-x-auto">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`flex ${activeFilter === 'all' ? 'bg-blue-900' : 'bg-blue-500'} p-1 px-2 text-white text-[9px] md:text-[12px] whitespace-nowrap`}>
                                ALL<span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">{orders.length}</span>
                            </button>
                            <button
                                onClick={() => setActiveFilter('new')}
                                className={`flex ${activeFilter === 'new' ? 'bg-blue-900' : 'bg-blue-500'} p-1 px-2.5 text-white text-[9px] md:text-[12px] whitespace-nowrap`}>
                                NEW<span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">{orders.filter(o => o.status === 'new').length}</span>
                            </button>
                            <button
                                onClick={() => setActiveFilter('processing')}
                                className={`flex ${activeFilter === 'processing' ? 'bg-blue-900' : 'bg-blue-500'} p-1 px-2.5 text-white text-[9px] md:text-[12px] whitespace-nowrap`}>
                                PROCESSING<span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">{orders.filter(o => ['confirmed', 'preparing'].includes(o.status)).length}</span>
                            </button>
                            <button
                                onClick={() => setActiveFilter('in_transit')}
                                className={`flex ${activeFilter === 'in_transit' ? 'bg-blue-900' : 'bg-blue-500'} p-1 px-2.5 text-white text-[9px] md:text-[12px] whitespace-nowrap`}>
                                IN TRANSIT<span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">{orders.filter(o => ['ready_for_pickup', 'assigned', 'in_transit'].includes(o.status)).length}</span>
                            </button>
                            <button
                                onClick={() => setActiveFilter('cancelled')}
                                className={`flex ${activeFilter === 'cancelled' ? 'bg-blue-900' : 'bg-blue-500'} p-1 px-2.5 text-white text-[9px] md:text-[12px] whitespace-nowrap`}>
                                CANCELLED<span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">{orders.filter(o => o.status === 'cancelled').length}</span>
                            </button>
                            <button
                                onClick={() => setActiveFilter('completed')}
                                className={`flex ${activeFilter === 'completed' ? 'bg-blue-900' : 'bg-blue-500'} p-1 px-2.5 text-white text-[9px] md:text-[12px] whitespace-nowrap`}>
                                COMPLETED<span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">{orders.filter(o => o.status === 'delivered').length}</span>
                            </button>
                        </div>
                        <div className="flex flex-row w-full mt-2 overflow-auto max-h-[65vh]">
                            {loading ? (
                                <div className="flex items-center justify-center w-full py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                                </div>
                            ) : filteredOrders.length === 0 ? (
                                <div className="flex items-center justify-center w-full py-10">
                                    <p className="text-gray-500">No orders found</p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-[#ff9920] w-full sticky top-0">
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
            {showOrderDetails && selectedOrder && (
                <div className="flex flex-col w-full px-2 overflow-auto max-h-[75vh]">
                    <div className="flex flex-row justify-between items-between w-full mb-3">
                        <h3 className="text-[15px] font-bold text-[#274e13]">Order #{selectedOrder.orderNumber}</h3>
                        <button
                            onClick={() => {
                                setShowOrderDetails(false);
                                setSelectedOrder(null);
                            }}
                            className="w-auto bg-red-900 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-800 transition-colors duration-200 shadow-lg text-[13px]">
                            ALL ORDERS
                        </button>
                    </div>

                    {/* Pickup Code Display - Prominent when order is ready */}
                    {selectedOrder.pickupCode && ['ready_for_pickup', 'assigned', 'in_transit'].includes(selectedOrder.status) && (
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

                    <div className="flex flex-col md:flex-row w-full gap-4">
                        <div className="flex flex-col w-full md:w-[45%]">
                            <h3 className="font-bold mb-2">Items</h3>
                            <div className="space-y-3">
                                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                    selectedOrder.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-x-4 items-center">
                                            {item.menuItem?.imageUrl && (
                                                <img src={item.menuItem.imageUrl} alt={item.name} className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0 object-cover" />
                                            )}
                                            {!item.menuItem?.imageUrl && (
                                                <div className="w-20 h-20 bg-gray-300 rounded-md flex-shrink-0"></div>
                                            )}
                                            <div>
                                                <p className="text-black font-semibold text-[10px]">{item.menuItem?.name || item.name}</p>
                                                <p className="text-gray-600 text-[9px]">Qty: {item.quantity} × CHF {item.price}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No items</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col w-full md:w-[30%]">
                            <div className="bg-red-600 text-white font-bold px-3 py-1 flex justify-between items-center text-[10px]">
                                <span>Total:</span>
                                <span>CHF {selectedOrder.totalAmount?.toFixed(2)}</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-b-lg">
                                <div className="space-y-2 text-[10px]">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>CHF {selectedOrder.subtotal?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Fee:</span>
                                        <span>CHF {selectedOrder.deliveryFee?.toFixed(2)}</span>
                                    </div>
                                    {selectedOrder.taxAmount > 0 && (
                                        <div className="flex justify-between">
                                            <span>Tax:</span>
                                            <span>CHF {selectedOrder.taxAmount?.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full md:w-[35%] bg-yellow-300 p-3 rounded-lg">
                            <div className="mb-4">
                                <h3 className="text-[15px] font-bold text-gray-800 mb-2">Delivery Address</h3>
                                <div className="mt-2 text-blue-700 font-semibold text-[10px]">
                                    <p>{selectedOrder.customer?.firstName || selectedOrder.customerFirstName} {selectedOrder.customer?.lastName || selectedOrder.customerLastName}</p>
                                    <p>{selectedOrder.deliveryAddress}</p>
                                    <p>{selectedOrder.deliveryCity}, {selectedOrder.deliveryPostalCode}</p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-[13px] font-bold text-gray-800 mb-1">Scheduled Delivery</h3>
                                <p className="text-[10px] text-gray-700">{new Date(selectedOrder.scheduledDeliveryTime).toLocaleString()}</p>
                            </div>
                            <div className="flex flex-col mb-4 gap-2">
                                <label className="text-[13px] font-bold text-gray-800">Update Status:</label>
                                <div className="flex gap-2 flex-wrap">
                                    {selectedOrder.status === 'new' && (
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold"
                                        >
                                            Confirm
                                        </button>
                                    )}
                                    {selectedOrder.status === 'confirmed' && (
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                                            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-xs font-bold"
                                        >
                                            Start Preparing
                                        </button>
                                    )}
                                    {selectedOrder.status === 'preparing' && (
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'ready_for_pickup')}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-bold"
                                        >
                                            Mark Ready
                                        </button>
                                    )}
                                    {(selectedOrder.status === 'new' || selectedOrder.status === 'confirmed') && (
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrdersViewConnected;

