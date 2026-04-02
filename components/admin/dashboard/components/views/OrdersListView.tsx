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
    tableTitle?: string;
    onOrderClick: (order: Order) => void;
}

export default function OrdersListView({ orders, loading, error, tableTitle = 'ALL ORDERS', onOrderClick }: OrdersListViewProps) {
    const shortenForMobile = (value: string, maxLength: number) => {
        if (!value) return '';
        return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
    };
    const formatDateForMobile = (dateValue: string) => {
        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) return '';
        return date.toLocaleString(undefined, {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };
    const getCompactStatus = (status: string) => {
        const statusMap: Record<string, string> = {
            new: 'NEW',
            confirmed: 'CONF',
            preparing: 'PREP',
            ready_for_pickup: 'READY',
            assigned: 'ASGN',
            in_transit: 'TRANS',
            delivered: 'DONE',
            cancelled: 'CANC'
        };
        return statusMap[status] || status.toUpperCase();
    };

    if (loading) {
        return (
            <div
                style={{ backgroundColor: '#E8D7B4' }}
                className="w-full sm:w-full sm:mx-auto sm:max-w-[768px] min-h-64 shadow-lg text-black opacity-85 mb-4 mx-auto max-h-[65vh] overflow-y-auto mt-28 sm:mt-20 p-1 sm:p-4"
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
                className="w-full sm:w-full sm:mx-auto sm:max-w-[768px] min-h-64 shadow-lg text-black opacity-85 mb-4 mx-auto max-h-[65vh] overflow-y-auto mt-28 sm:mt-20 p-1 sm:p-4"
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
                className="w-full sm:w-full sm:mx-auto sm:max-w-[768px] min-h-64 shadow-lg text-black opacity-85 mb-4 mx-auto max-h-[65vh] overflow-y-auto mt-28 sm:mt-20 p-1 sm:p-4"
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
            className="w-full sm:w-full sm:mx-auto sm:max-w-[768px] min-h-64 shadow-lg text-black opacity-85 mb-4 mx-auto max-h-[65vh] overflow-y-auto mt-28 sm:mt-20 p-1 sm:p-4"
        >
            <div className="flex flex-col w-full">
                <h3 className="block sm:hidden ml-3 text-[8px] font-bold text-red-800 mb-1 mt-0.5">
                    {tableTitle}
                </h3>
                <div className="flex flex-row w-full mt-1 sm:mt-2 overflow-x-hidden sm:overflow-auto overflow-y-auto max-h-[65vh]">
                    <Table className="w-[92%] sm:w-full mx-auto table-fixed text-[7px] sm:text-sm">
                        <TableHeader style={{ backgroundColor: '#ff9920' }} className="w-full sticky top-0">
                            <TableRow className="h-4 sm:h-auto">
                                <TableHead className="h-4 sm:h-12 py-0 sm:py-2 px-0.5 sm:px-1 leading-none text-left text-black text-[7px] sm:text-xs font-bold w-[34%]">
                                    Order
                                </TableHead>
                                <TableHead className="h-4 sm:h-12 py-0 sm:py-2 px-0.5 sm:px-1 leading-none text-left text-black text-[6px] sm:text-xs font-bold w-[20%]">
                                    Location
                                </TableHead>
                                <TableHead className="h-4 sm:h-12 py-0 sm:py-2 px-0.5 sm:px-1 leading-none text-left text-black text-[6px] sm:text-xs font-bold w-[22%]">
                                    Date, Time
                                </TableHead>
                                <TableHead className="h-4 sm:h-12 py-0 sm:py-2 px-0.5 sm:px-1 leading-none text-left text-black text-[6px] sm:text-xs font-bold w-[24%]">
                                    Status
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="w-full">
                            {orders.map((order) => (
                                <TableRow
                                    key={order.id}
                                    className="w-full cursor-pointer hover:bg-gray-100 border-b text-[7px] sm:text-xs"
                                    onClick={() => onOrderClick(order)}
                                >
                                    <TableCell className="py-0.5 sm:py-2 px-0.5 sm:px-1 font-semibold text-left leading-tight whitespace-nowrap overflow-hidden min-w-0">
                                        <span className="block sm:hidden truncate">
                                            #{order.orderNumber} {shortenForMobile(order.customer?.firstName || order.customerFirstName || '', 5)}
                                        </span>
                                        <span className="hidden sm:block">
                                            #{order.orderNumber} {order.customer?.firstName || order.customerFirstName}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-0.5 sm:py-2 px-0.5 sm:px-1 text-[6px] sm:text-xs font-semibold text-left leading-tight whitespace-nowrap overflow-hidden min-w-0">
                                        <span className="block sm:hidden truncate">
                                            {shortenForMobile(order.deliveryCity || '', 6)}
                                        </span>
                                        <span className="hidden sm:block">
                                            {order.deliveryCity}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-0.5 sm:py-2 px-0.5 sm:px-1 text-[6px] sm:text-xs font-semibold text-left leading-tight whitespace-nowrap overflow-hidden min-w-0">
                                        <span className="block sm:hidden truncate">
                                            {formatDateForMobile(order.createdAt)}
                                        </span>
                                        <span className="hidden sm:block">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-0.5 sm:py-2 px-0.5 sm:px-1 sm:pl-6 text-[6px] sm:text-xs font-semibold text-left leading-tight whitespace-nowrap overflow-hidden min-w-0">
                                        <span className="block sm:hidden truncate">
                                            {getCompactStatus(order.status)}
                                        </span>
                                        <span className="hidden sm:block">
                                            {order.status.toUpperCase().replace('_', ' ')}
                                        </span>
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

