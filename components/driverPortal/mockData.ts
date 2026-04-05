// Mock data for Driver Portal development
// Set NEXT_PUBLIC_USE_MOCK_DATA=true in .env to enable

// Check if mock data should be used
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock Driver Profile
export const mockDriver = {
    id: "driver-001",
    name: "John Driver",
    email: "john@driver.com",
    phone: "+41 79 123 45 67",
    vehicleType: "Car",
    licensePlate: "ZH 123456",
    pickupZone: "Zurich",
    rating: 4.8,
    totalDeliveries: 1250,
    earnings: {
        today: 85.50,
        thisWeek: 425.00,
        thisMonth: 1850.00,
        pendingPayout: 185.00,
        nextPayoutDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    },
    status: "online",
};

// Mock Orders
export const mockNewOrders = [
    {
        id: "order-001",
        orderNumber: "ORD-2024-001",
        restaurant: {
            id: "rest-001",
            name: "African Spice Kitchen",
            address: "Bahnhofstrasse 25",
            city: "Zurich",
            phone: "+41 44 123 45 67",
        },
        customer: {
            id: "cust-001",
            name: "Maria Schmidt",
            phone: "+41 79 987 65 43",
        },
        deliveryAddress: {
            street: "Langstrasse 100",
            city: "Zurich",
            postalCode: "8004",
        },
        items: [
            { name: "Jollof Rice", quantity: 2, price: 15.00 },
            { name: "Suya Skewers", quantity: 1, price: 12.00 },
            { name: "Plantain", quantity: 1, price: 5.00 },
        ],
        totalAmount: 47.00,
        deliveryFee: 8.00,
        status: "pending",
        deliveryTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        distanceToRestaurant: "2.3 km",
        distanceToCustomer: "1.5 km",
        createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    },
    {
        id: "order-002",
        orderNumber: "ORD-2024-002",
        restaurant: {
            id: "rest-002",
            name: "Taste of Morocco",
            address: "Europaallee 50",
            city: "Zurich",
            phone: "+41 44 234 56 78",
        },
        customer: {
            id: "cust-002",
            name: "Hans Mueller",
            phone: "+41 79 876 54 32",
        },
        deliveryAddress: {
            street: "Badenerstrasse 250",
            city: "Zurich",
            postalCode: "8004",
        },
        items: [
            { name: "Couscous Royal", quantity: 1, price: 22.00 },
            { name: "Mint Tea", quantity: 2, price: 4.00 },
        ],
        totalAmount: 30.00,
        deliveryFee: 7.50,
        status: "pending",
        deliveryTime: new Date(Date.now() + 5400000).toISOString(), // 1.5 hours from now
        distanceToRestaurant: "3.1 km",
        distanceToCustomer: "2.0 km",
        createdAt: new Date(Date.now() - 900000).toISOString(), // 15 mins ago
    },
    {
        id: "order-003",
        orderNumber: "ORD-2024-003",
        restaurant: {
            id: "rest-003",
            name: "Ethiopian Delights",
            address: "St.ockerstrasse 15",
            city: "Zurich",
            phone: "+41 44 345 67 89",
        },
        customer: {
            id: "cust-003",
            name: "Sarah Weber",
            phone: "+41 79 765 43 21",
        },
        deliveryAddress: {
            street: "Löwenstrasse 50",
            city: "Zurich",
            postalCode: "8001",
        },
        items: [
            { name: "Injera Combo", quantity: 1, price: 25.00 },
            { name: "Wat Doro", quantity: 1, price: 18.00 },
            { name: "Salad", quantity: 1, price: 6.00 },
        ],
        totalAmount: 49.00,
        deliveryFee: 8.00,
        status: "pending",
        deliveryTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
        distanceToRestaurant: "1.8 km",
        distanceToCustomer: "0.8 km",
        createdAt: new Date(Date.now() - 600000).toISOString(), // 10 mins ago
    },
];

