"use client";

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Save, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

interface ProfileSettingsProps {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
    };
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        email: user.email || ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [saving, setSaving] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            const response = await fetch(`/api/customers/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone
                })
            });

            if (response.ok) {
                // Update localStorage
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const userData = JSON.parse(userStr);
                    userData.firstName = formData.firstName;
                    userData.lastName = formData.lastName;
                    userData.phone = formData.phone;
                    localStorage.setItem('user', JSON.stringify(userData));
                }
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.error?.message || 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters' });
            return;
        }

        setSavingPassword(true);

        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            const response = await fetch(`/api/customers/${user.id}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (response.ok) {
                setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setShowPasswordSection(false);
            } else {
                const data = await response.json();
                setPasswordMessage({ type: 'error', text: data.error?.message || 'Failed to update password' });
            }
        } catch (error) {
            setPasswordMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Settings</h2>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                    <div className={`flex items-center gap-2 p-4 rounded-lg ${
                        message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                        {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {message.text}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+41 XX XXX XX XX"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 transition disabled:opacity-50"
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>

            {/* Password Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
                <button
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                >
                    <Lock size={20} />
                    <span className="font-medium">Change Password</span>
                </button>

                {showPasswordSection && (
                    <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                        {passwordMessage && (
                            <div className={`flex items-center gap-2 p-4 rounded-lg ${
                                passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                                {passwordMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                {passwordMessage.text}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={savingPassword}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                        >
                            <Lock size={20} />
                            {savingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
