"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RestaurantSettings() {
    const router = useRouter();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        region: '',
        minOrderAmount: '24',
        openingHours: {
            monday: { open: '11:00', close: '22:00' },
            tuesday: { open: '11:00', close: '22:00' },
            wednesday: { open: '11:00', close: '22:00' },
            thursday: { open: '11:00', close: '22:00' },
            friday: { open: '11:00', close: '22:00' },
            saturday: { open: '11:00', close: '22:00' },
            sunday: { open: '11:00', close: '22:00' }
        }
    });

    useEffect(() => {
        fetchRestaurant();
    }, []);

    const fetchRestaurant = async () => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const userStr = localStorage.getItem('user');

            if (!token || !userStr) {
                router.push('/');
                return;
            }

            const userData = JSON.parse(userStr);

            // Fetch restaurant
            const response = await fetch(`/api/restaurants?ownerId=${userData.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.restaurants && data.restaurants.length > 0) {
                    const restaurantId = data.restaurants[0].id;
                    
                    // Fetch full details
                    const detailsResponse = await fetch(`/api/restaurants/${restaurantId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    if (detailsResponse.ok) {
                        const detailsData = await detailsResponse.json();
                        const rest = detailsData.restaurant || detailsData;
                        setRestaurant(rest);
                        
                        // Populate form
                        setFormData({
                            name: rest.name || '',
                            description: rest.description || '',
                            phone: rest.phone || '',
                            email: rest.email || '',
                            address: rest.address || '',
                            city: rest.city || '',
                            postalCode: rest.postalCode || '',
                            region: rest.region || '',
                            minOrderAmount: String(rest.minOrderAmount || 24),
                            openingHours: rest.openingHours || formData.openingHours
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching restaurant:', error);
            setError('Failed to load restaurant data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleHoursChange = (day: string, field: 'open' | 'close', value: string) => {
        setFormData(prev => ({
            ...prev,
            openingHours: {
                ...prev.openingHours,
                [day]: {
                    ...prev.openingHours[day as keyof typeof prev.openingHours],
                    [field]: value
                }
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');

            if (!token || !restaurant) {
                throw new Error('Missing authentication or restaurant data');
            }

            const response = await fetch(`/api/restaurants/${restaurant.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    phone: formData.phone,
                    email: formData.email,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    region: formData.region,
                    minOrderAmount: parseFloat(formData.minOrderAmount),
                    openingHours: formData.openingHours
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to update restaurant');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/restaurant-owner');
            }, 2000);
        } catch (err: any) {
            console.error('Error updating restaurant:', err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 pt-20">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="bg-white rounded-lg shadow-lg p-8 relative z-20">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Restaurant Settings</h1>
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            ← Back
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                            Settings updated successfully! Redirecting...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Restaurant Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Min Order Amount (CHF) *</label>
                                    <input
                                        type="number"
                                        name="minOrderAmount"
                                        value={formData.minOrderAmount}
                                        onChange={handleChange}
                                        required
                                        step="0.50"
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                                />
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Address</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Street Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Postal Code *</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Region *</label>
                                        <input
                                            type="text"
                                            name="region"
                                            value={formData.region}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Opening Hours */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Opening Hours</h2>
                            <div className="space-y-3">
                                {Object.entries(formData.openingHours).map(([day, hours]) => (
                                    <div key={day} className="grid grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-bold text-gray-700 capitalize">{day}</label>
                                        <input
                                            type="time"
                                            value={hours.open}
                                            onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                                        />
                                        <input
                                            type="time"
                                            value={hours.close}
                                            onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-red-900 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
