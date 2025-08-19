// src/app/super-admin/orders/components/data.ts

export const restaurantData = [
    {
        region: 'BASEL',
        restaurants: [
            { name: 'African Restaurant 1', orders: 12 },
            { name: 'African Restaurant 2', orders: 8 },
            { name: 'African Restaurant 3', orders: 23 },
            { name: 'African Restaurant 4', orders: 5 },
        ]
    },
    {
        region: 'BERN',
        restaurants: [
            { name: 'African Restaurant 1', orders: 15 },
        ]
    },
    {
        region: 'LUZERN',
        restaurants: [
            { name: 'African Restaurant 1', orders: 7 },
            { name: 'African Restaurant 2', orders: 19 },
            { name: 'African Restaurant 3', orders: 3 },
            { name: 'African Restaurant 4', orders: 11 },
        ]
    },
    {
        region: 'Zürich',
        restaurants: [
            { name: 'African Restaurant 1', orders: 31 },
            { name: 'African Restaurant 2', orders: 14 },
            { name: 'African Restaurant 3', orders: 6 },
            { name: 'African Restaurant 4', orders: 22 },
        ]
    }
];

export const processingOrdersData = [
    { orderNr: '#XXX', total: 'XXX', address: 'Beklaice 32, Zürich', schedule: '10.05.2025, 13:45 hrs' },
    { orderNr: '#XXX', total: 'XXX', address: 'lulad, 24 Zürich', schedule: '10.05.2025, 13:45 hrs' },
    { orderNr: '#XXX', total: 'XXX', address: 'Ulmcad 56, Basel', schedule: '11.05.2025, 12:45 hrs' },
    { orderNr: '#XXX', total: 'XXX', address: 'Bear, 89 Luzern', schedule: '11.05.2025, 13:45 hrs' },
];

export const orderStatuses = [
    { name: 'NEW ORDERS', count: 4 },
    { name: 'PROCESSING', count: 4 },
    { name: 'IN TRANSIT', count: 1 },
    { name: 'DELIVERED', count: 2 },
    { name: 'CANCELLED', count: 1 },
];
