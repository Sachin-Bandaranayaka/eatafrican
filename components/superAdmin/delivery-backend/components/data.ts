// src/app/super-admin/delivery-backend/components/data.ts

export const deliveryRadiusData = [
    {
        radius: 15,
        details: {
            "Delivery Time": "45 - 90 minutes",
            "Delivery Fee": "CHF 4.00",
            "Minimum Order": "CHF 25.00",
        },
        schedule: {
            days: "Mon - Sun",
            slots: [
                "11:30 to 12:30",
                "13:00 to 14:00",
                "14:30 to 15:30",
                "16:00 to 17:00",
                "17:30 to 18:30",
                "19:00 to 20:00",
                "20:30 to 21:30",
                "22:00 to 23:00",
            ]
        }
    },
    {
        radius: 30,
        details: {
            "Delivery Time": "1 - 2 hours",
            "Delivery Fee": "CHF 8.00",
            "Minimum Order": "CHF 25.00",
        },
        schedule: {
            days: "Mon - Sun",
            slots: [
                "11:30 to 12:30",
                "13:15 to 14:15",
                "15:00 to 16:00",
                "17:45 to 18:45",
                "19:30 to 20:30",
                "21:15 to 22:15",
            ]
        }
    },
    {
        radius: 50,
        details: {
            "Delivery Time": "2 - 3 hours",
            "Delivery Fee": "CHF 12.00",
            "Minimum Order": "CHF 50.00",
        },
        schedule: {
            days: "Mon - Fri",
            slots: [
                "11:30 to 12:30",
                "14:00 to 15:00",
                "16:00 to 17:00",
                "18:00 to 19:00",
                "20:00 to 21:00",
                "22:00 to 23:00",
            ]
        }
    },
    {
        radius: 70,
        details: {
            "Delivery Time": "3 - 4 hours",
            "Delivery Fee": "CHF 18.00",
            "Minimum Order": "CHF 50.00",
        },
        schedule: {
            days: "Mon - Fri",
            slots: [
                "11:30 to 12:30",
                "14:30 to 15:30",
                "17:30 to 18:30",
                "19:30 to 20:30",
                "21:30 to 22:30",
            ]
        }
    },
    {
        radius: 100,
        details: {
            "Delivery Time": "4 - 5 hours",
            "Delivery Fee": "CHF 24.00",
            "Minimum Order": "CHF 70.00",
        },
        schedule: {
            days: "Mon - Fri",
            slots: [
                "11:30 to 12:30",
                "16:30 to 17:30",
                "22:30 to 23:30",
            ]
        }
    },
];
