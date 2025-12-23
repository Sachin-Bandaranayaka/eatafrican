"use client";

import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, Check, X, ToggleLeft, ToggleRight } from 'lucide-react';

interface City {
    id: string;
    name: string;
    displayOrder: number;
    isActive: boolean;
    deliveryZones?: string[];
    createdAt: string;
}

export function CityManagement() {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCity, setEditingCity] = useState<City | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        displayOrder: 0,
        isActive: true,
        deliveryZones: ''
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('/api/admin/cities', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setCities(data.cities || data || []);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            const url = editingCity
                ? `/api/admin/cities/${editingCity.id}`
                : '/api/admin/cities';

            const response = await fetch(url, {
                method: editingCity ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    display_order: formData.displayOrder,
                    is_active: formData.isActive,
                    delivery_zones: formData.deliveryZones.split(',').map(z => z.trim()).filter(Boolean)
                })
            });

            if (response.ok) {
                await fetchCities();
                resetForm();
            } else {
                const data = await response.json();
                setError(data.error?.message || 'Failed to save city');
            }
        } catch (error) {
            setError('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (cityId: string) => {
        if (!confirm('Are you sure you want to delete this city?')) return;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/admin/cities/${cityId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setCities(cities.filter(c => c.id !== cityId));
            }
        } catch (error) {
            console.error('Error deleting city:', error);
        }
    };

    const handleToggleActive = async (city: City) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/admin/cities/${city.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ is_active: !city.isActive })
            });

            if (response.ok) {
                setCities(cities.map(c =>
                    c.id === city.id ? { ...c, isActive: !c.isActive } : c
                ));
            }
        } catch (error) {
            console.error('Error toggling city status:', error);
        }
    };

    const startEdit = (city: City) => {
        setFormData({
            name: city.name,
            displayOrder: city.displayOrder,
            isActive: city.isActive,
            deliveryZones: city.deliveryZones?.join(', ') || ''
        });
        setEditingCity(city);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({ name: '', displayOrder: 0, isActive: true, deliveryZones: '' });
        setEditingCity(null);
        setShowForm(false);
        setError(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">City Management</h2>
                    <p className="text-gray-500">Manage delivery cities and zones</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800"
                    >
                        <Plus size={20} />
                        Add City
                    </button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
                    <h3 className="font-semibold text-gray-800 mb-4">
                        {editingCity ? 'Edit City' : 'Add New City'}
                    </h3>
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    value={formData.displayOrder}
                                    onChange={(e) => setFormData(p => ({ ...p, displayOrder: parseInt(e.target.value) }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Delivery Zones (comma-separated postal codes)
                            </label>
                            <input
                                type="text"
                                value={formData.deliveryZones}
                                onChange={(e) => setFormData(p => ({ ...p, deliveryZones: e.target.value }))}
                                placeholder="8000, 8001, 8002..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData(p => ({ ...p, isActive: e.target.checked }))}
                                className="w-4 h-4 text-red-900 rounded"
                            />
                            <label htmlFor="isActive" className="text-sm text-gray-700">
                                Active (available for delivery)
                            </label>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : editingCity ? 'Update City' : 'Add City'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Cities List */}
            {cities.length === 0 ? (
                <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No cities configured</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">City</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Delivery Zones</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cities.map((city) => (
                                <tr key={city.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={18} className="text-gray-400" />
                                            <span className="font-medium text-gray-800">{city.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{city.displayOrder}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {city.deliveryZones?.slice(0, 3).map((zone, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                                    {zone}
                                                </span>
                                            ))}
                                            {city.deliveryZones && city.deliveryZones.length > 3 && (
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                                    +{city.deliveryZones.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleToggleActive(city)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                city.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {city.isActive ? (
                                                <>
                                                    <ToggleRight size={14} />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <ToggleLeft size={14} />
                                                    Inactive
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(city)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(city.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
