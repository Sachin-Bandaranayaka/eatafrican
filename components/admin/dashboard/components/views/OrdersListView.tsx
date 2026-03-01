"use client";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

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

interface OrdersListViewProps {
    orders: Order[];
    loading: boolean;
    error: string | null;
    onOrderClick: (order: Order) => void;
}

export default function OrdersListView({ orders, loading, error, onOrderClick }: OrdersListViewProps) {
    if (loading) {
        return (
            <div
                style={{ backgroundColor: '#E8D7B4' }}
                className="w-full max-w-[768px] min-h-64 shadow-lg text-black opacity-70 mb-4 mx-auto max-h-[65vh] overflow-y-auto mt-20 p-4"
            >
                <div className="flex items-center justify-center w-full py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{ backgroundColor: '#E8D7B4' }}
                className="w-full max-w-[768px] min-h-64 shadow-lg text-black opacity-70 mb-4 mx-auto max-h-[65vh] overflow-y-auto mt-20 p-4"
            >
                <div className="flex items-center justify-center w-full py-10">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div
                style={{ backgroundColor: '#E8D7B4' }}
                className="w-full max-w-[768px] min-h-64 shadow-lg text-black opacity-70 mb-4 mx-auto max-h-[65vh] overflow-y-auto mt-20 p-4"
            >
                <div className="flex items-center justify-center w-full py-10">
                    <p className="text-gray-500">No orders found</p>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{ backgroundColor: '#E8D7B4' }}
            className="w-full max-w-[768px] min-h-64 shadow-lg text-black opacity-70 mb-4 mx-auto max-h-[65vh] overflow-y-auto mt-20 p-4"
        >
            <div className="flex flex-col w-full">
                <div className="flex flex-row w-full mt-2 overflow-auto max-h-[65vh]">
                    <Table className="w-full">
                        <TableHeader style={{ backgroundColor: '#ff9920' }} className="w-full sticky top-0">
                            <TableRow>
                                <TableHead className="py-2 px-1 text-left text-black text-xs font-bold w-[27%]">Order</TableHead>
                                <TableHead className="py-2 text-left text-black text-xs font-bold w-[20%]">Location</TableHead>
                                <TableHead className="py-2 text-left text-black text-xs font-bold w-[20%]">Date, Time</TableHead>
                                <TableHead className="py-2 text-left text-black text-xs font-bold w-[20%]">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="w-full">
                            {orders.map((order) => (
                                <TableRow
                                    key={order.id}
                                    className="w-full cursor-pointer hover:bg-gray-100 border-b text-xs"
                                    onClick={() => onOrderClick(order)}
                                >
                                    <TableCell className="py-2 font-semibold text-left">#{order.orderNumber} {order.customer?.firstName || order.customerFirstName}</TableCell>
                                    <TableCell className="py-2 font-semibold text-left">{order.deliveryCity}</TableCell>
                                    <TableCell className="py-2 font-semibold text-left">{new Date(order.createdAt).toLocaleString()}</TableCell>
                                    <TableCell className="py-2 pl-6 font-semibold text-left">
                                        {order.status.toUpperCase().replace('_', ' ')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