export const mockAssignedOrders = [
    {
        id: "order-assigned-001",
        orderNumber: "ORD-2024-004",
        restaurant: {
            id: "rest-001",
            name: "African Spice Kitchen",
            address: "Bahnhofstrasse 25",
            city: "Zurich",
            phone: "+41 44 123 45 67",
        },
        customer: {
            id: "cust-004",
            name: "Peter Brown",
            phone: "+41 79 111 22 33",
        },
        deliveryAddress: {
            street: "Ankerstrasse 80",
            city: "Zurich",
            postalCode: "8004",
        },
        items: [
            { name: "Piri Piri Chicken", quantity: 1, price: 20.00 },
            { name: "Fried Rice", quantity: 1, price: 12.00 },
        ],
        totalAmount: 32.00,
        deliveryFee: 7.50,
        status: "assigned",
        deliveryTime: new Date(Date.now() + 1800000).toISOString(), // 30 mins from now
        distanceToRestaurant: "2.0 km",
        distanceToCustomer: "1.2 km",
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
];

export const mockOrderHistory = [
    {
        id: "order-history-001",
        orderNumber: "ORD-2024-005",
        restaurant: {
            id: "rest-002",
            name: "Taste of Morocco",
            address: "Europaallee 50",
            city: "Zurich",
        },
        customer: {
            id: "cust-005",
            name: "Anna Lee",
        },
        deliveryAddress: {
            street: "Stampfenbachstrasse 40",
            city: "Zurich",
        },
        items: [
            { name: "Tagine Lamb", quantity: 1, price: 28.00 },
        ],
        totalAmount: 35.00,
        deliveryFee: 8.00,
        status: "delivered",
        deliveryTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        deliveredAt: new Date(Date.now() - 7200000).toISOString(),
        earnings: 12.50,
    },
    {
        id: "order-history-002",
        orderNumber: "ORD-2024-006",
        restaurant: {
            id: "rest-003",
            name: "Ethiopian Delights",
            address: "St.ockerstrasse 15",
            city: "Zurich",
        },
        customer: {
            id: "cust-006",
            name: "Tom Smith",
        },
        deliveryAddress: {
            street: "Zürichbergstrasse 20",
            city: "Zurich",
        },
        items: [
            { name: "Kitfo", quantity: 1, price: 22.00 },
            { name: "Injera", quantity: 2, price: 4.00 },
        ],
        totalAmount: 30.00,
        deliveryFee: 7.50,
        status: "delivered",
        deliveryTime: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
        deliveredAt: new Date(Date.now() - 14400000).toISOString(),
        earnings: 11.00,
    },
    {
        id: "order-history-003",
        orderNumber: "ORD-2024-007",
        restaurant: {
            id: "rest-001",
            name: "African Spice Kitchen",
            address: "Bahnhofstrasse 25",
            city: "Zurich",
        },
        customer: {
            id: "cust-007",
            name: "Lisa Johnson",
        },
        deliveryAddress: {
            street: "Klosbachstrasse 10",
            city: "Zurich",
        },
        items: [
            { name: "Egusi Soup", quantity: 1, price: 18.00 },
            { name: "Fufu", quantity: 2, price: 6.00 },
        ],
        totalAmount: 24.00,
        deliveryFee: 7.00,
        status: "delivered",
        deliveryTime: new Date(Date.now() - 28800000).toISOString(), // 8 hours ago
        deliveredAt: new Date(Date.now() - 28800000).toISOString(),
        earnings: 10.00,
    },
];

// Mock Earnings History
export const mockEarningsHistory = [
    { date: "2024-01-28", amount: 125.00 },
    { date: "2024-01-27", amount: 98.50 },
    { date: "2024-01-26", amount: 145.00 },
    { date: "2024-01-25", amount: 87.00 },
    { date: "2024-01-24", amount: 132.00 },
    { date: "2024-01-23", amount: 95.00 },
    { date: "2024-01-22", amount: 110.00 },
];

// Mock Cities/Zones
export const mockCities = [
    { id: "1", name: "Zurich" },
    { id: "2", name: "Basel" },
    { id: "3", name: "Bern" },
    { id: "4", name: "Geneva" },
    { id: "5", name: "Luzern" },
    { id: "6", name: "Olten" },
    { id: "7", name: "Winterthur" },
];

// Helper function to simulate API delay
export const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));
