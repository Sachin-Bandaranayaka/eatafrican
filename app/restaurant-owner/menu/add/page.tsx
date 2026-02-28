"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AddMenuItemForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');
    const type = searchParams.get('type') || 'meal'; // 'meal', 'drink', or 'deal'

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        specialPrice: '',
        category: 'Main Dishes',
        mealType: 'Vegan',
        quantity: '1',
        image: null as File | null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const categories = [
        'Main Dishes',
        'Appetizers',
        'Soups',
        'Salads',
        'Desserts',
        'Drinks',
        'Sides'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, files } = e.target as HTMLInputElement;
        if (type === 'file' && files) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');

            if (!token || !restaurantId) {
                throw new Error('Missing authentication or restaurant ID');
            }

            const category = type === 'drink' ? 'drinks' : type === 'deal' ? 'special_deals' : 'meals';
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('specialPrice', formData.specialPrice || '0');
            formDataToSend.append('category', category);
            formDataToSend.append('mealType', formData.mealType);
            formDataToSend.append('quantity', formData.quantity);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const response = await fetch(`/api/restaurants/${restaurantId}/menu`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to add menu item');
            }

            alert('Menu item submitted for review!');
            router.push('/restaurant-owner');
        } catch (err: any) {
            console.error('Error adding menu item:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/eatafricanbck1.png"
                    alt="Background"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            </div>
            <div className="relative z-10 p-4 pt-20">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-amber-50/95 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-amber-900">Add New {type.charAt(0).toUpperCase() + type.slice(1)} Item</h1>
                            <button
                                onClick={() => router.back()}
                                className="text-amber-800 hover:text-amber-900 font-semibold"
                            >
                                ← Back
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Section - Image Upload */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-lg font-bold text-amber-900 mb-4">
                                        {type.charAt(0).toUpperCase() + type.slice(1)} Image
                                    </label>
                                    <div className="w-80 h-80 bg-yellow-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-amber-300">
                                        {formData.image ? (
                                            <img
                                                src={URL.createObjectURL(formData.image)}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <div className="text-4xl text-amber-400 mb-4">📷</div>
                                                <p className="text-amber-700 font-medium">No image selected</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 text-sm text-amber-700 space-y-1">
                                        <p>• Image must be clear, no blur, without text on it</p>
                                        <p>• Image size must be 320 × 320 px</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                        className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                                    >
                                        UPLOAD IMAGE
                                    </button>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Right Section - Text Inputs */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-lg font-bold text-amber-900 mb-2">
                                        {type.charAt(0).toUpperCase() + type.slice(1)} Title
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        maxLength={50}
                                        className="w-full px-4 py-3 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                                        placeholder={`Enter ${type} title...`}
                                    />
                                    <p className="text-sm text-amber-700 mt-1">Max 50 characters</p>
                                </div>

                                <div>
                                    <label className="block text-lg font-bold text-amber-900 mb-2">
                                        {type.charAt(0).toUpperCase() + type.slice(1)} Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        maxLength={250}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 resize-none"
                                        placeholder={`Describe your ${type}...`}
                                    />
                                    <p className="text-sm text-amber-700 mt-1">Max 250 characters</p>
                                </div>
                            </div>

                            {/* Bottom Section - Details & Pricing */}
                            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                                <div>
                                    <label className="block text-lg font-bold text-amber-900 mb-2">
                                        Meal Type
                                    </label>
                                    <select
                                        name="mealType"
                                        value={formData.mealType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                                    >
                                        <option value="Vegan">Vegan</option>
                                        <option value="Vegetarian">Vegetarian</option>
                                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-lg font-bold text-amber-900 mb-2">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        min="1"
                                        className="w-full px-4 py-3 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                                    />
                                    <p className="text-sm text-amber-700 mt-1">Min: 1 Qty</p>
                                </div>

                                <div>
                                    <label className="block text-lg font-bold text-amber-900 mb-2">
                                        Regular Price
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        min="4"
                                        step="0.01"
                                        className="w-full px-4 py-3 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                                        placeholder="4.00"
                                    />
                                    <p className="text-sm text-amber-700 mt-1">Min: 4.-</p>
                                </div>

                                <div>
                                    <label className="block text-lg font-bold text-amber-900 mb-2">
                                        Special Price
                                    </label>
                                    <input
                                        type="number"
                                        name="specialPrice"
                                        value={formData.specialPrice}
                                        onChange={handleChange}
                                        step="0.01"
                                        className="w-full px-4 py-3 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                                        placeholder="Optional"
                                    />
                                    <p className="text-sm text-red-600 mt-1">Offer Period</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="lg:col-span-2 flex gap-4 mt-8">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-amber-900 hover:bg-amber-800 text-white font-bold py-3 px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Submitting...' : 'SUBMIT FOR REVIEW'}
                                </button>
                                <button
                                    type="button"
                                    className="bg-amber-800 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
                                >
                                    SAVE DRAFT
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AddMenuItem() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 pt-20 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        }>
            <AddMenuItemForm />
        </Suspense>
    );
}
