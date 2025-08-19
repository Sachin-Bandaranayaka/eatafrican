// src/app/super-admin/restaurant/components/data.ts

export const allRestaurantData = [
    {
        region: 'BASEL',
        restaurants: [
            {
                name: 'African Restaurant 1',
                address: 'Example Street 1, Basel',
                registrationDate: '01.01.2025',
                status: 'ACTIVE',
                manager: { firstName: 'John', lastName: 'Doe', email: 'john.doe@email.com', phone: '079 123 45 67' },
                fullAddress: { postalCode: '4051', city: 'Basel', street: 'Example Street 1' },
                type: 'Normal Restaurant',
                offering: 'Nigerian',
                logoUrl: '/placeholder.png',
                proofUrl: '/placeholder.png',
                idUrl: '/placeholder.png',
                menu: {
                    'MAIN DISHES': [{ name: 'Meal 1', description: 'Lorem ipsum, lorem ipsum, lorem ipsumLorem ipsum, lorem ipsumLorem ipsum, l', price: '50. Fr.', quantity: 50, threshold: 50, imageUrl: '/placeholder.png' }],
                    'APPETIZERS': [{ name: 'Appetizer 1', description: 'A tasty starting dish.', price: '15. Fr.', quantity: 100, threshold: 50, imageUrl: '/placeholder.png' }],
                },
                activityLog: [
                    { dateTime: '10.05.2025, 18:00 hrs', activity: 'Logged in' },
                    { dateTime: '10.05.2025, 17:30 hrs', activity: 'Changed Password' },
                ]
            },
        ]
    },
];
export const initialSpecialities = ['Eritrean & Ethiopian', 'Kenyan', 'Ghanaian & Nigerian'];
export const initialMenuCategories = ['MAIN DISHES', 'APPETIZERS', 'DRINKS', 'DESSERTS'];
export const initialLocations = ['BASEL', 'BERN', 'LUZERN', 'Zürich'];

// Define a type for a restaurant object for better type-checking
export type Restaurant = typeof allRestaurantData[0]['restaurants'][0];