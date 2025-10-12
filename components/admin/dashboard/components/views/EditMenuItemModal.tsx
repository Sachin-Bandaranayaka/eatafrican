"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface EditMenuItemModalProps {
    item: any;
    restaurantId: string;
    onClose: () => void;
    onSave: () => void;
}

const EditMenuItemModal = ({ item, restaurantId, onClose, onSave }: EditMenuItemModalProps) => {
    const [formData, setFormData] = useState({
        name: item.name || '',
        description: item.description || '',
        price: item.price || 0,
        category: item.category || 'meals',
        mealCategory: item.mealCategory || 'Main Dishes',
        quantity: item.quantity || 0,
        status: item.status || 'active',
        dietaryTags: item.dietaryTags || []
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

    const dietaryOptions = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleDietaryTagToggle = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            dietaryTags: prev.dietaryTags.includes(tag)
                ? prev.dietaryTags.filter((t: string) => t !== tag)
                : [...prev.dietaryTags, tag]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');

            const payload = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price.toString()),
                category: formData.category,
                mealCategory: formData.mealCategory,
                quantity: parseInt(formData.quantity.toString()),
                status: formData.status,
                dietaryTags: formData.dietaryTags
            };

            const response = await fetch(`/api/restaurants/${restaurantId}/menu/${item.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to update menu item');
            }

            alert('Menu item updated successfully!');
            onSave();
            onClose();
        } catch (err: any) {
            console.error('Error updating menu item:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Edit Menu Item</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <X size={24} />
                    </button>
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Item Name *
                        </label>
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
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Price (CHF) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                step="0.50"
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Quantity *
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Category *
                        </label>
                        <select
                            name="mealCategory"
                            value={formData.mealCategory}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Status *
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 bg-white"
                        >
                            <option value="active">Active (LIVE)</option>
                            <option value="inactive">Inactive (OFFLINE)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Dietary Tags
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {dietaryOptions.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => handleDietaryTagToggle(tag)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${formData.dietaryTags.includes(tag)
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-red-900 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-3 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMenuItemModal;
