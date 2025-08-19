// src/app/super-admin/earnings/components/data.ts

export const earningsData = {
    RESTAURANT: [
        { region: 'BASEL', items: [ { name: 'African Restaurant 1', total: '-' }, { name: 'African Restaurant 2', total: '-' }, { name: 'African Restaurant 3', total: '-' }, { name: 'African Restaurant 4', total: '-' } ] },
        { region: 'BERN', items: [{ name: 'African Restaurant 1', total: '-' }] },
        { region: 'LUZERN', items: [ { name: 'African Restaurant 1', total: '-' }, { name: 'African Restaurant 2', total: '-' }, { name: 'African Restaurant 3', total: '-' }, { name: 'African Restaurant 4', total: '-' } ] },
        { region: 'Zürich', items: [ { name: 'African Restaurant 1', total: '-' }, { name: 'African Restaurant 2', total: '-' }, { name: 'African Restaurant 3', total: '-' }, { name: 'African Restaurant 4', total: '-' } ] }
    ],
    DRIVER: [
        { region: 'BASEL', items: [ { name: 'Driver 1', total: '-' }, { name: 'Driver 2', total: '-' } ] },
        { region: 'BERN', items: [{ name: 'Driver 3', total: '-' }] },
        { region: 'Zürich', items: [ { name: 'Driver 4', total: '-' }, { name: 'Driver 5', total: '-' } ] }
    ]
};

export const dailyEarningsData = [
    { date: '03.07.2025', total: '-' }, { date: '03.07.2025', total: '-' },
    { date: '03.07.2025', total: '-' }, { date: '03.07.2025', total: '-' },
    { date: '03.07.2025', total: '-' }, { date: '03.07.2025', total: '-' },
    { date: '03.07.2025', total: '-' }, { date: '03.07.2025', total: '-' },
];

export const earningsCategories = ['RESTAURANT', 'DRIVER'];
