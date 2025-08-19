// src/app/super-admin/payouts/components/data.ts

export const payoutsData = {
    RESTAURANTS: [
        { region: 'BASEL', items: [ { name: 'African Restaurant 1', lastPayout: '-', total: '-' }, { name: 'African Restaurant 2', lastPayout: '-', total: '-' }, { name: 'African Restaurant 3', lastPayout: '-', total: '-' }, { name: 'African Restaurant 4', lastPayout: '-', total: '-' } ] },
        { region: 'BERN', items: [{ name: 'African Restaurant 1', lastPayout: '-', total: '-' }] },
        { region: 'LUZERN', items: [ { name: 'African Restaurant 1', lastPayout: '-', total: '-' }, { name: 'African Restaurant 2', lastPayout: '-', total: '-' }, { name: 'African Restaurant 3', lastPayout: '-', total: '-' }, { name: 'African Restaurant 4', lastPayout: '-', total: '-' } ] },
        { region: 'Zürich', items: [ { name: 'African Restaurant 1', lastPayout: '-', total: '-' }, { name: 'African Restaurant 2', lastPayout: '-', total: '-' }, { name: 'African Restaurant 3', lastPayout: '-', total: '-' }, { name: 'African Restaurant 4', lastPayout: '-', total: '-' } ] }
    ],
    'DELIVERY DRIVERS': [
        { region: 'BASEL', items: [ { name: 'Driver 1', lastPayout: '-', total: '-' }, { name: 'Driver 2', lastPayout: '-', total: '-' } ] },
    ],
    'EAT AFRICAN': [
        { region: 'Zürich', items: [ { name: 'Eat African HQ', lastPayout: '-', total: '-' } ] }
    ]
};

export const dailyPayoutsData = [
    { date: '07.07.2025', total: '-' },
    { date: '06.07.2025', total: '-' },
    { date: '05.07.2025', total: '-' },
    { date: '04.07.2025', total: '-' },
];

export const payoutCategories = ['RESTAURANTS', 'DELIVERY DRIVERS', 'EAT AFRICAN'];
