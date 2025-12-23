"use client";

import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, Star, X, Save } from 'lucide-react';

interface Address {
    id: string;
    label: string;
    street: string;
    city: string;
    postalCode: string;
    region?: string;
    isDefault: boolean;
    type: 'home' | 'work' | 'other';
}

interface SavedAddressesProps {
    userId: string;
}

export default function SavedAddresses({ userId }: SavedAddressesProps) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        label: '',
        street: '',
        city: '',
        postalCode: '',
        region: '',
        type: 'home' as 'home' | 'work' | 'other',
        isDefault: false
    });

    useEffect(() => {
        fetchAddresses();
    }, [userId]);

    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            const response = await fetch(`/api/customers/${userId}/addresses`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAddresses(data.addresses || []);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            const url = editingAddress
                ? `/api/customers/${userId}/addresses/${editingAddress.id}`
                : `/api/customers/${userId}/addresses`;
            
            const response = await fetch(url, {
                method: editingAddress ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchAddresses();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving address:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (addressId: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            const response = await fetch(`/api/customers/${userId}/addresses/${addressId}`, {
                method: 'DELETE',
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                setAddresses(addresses.filter(a => a.id !== addressId));
            }
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const handleSetDefault = async (addressId: string) => {
        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            const response = await fetch(`/api/customers/${userId}/addresses/${addressId}/default`, {
                method: 'PUT',
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                setAddresses(addresses.map(a => ({
                    ...a,
                    isDefault: a.id === addressId
                })));
            }
        } catch (error) {
            console.error('Error setting default address:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            label: '',
            street: '',
            city: '',
            postalCode: '',
            region: '',
            type: 'home',
            isDefault: false
        });
        setEditingAddress(null);
        setShowForm(false);
    };

    const startEdit = (address: Address) => {
        setFormData({
            label: address.label,
            street: address.street,
            city: address.city,
            postalCode: address.postalCode,
            region: address.region || '',
            type: address.type,
            isDefault: address.isDefault
        });
        setEditingAddress(address);
        setShowForm(true);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'home': return Home;
            case 'work': return Briefcase;
            default: return MapPin;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Saved Addresses</h2>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition"
                    >
                        <Plus size={20} />
                        Add Address
                    </button>
                )}
            </div>

            {showForm && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Label (e.g., "My Home")
                                </label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData(p => ({ ...p, label: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData(p => ({ ...p, type: e.target.value as any }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900"
                                >
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Street Address
                            </label>
                            <input
                                type="text"
                                value={formData.street}
                                onChange={(e) => setFormData(p => ({ ...p, street: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900"
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData(p => ({ ...p, postalCode: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Region/Canton
                                </label>
                                <input
                                    type="text"
                                    value={formData.region}
                                    onChange={(e) => setFormData(p => ({ ...p, region: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData(p => ({ ...p, isDefault: e.target.checked }))}
                                className="w-4 h-4 text-red-900 rounded focus:ring-red-900"
                            />
                            <label htmlFor="isDefault" className="text-sm text-gray-700">
                                Set as default address
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition disabled:opacity-50"
                            >
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save Address'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {addresses.length === 0 ? (
                <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No saved addresses yet</p>
                    <p className="text-sm text-gray-400 mt-1">Add an address for faster checkout</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map((address) => {
                        const TypeIcon = getTypeIcon(address.type);
                        return (
                            <div
                                key={address.id}
                                className={`p-4 rounded-lg border-2 transition ${
                                    address.isDefault
                                        ? 'border-red-900 bg-red-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <TypeIcon className={`w-5 h-5 ${address.isDefault ? 'text-red-900' : 'text-gray-500'}`} />
                                        <span className="font-semibold text-gray-800">{address.label}</span>
                                        {address.isDefault && (
                                            <span className="px-2 py-0.5 bg-red-900 text-white text-xs rounded-full">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => startEdit(address)}
                                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(address.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm">{address.street}</p>
                                <p className="text-gray-600 text-sm">
                                    {address.postalCode} {address.city}
                                    {address.region && `, ${address.region}`}
                                </p>
                                {!address.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(address.id)}
                                        className="flex items-center gap-1 mt-3 text-sm text-red-900 hover:text-red-700"
                                    >
                                        <Star size={14} />
                                        Set as default
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
