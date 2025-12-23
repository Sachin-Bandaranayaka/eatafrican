"use client";

import { useState, useEffect } from 'react';
import { Ticket, Plus, Edit2, Trash2, Copy, Check, Calendar, Percent, DollarSign } from 'lucide-react';

interface Voucher {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
    minOrderAmount: number | null;
    maxDiscountAmount: number | null;
    usageLimit: number | null;
    usageCount: number;
    validFrom: string | null;
    validUntil: string | null;
    status: 'active' | 'inactive' | 'expired';
    createdAt: string;
}

export function VoucherManagement() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage' as 'percentage' | 'fixed_amount',
        discountValue: 10,
        minOrderAmount: '',
        maxDiscountAmount: '',
        usageLimit: '',
        validFrom: '',
        validUntil: '',
        status: 'active' as 'active' | 'inactive'
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('/api/admin/vouchers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setVouchers(data.vouchers || []);
            }
        } catch (error) {
            console.error('Error fetching vouchers:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'EAT';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData(p => ({ ...p, code }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            const url = editingVoucher
                ? `/api/admin/vouchers/${editingVoucher.id}`
                : '/api/admin/vouchers';

            const response = await fetch(url, {
                method: editingVoucher ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    code: formData.code.toUpperCase(),
                    discount_type: formData.discountType,
                    discount_value: formData.discountValue,
                    min_order_amount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
                    max_discount_amount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
                    usage_limit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
                    valid_from: formData.validFrom || null,
                    valid_until: formData.validUntil || null,
                    status: formData.status
                })
            });

            if (response.ok) {
                await fetchVouchers();
                resetForm();
            } else {
                const data = await response.json();
                setError(data.error?.message || 'Failed to save voucher');
            }
        } catch (error) {
            setError('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (voucherId: string) => {
        if (!confirm('Are you sure you want to delete this voucher?')) return;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/admin/vouchers/${voucherId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setVouchers(vouchers.filter(v => v.id !== voucherId));
            }
        } catch (error) {
            console.error('Error deleting voucher:', error);
        }
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const startEdit = (voucher: Voucher) => {
        setFormData({
            code: voucher.code,
            discountType: voucher.discountType,
            discountValue: voucher.discountValue,
            minOrderAmount: voucher.minOrderAmount?.toString() || '',
            maxDiscountAmount: voucher.maxDiscountAmount?.toString() || '',
            usageLimit: voucher.usageLimit?.toString() || '',
            validFrom: voucher.validFrom?.split('T')[0] || '',
            validUntil: voucher.validUntil?.split('T')[0] || '',
            status: voucher.status === 'expired' ? 'inactive' : voucher.status
        });
        setEditingVoucher(voucher);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            code: '',
            discountType: 'percentage',
            discountValue: 10,
            minOrderAmount: '',
            maxDiscountAmount: '',
            usageLimit: '',
            validFrom: '',
            validUntil: '',
            status: 'active'
        });
        setEditingVoucher(null);
        setShowForm(false);
        setError(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'inactive': return 'bg-gray-100 text-gray-700';
            case 'expired': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
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
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Voucher Management</h2>
                    <p className="text-gray-500">Create and manage discount vouchers</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800"
                    >
                        <Plus size={20} />
                        Create Voucher
                    </button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
                    <h3 className="font-semibold text-gray-800 mb-4">
                        {editingVoucher ? 'Edit Voucher' : 'Create New Voucher'}
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
                                    Voucher Code *
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900 uppercase"
                                        required
                                        placeholder="EATXXX"
                                    />
                                    <button
                                        type="button"
                                        onClick={generateCode}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as any }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Discount Type *
                                </label>
                                <select
                                    value={formData.discountType}
                                    onChange={(e) => setFormData(p => ({ ...p, discountType: e.target.value as any }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed_amount">Fixed Amount (CHF)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Discount Value *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData(p => ({ ...p, discountValue: parseFloat(e.target.value) }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900"
                                        required
                                        min="0"
                                        step={formData.discountType === 'percentage' ? '1' : '0.5'}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        {formData.discountType === 'percentage' ? '%' : 'CHF'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Minimum Order Amount (CHF)
                                </label>
                                <input
                                    type="number"
                                    value={formData.minOrderAmount}
                                    onChange={(e) => setFormData(p => ({ ...p, minOrderAmount: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900"
                                    min="0"
                                    step="0.5"
                                    placeholder="No minimum"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Discount Amount (CHF)
                                </label>
                                <input
                                    type="number"
                                    value={formData.maxDiscountAmount}
                                    onChange={(e) => setFormData(p => ({ ...p, maxDiscountAmount: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900"
                                    min="0"
                                    step="0.5"
                                    placeholder="No maximum"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Usage Limit
                                </label>
                                <input
                                    type="number"
                                    value={formData.usageLimit}
                                    onChange={(e) => setFormData(p => ({ ...p, usageLimit: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900"
                                    min="1"
                                    placeholder="Unlimited"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valid From
                                </label>
                                <input
                                    type="date"
                                    value={formData.validFrom}
                                    onChange={(e) => setFormData(p => ({ ...p, validFrom: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valid Until
                                </label>
                                <input
                                    type="date"
                                    value={formData.validUntil}
                                    onChange={(e) => setFormData(p => ({ ...p, validUntil: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : editingVoucher ? 'Update Voucher' : 'Create Voucher'}
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

            {/* Vouchers List */}
            {vouchers.length === 0 ? (
                <div className="text-center py-12">
                    <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No vouchers created</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Code</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Discount</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Usage</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Validity</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((voucher) => (
                                <tr key={voucher.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-gray-800">{voucher.code}</span>
                                            <button
                                                onClick={() => handleCopyCode(voucher.code)}
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                            >
                                                {copiedCode === voucher.code ? (
                                                    <Check size={14} className="text-green-500" />
                                                ) : (
                                                    <Copy size={14} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-1">
                                            {voucher.discountType === 'percentage' ? (
                                                <Percent size={14} className="text-gray-400" />
                                            ) : (
                                                <DollarSign size={14} className="text-gray-400" />
                                            )}
                                            <span className="text-gray-800">
                                                {voucher.discountValue}
                                                {voucher.discountType === 'percentage' ? '%' : ' CHF'}
                                            </span>
                                        </div>
                                        {voucher.minOrderAmount && (
                                            <p className="text-xs text-gray-500">
                                                Min: CHF {voucher.minOrderAmount}
                                            </p>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">
                                        {voucher.usageCount}
                                        {voucher.usageLimit && ` / ${voucher.usageLimit}`}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        {voucher.validFrom || voucher.validUntil ? (
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} className="text-gray-400" />
                                                <span>
                                                    {voucher.validFrom?.split('T')[0] || '∞'} - {voucher.validUntil?.split('T')[0] || '∞'}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">No expiry</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(voucher.status)}`}>
                                            {voucher.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(voucher)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(voucher.id)}
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
