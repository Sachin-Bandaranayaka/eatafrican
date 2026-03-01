"use client";

import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import CustomDropdown from "@/app/components/DropDown";
import CollapsibleSection from "@/app/components/CollapsibleSection";

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

interface OrderDetailsViewProps {
    order: Order;
    onUpdateStatus: (orderId: string, newStatus: string) => void;
    onBack: () => void;
}

const ORDER_STATUSES = {
    READY_FOR_PICKUP: 'ready_for_pickup',
    ASSIGNED: 'assigned',
    IN_TRANSIT: 'in_transit'
} as const;

export default function OrderDetailsView({ order, onUpdateStatus, onBack }: OrderDetailsViewProps) {
    const [showPickupDelivery, setShowPickupDelivery] = useState(false);
    const [showCustomerInfo, setShowCustomerInfo] = useState(false);

    const handleStatusUpdate = (option: string) => {
        const statusMap: Record<string, string> = {
            'NEW': 'new',
            'CONFIRMED': 'confirmed',
            'PREPARING': 'preparing',
            'READY FOR PICKUP': 'ready_for_pickup',
            'ASSIGNED': 'assigned',
            'IN TRANSIT': 'in_transit',
            'DELIVERED': 'delivered',
            'CANCELLED': 'cancelled'
        };
        onUpdateStatus(order.id, statusMap[option]);
    };

    return (
        <div
            style={{ backgroundColor: '#E8D7B4' }}
            className="w-full max-w-[768px] min-h-64 shadow-lg text-black opacity-70 mb-4 mx-auto mt-20 p-1"
        >
            <div className="flex flex-col w-full px-2 overflow-auto">
                
                {/* Header */}
                <div className="flex flex-row justify-between items-center w-full mb-4 py-1">
                    <h3 className="text-[13px] font-bold" style={{ color: '#367627' }}>
                        Order #{order.orderNumber}
                    </h3>
                    <span
                        onClick={onBack}
                        className="w-auto cursor-pointer text-red-900 font-bold text-[13px] hover:underline"
                    >
                        👉🏿 Orders
                    </span>
                </div>

                {/* Pickup Code */}
                {order.pickupCode && [ORDER_STATUSES.READY_FOR_PICKUP, ORDER_STATUSES.ASSIGNED, ORDER_STATUSES.IN_TRANSIT].includes(order.status as any) && (
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg mb-4 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold mb-1">🔑 Driver Pickup Code</p>
                                <p className="text-xs opacity-90">Give this code to the driver when they arrive</p>
                            </div>
                            <div className="bg-white text-purple-600 px-6 py-3 rounded-lg">
                                <p className="text-3xl font-bold tracking-wider">{order.pickupCode}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Details Sections */}
                <div className="flex flex-col w-full gap-2 pl-0">
                    
                    {/* Status Dropdown */}
                    <div className="flex flex-row items-center w-full rounded-lg relative gap-4">
                        <label className="text-xs font-bold text-gray-800 whitespace-nowrap">Status : </label>
                        <div className="relative -mt-7 ml-16">
                            <CustomDropdown
                                options={['NEW', 'CONFIRMED', 'PREPARING', 'READY FOR PICKUP', 'ASSIGNED', 'IN TRANSIT', 'DELIVERED', 'CANCELLED']}
                                defaultOption={order.status.toUpperCase().replace('_', ' ')}
                                backgroundColor="#e26666"
                                textColor="#FFFFFF"
                                width="100px"
                                onOptionSelect={handleStatusUpdate}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Pickup & Delivery Section */}
                <CollapsibleSection 
                    title="Pick up & Delivery"
                    isOpen={showPickupDelivery}
                    onToggle={() => setShowPickupDelivery(!showPickupDelivery)}
                     textColor="#87200d"
                    iconSpacing="2rem"

              >
                    <div className="space-y-0">
                        <div className="flex items-center">
                            <h3 className="text-[13px] font-semibold text-gray-800">Scheduled Delivery</h3>
                            <span className="mx-2">:</span>
                            <p className="text-[13px] font-semibold text-gray-700">{new Date(order.scheduledDeliveryTime).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center">
                            <h3 className="text-[13px] font-semibold text-gray-800">Estimated Pick-Up</h3>
                            <span className="mx-2">:</span>
                            <p className="text-[13px] font-semibold text-gray-700">{new Date(order.scheduledDeliveryTime).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center">
                            <h3 className="text-[13px] font-semibold text-gray-800">Pick Up Code</h3>
                            <span className="mx-2">:</span>
                            <p className="text-[13px] font-semibold text-gray-700">{order.pickupCode || 'N/A'}</p>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Customer Info Section */}
                <CollapsibleSection
                    title="Customer Info"
                    isOpen={showCustomerInfo}
                    onToggle={() => setShowCustomerInfo(!showCustomerInfo)}
                    textColor="#87200d"
                    iconSpacing="3.35rem"

                >
                    <div className="space-y-1">
                        <div>
                            <h3 className="text-[13px] font-semibold text-gray-800 mb-1">Customer Name</h3>
                            <p className="text-[13px] font-semibold text-gray-700">{order.customer?.firstName || order.customerFirstName} {order.customer?.lastName || order.customerLastName}</p>
                        </div>
                        <div>
                            <p className="text-[13px] text-gray-700">{order.deliveryAddress}</p>
                            <p className="text-[13px] text-gray-700">{order.deliveryCity}, {order.deliveryPostalCode}</p>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Items Table */}
                <div className="mt-4">
                    <Table className="table-auto w-fit" style={{ borderCollapse: 'collapse', border: 'none' }}>
                        <TableHeader>
                            <TableRow className="h-6 border-none">
                                <th className="py-0.5 px-0.5 text-left font-semibold underline text-black w-[350px]" style={{ textUnderlineOffset: '6px', textDecorationThickness: '2px' }}>
                                    Items
                                </th>
                                <th
                                    colSpan={3}
                                    className="py-0.5 px-2 text-left text-xs font-bold text-white bg-red-600 whitespace-nowrap"
                                >
                                    Total all items:
                                </th>
                            </TableRow>

                            <TableRow className="h-6 border-none">
                                <th className="py-0 px-2"></th>
                                <th className="py-0 px-2 text-[11px] font-bold text-black whitespace-nowrap text-left">
                                    Cost
                                </th>
                                <th className="py-0 px-2 text-[11px] font-bold text-black whitespace-nowrap text-left">
                                    Qty
                                </th>
                                <th className="py-0 px-2 text-[11px] font-bold text-black whitespace-nowrap text-left">
                                    Total Per Item
                                </th>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {order.items?.length ? (
                                order.items.map((item, idx) => (
                                    <TableRow key={idx} className="h-14 border-none">
                                        <TableCell className="py-1 px-1" style={{ border: 'none' }}>
                                            <div className="flex items-center gap-6">
                                                {item.menuItem?.imageUrl ? (
                                                    <img
                                                        src={item.menuItem.imageUrl}
                                                        alt={item.name}
                                                        className="w-8 h-8 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-[95px] h-[62px] bg-[#434343] " />
                                                )}
                                                <span className="text-[10px] font-semibold text-black">
                                                    {item.menuItem?.name || item.name}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="py-1 px-2 text-[10px] font-semibold text-gray-700 text-left whitespace-nowrap" style={{ border: 'none' }}>
                                            CHF {item.price.toFixed(2)}
                                        </TableCell>

                                        <TableCell className="py-1 px-2 text-[10px] font-semibold text-gray-700 text-left whitespace-nowrap" style={{ border: 'none' }}>
                                            {item.quantity}
                                        </TableCell>

                                        <TableCell className="py-1 px-2 text-[10px] font-semibold text-gray-700 text-left whitespace-nowrap" style={{ border: 'none' }}>
                                            CHF {(item.price * item.quantity).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-3 text-center text-sm text-gray-500">
                                        No items
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

            </div>
        </div>
    );
}
