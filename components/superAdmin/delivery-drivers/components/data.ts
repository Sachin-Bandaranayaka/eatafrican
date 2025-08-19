// src/app/super-admin/delivery-drivers/components/data.ts

export const allDriverData = [
    {
        region: 'BASEL',
        drivers: [
            {
                id: 1,
                name: 'Driver 1',
                address: 'Kaice 43, Zurich',
                registrationDate: '01.05.2025',
                status: 'ACTIVE',
                personalInfo: { firstName: 'John', lastName: 'Dankbarkeit', email: 'john@gmail.com', phone: '079 412 76 98' },
                fullAddress: { postalCode: '4210', city: 'Zurich', street: 'Kaice 43' },
                profilePictureUrl: '/placeholder.png',
                licenseUrl: '/placeholder.png',
                activityLog: [
                    { dateTime: '10.05.2025, 18:00 hrs', activity: 'Logged in' },
                    { dateTime: '10.05.2025, 17:30 hrs', activity: 'Changed Password' },
                    { dateTime: '10.05.2025, 15:45 hrs', activity: 'Payout Settings changed to everyday' },
                ]
            },
            {
                id: 2,
                name: 'Driver 2',
                address: 'Example St 2, Basel',
                registrationDate: '02.05.2025',
                status: 'ACTIVE',
                personalInfo: { firstName: 'Jane', lastName: 'Smith', email: 'jane.s@email.com', phone: '078 987 65 43' },
                fullAddress: { postalCode: '4052', city: 'Basel', street: 'Example St 2' },
                profilePictureUrl: '/placeholder.png',
                licenseUrl: '/placeholder.png',
                activityLog: []
            },
            {
                id: 3,
                name: 'Driver 3',
                address: 'Example St 3, Basel',
                registrationDate: '03.05.2025',
                status: 'INACTIVE',
                personalInfo: { firstName: 'Peter', lastName: 'Jones', email: 'peter.j@email.com', phone: '077 111 22 33' },
                fullAddress: { postalCode: '4053', city: 'Basel', street: 'Example St 3' },
                profilePictureUrl: '/placeholder.png',
                licenseUrl: '/placeholder.png',
                activityLog: []
            },
        ]
    },
    {
        region: 'BERN',
        drivers: [
             {
                id: 4,
                name: 'Driver 1',
                address: 'Example St 4, Bern',
                registrationDate: '04.05.2025',
                status: 'ACTIVE',
                personalInfo: { firstName: 'Susan', lastName: 'Miller', email: 'susan.m@email.com', phone: '076 444 55 66' },
                fullAddress: { postalCode: '3000', city: 'Bern', street: 'Example St 4' },
                profilePictureUrl: '/placeholder.png',
                licenseUrl: '/placeholder.png',
                activityLog: []
             },
        ]
    },
    {
        region: 'LUZERN',
        drivers: [
             {
                id: 5,
                name: 'Driver 1',
                address: 'Example St 5, Luzern',
                registrationDate: '05.05.2025',
                status: 'NEW REGISTRATION',
                personalInfo: { firstName: 'Tom', lastName: 'Wilson', email: 'tom.w@email.com', phone: '079 777 88 99' },
                fullAddress: { postalCode: '6000', city: 'Luzern', street: 'Example St 5' },
                profilePictureUrl: '/placeholder.png',
                licenseUrl: '/placeholder.png',
                activityLog: []
             },
             {
                id: 6,
                name: 'Driver 2',
                address: 'Example St 6, Luzern',
                registrationDate: '06.05.2025',
                status: 'ACTIVE',
                personalInfo: { firstName: 'Linda', lastName: 'Brown', email: 'linda.b@email.com', phone: '078 222 33 44' },
                fullAddress: { postalCode: '6002', city: 'Luzern', street: 'Example St 6' },
                profilePictureUrl: '/placeholder.png',
                licenseUrl: '/placeholder.png',
                activityLog: []
             },
        ]
    },
     {
        region: 'ZÜRICH',
        drivers: [
             {
                id: 7,
                name: 'Driver 1',
                address: 'Example St 7, Zürich',
                registrationDate: '07.05.2025',
                status: 'ACTIVE',
                personalInfo: { firstName: 'David', lastName: 'Garcia', email: 'david.g@email.com', phone: '077 555 66 77' },
                fullAddress: { postalCode: '8001', city: 'Zürich', street: 'Example St 7' },
                profilePictureUrl: '/placeholder.png',
                licenseUrl: '/placeholder.png',
                activityLog: []
             },
             {
                id: 8,
                name: 'Driver 2',
                address: 'Example St 8, Zürich',
                registrationDate: '08.05.2025',
                status: 'INACTIVE',
                personalInfo: { firstName: 'Maria', lastName: 'Martinez', email: 'maria.m@email.com', phone: '076 888 99 00' },
                fullAddress: { postalCode: '8002', city: 'Zürich', street: 'Example St 8' },
                profilePictureUrl: '/placeholder.png',
                licenseUrl: '/placeholder.png',
                activityLog: []
             },
        ]
    },
];

// Define a type for a single driver for better type-checking
export type Driver = typeof allDriverData[0]['drivers'][0];
