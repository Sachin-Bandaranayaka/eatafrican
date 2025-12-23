"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, Mail, Shield, Trash2, Check, X, ArrowLeft } from 'lucide-react';

interface TeamMember {
    id: string;
    userId: string;
    role: 'manager' | 'staff';
    status: 'pending' | 'active' | 'inactive';
    user: {
        email: string;
        firstName: string;
        lastName: string;
    };
    createdAt: string;
}

export default function TeamManagement() {
    const router = useRouter();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', role: 'staff' as 'manager' | 'staff' });
    const [inviting, setInviting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const userStr = localStorage.getItem('user');

            if (!token || !userStr) {
                router.push('/');
                return;
            }

            const userData = JSON.parse(userStr);

            // Fetch restaurant
            const restResponse = await fetch(`/api/restaurants?ownerId=${userData.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (restResponse.ok) {
                const restData = await restResponse.json();
                if (restData.restaurants && restData.restaurants.length > 0) {
                    const rest = restData.restaurants[0];
                    setRestaurant(rest);

                    // Fetch team members
                    const teamResponse = await fetch(`/api/restaurants/${rest.id}/team`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (teamResponse.ok) {
                        const teamData = await teamResponse.json();
                        setTeamMembers(teamData.members || []);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!restaurant) return;

        setInviting(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const response = await fetch(`/api/restaurants/${restaurant.id}/team`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(inviteData)
            });

            if (response.ok) {
                await fetchData();
                setShowInviteForm(false);
                setInviteData({ email: '', role: 'staff' });
            } else {
                const data = await response.json();
                setError(data.error?.message || 'Failed to invite team member');
            }
        } catch (error) {
            setError('An error occurred');
        } finally {
            setInviting(false);
        }
    };

    const handleRemove = async (memberId: string) => {
        if (!confirm('Are you sure you want to remove this team member?')) return;

        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const response = await fetch(`/api/restaurants/${restaurant.id}/team/${memberId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setTeamMembers(teamMembers.filter(m => m.id !== memberId));
            }
        } catch (error) {
            console.error('Error removing team member:', error);
        }
    };

    const handleUpdateRole = async (memberId: string, newRole: 'manager' | 'staff') => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const response = await fetch(`/api/restaurants/${restaurant.id}/team/${memberId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (response.ok) {
                setTeamMembers(teamMembers.map(m =>
                    m.id === memberId ? { ...m, role: newRole } : m
                ));
            }
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 pt-20">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
                                <p className="text-gray-500">Manage your restaurant team members</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowInviteForm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800"
                        >
                            <Plus size={20} />
                            Invite Member
                        </button>
                    </div>

                    {/* Invite Form */}
                    {showInviteForm && (
                        <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
                            <h3 className="font-semibold text-gray-800 mb-4">Invite Team Member</h3>
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleInvite} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={inviteData.email}
                                            onChange={(e) => setInviteData(p => ({ ...p, email: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Role
                                        </label>
                                        <select
                                            value={inviteData.role}
                                            onChange={(e) => setInviteData(p => ({ ...p, role: e.target.value as any }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 text-gray-900"
                                        >
                                            <option value="staff">Staff</option>
                                            <option value="manager">Manager</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={inviting}
                                        className="px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 disabled:opacity-50"
                                    >
                                        {inviting ? 'Sending...' : 'Send Invite'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowInviteForm(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Team Members List */}
                    {teamMembers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No team members yet</p>
                            <p className="text-sm text-gray-400">Invite team members to help manage your restaurant</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {teamMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                            <span className="text-lg font-bold text-gray-600">
                                                {member.user.firstName?.[0]}{member.user.lastName?.[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {member.user.firstName} {member.user.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500">{member.user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <select
                                            value={member.role}
                                            onChange={(e) => handleUpdateRole(member.id, e.target.value as any)}
                                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900"
                                        >
                                            <option value="staff">Staff</option>
                                            <option value="manager">Manager</option>
                                        </select>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            member.status === 'active' ? 'bg-green-100 text-green-700' :
                                            member.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {member.status}
                                        </span>
                                        <button
                                            onClick={() => handleRemove(member.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Role Permissions Info */}
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Role Permissions</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-medium text-blue-700">Manager</p>
                                <ul className="text-blue-600 mt-1 space-y-1">
                                    <li>• View and manage orders</li>
                                    <li>• Edit menu items</li>
                                    <li>• View analytics</li>
                                    <li>• Manage team members</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-medium text-blue-700">Staff</p>
                                <ul className="text-blue-600 mt-1 space-y-1">
                                    <li>• View and update orders</li>
                                    <li>• View menu items</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
