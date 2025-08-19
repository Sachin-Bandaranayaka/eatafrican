// src/app/super-admin/customer-accounts/components/data.ts

export const allCustomerData = [
    {
        region: 'BASEL',
        customers: [
            {
                id: 1,
                name: 'Customer 1',
                totalOrders: 500,
                totalSpent: "10'000",
                lastLogin: '01.05.2025',
                personalInfo: {
                    firstName: 'John',
                    lastName: 'Dankbarkeit',
                    email: 'john@gmail.com',
                    phone: '079 412 76 98'
                },
                address: {
                    postalCode: '4210',
                    city: 'Zurich',
                    street: 'Kaice 43'
                },
                favorites: {
                    restaurant: 'Restaurant 1, Zürich',
                    meal: 'Puff Puff'
                },
                orders: [
                    {
                        orderNr: '98921',
                        restaurantName: 'Restaurant Name',
                        totalSpent: '150.-',
                        deliveryDate: '05.05.2025',
                        deliveryStatus: 'Delivered',
                        meals: ['Meal 1 Name', 'Meal 2 Name', 'Meal 3 Name', 'Meal 4 Name']
                    },
                    // ... more orders for this customer
                ]
            },
            { id: 2, name: 'Customer 2', totalOrders: 120, totalSpent: "2'400", lastLogin: '30.04.2025', /*...other details*/ },
            { id: 3, name: 'Customer 3', totalOrders: 80, totalSpent: "1'600", lastLogin: '28.04.2025', /*...other details*/ },
        ]
    },
    {
        region: 'BERN',
        customers: [
            { id: 4, name: 'Customer 1', totalOrders: 300, totalSpent: "6'000", lastLogin: '01.05.2025', /*...other details*/ },
            { id: 5, name: 'Customer 2', totalOrders: 50, totalSpent: "1'000", lastLogin: '29.04.2025', /*...other details*/ },
        ]
    },
    // ... more regions and customers
];

// Define TypeScript types for better code quality
export type Order = typeof allCustomerData[0]['customers'][0]['orders'][0];
export type Customer = typeof allCustomerData[0]['customers'][0];
