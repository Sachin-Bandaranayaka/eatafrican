// src/app/super-admin/settings/components/data.ts

export const userAccountsData = [
    {
        id: 1,
        role: 'SUPER ADMIN',
        account: '§æ¢†%', // Placeholder for username
        permissions: 'ALL',
    },
    {
        id: 2,
        role: 'STAFF',
        account: 'staff1',
        permissions: 'Restaurants & Orders',
    },
     {
        id: 3,
        role: 'STAFF',
        account: 'staff2',
        permissions: 'Delivery Drivers',
    },
];

export const locationsToManage = ['Basel', 'Bern', 'Luzern', 'Olten', 'Solothurn'];
export const permissionsToManage = ['Restaurants & Orders', 'Delivery Drivers', 'Earnings & Payouts', 'Customer Accounts'];
