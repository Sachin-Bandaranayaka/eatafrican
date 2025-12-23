"use client";

import { useState, useEffect } from 'react';
import { Gift, Star, Copy, Check, TrendingUp, Clock, Award } from 'lucide-react';

interface LoyaltyData {
    currentBalance: number;
    lifetimePoints: number;
    referralCode: string;
    tier: string;
    transactions: Array<{
        id: string;
        type: 'earned' | 'redeemed' | 'referral_bonus';
        points: number;
        description: string;
        createdAt: string;
    }>;
}

interface LoyaltyPointsProps {
    userId: string;
}

const rewards = [
    { discount: '10% OFF', points: 100, description: 'Get 10% off your next order' },
    { discount: '20% OFF', points: 200, description: 'Get 20% off your next order' },
    { discount: 'CHF 15', points: 300, description: 'CHF 15 off any order over CHF 30' },
    { discount: '50% OFF', points: 500, description: 'Get 50% off your next order' },
];

const tiers = [
    { name: 'Bronze', minPoints: 0, color: 'bg-amber-600', benefits: ['1 point per CHF spent'] },
    { name: 'Silver', minPoints: 500, color: 'bg-gray-400', benefits: ['1.5 points per CHF spent', 'Free delivery on orders over CHF 40'] },
    { name: 'Gold', minPoints: 1000, color: 'bg-yellow-500', benefits: ['2 points per CHF spent', 'Free delivery', 'Priority support'] },
];

export default function LoyaltyPoints({ userId }: LoyaltyPointsProps) {
    const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [redeeming, setRedeeming] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'rewards' | 'history' | 'tiers'>('rewards');

    useEffect(() => {
        fetchLoyaltyData();
    }, [userId]);

    const fetchLoyaltyData = async () => {
        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            const response = await fetch(`/api/customers/${userId}/loyalty`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                const data = await response.json();
                setLoyaltyData(data.loyaltyPoints);
            }
        } catch (error) {
            console.error('Error fetching loyalty data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyReferral = () => {
        if (loyaltyData?.referralCode) {
            navigator.clipboard.writeText(`https://eatafrican.ch?ref=${loyaltyData.referralCode}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRedeem = async (points: number) => {
        if (!loyaltyData || loyaltyData.currentBalance < points) return;
        
        setRedeeming(points);
        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            const response = await fetch(`/api/customers/${userId}/loyalty/redeem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({ points })
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Your voucher code: ${data.voucherCode}\nUse it at checkout!`);
                await fetchLoyaltyData();
            }
        } catch (error) {
            console.error('Error redeeming points:', error);
        } finally {
            setRedeeming(null);
        }
    };

    const getCurrentTier = () => {
        if (!loyaltyData) return tiers[0];
        const lifetime = loyaltyData.lifetimePoints;
        return [...tiers].reverse().find(t => lifetime >= t.minPoints) || tiers[0];
    };

    const getNextTier = () => {
        const current = getCurrentTier();
        const currentIndex = tiers.findIndex(t => t.name === current.name);
        return tiers[currentIndex + 1] || null;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
            </div>
        );
    }

    const currentTier = getCurrentTier();
    const nextTier = getNextTier();
    const progressToNext = nextTier 
        ? ((loyaltyData?.lifetimePoints || 0) - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints) * 100
        : 100;

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Loyalty Points</h2>

            {/* Points Overview */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-red-900 to-red-700 rounded-xl p-6 text-white">
                    <Gift className="w-8 h-8 mb-2 opacity-80" />
                    <p className="text-sm opacity-80">Available Points</p>
                    <p className="text-3xl font-bold">{loyaltyData?.currentBalance || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-amber-400 rounded-xl p-6 text-white">
                    <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
                    <p className="text-sm opacity-80">Lifetime Points</p>
                    <p className="text-3xl font-bold">{loyaltyData?.lifetimePoints || 0}</p>
                </div>
                <div className={`${currentTier.color} rounded-xl p-6 text-white`}>
                    <Award className="w-8 h-8 mb-2 opacity-80" />
                    <p className="text-sm opacity-80">Current Tier</p>
                    <p className="text-3xl font-bold">{currentTier.name}</p>
                </div>
            </div>

            {/* Tier Progress */}
            {nextTier && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">{currentTier.name}</span>
                        <span className="text-gray-600">{nextTier.name}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${currentTier.color} transition-all duration-500`}
                            style={{ width: `${Math.min(progressToNext, 100)}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {nextTier.minPoints - (loyaltyData?.lifetimePoints || 0)} more points to reach {nextTier.name}
                    </p>
                </div>
            )}

            {/* Referral Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6 border border-purple-100">
                <h3 className="font-semibold text-gray-800 mb-2">Refer a Friend</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Share your referral link and earn 50 points when your friend places their first order!
                </p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={`eatafrican.ch?ref=${loyaltyData?.referralCode || ''}`}
                        readOnly
                        className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600"
                    />
                    <button
                        onClick={handleCopyReferral}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                {(['rewards', 'history', 'tiers'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-medium transition border-b-2 -mb-px ${
                            activeTab === tab
                                ? 'text-red-900 border-red-900'
                                : 'text-gray-500 border-transparent hover:text-gray-700'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Rewards Tab */}
            {activeTab === 'rewards' && (
                <div className="grid md:grid-cols-2 gap-4">
                    {rewards.map((reward) => {
                        const canRedeem = (loyaltyData?.currentBalance || 0) >= reward.points;
                        return (
                            <div
                                key={reward.points}
                                className={`p-4 rounded-lg border-2 transition ${
                                    canRedeem
                                        ? 'border-red-200 bg-red-50'
                                        : 'border-gray-200 bg-gray-50 opacity-60'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-800">{reward.discount}</h4>
                                        <p className="text-sm text-gray-500">{reward.description}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-600">
                                        <Star size={16} fill="currentColor" />
                                        <span className="font-bold">{reward.points}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRedeem(reward.points)}
                                    disabled={!canRedeem || redeeming === reward.points}
                                    className={`w-full mt-3 py-2 rounded-lg font-medium transition ${
                                        canRedeem
                                            ? 'bg-red-900 text-white hover:bg-red-800'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {redeeming === reward.points ? 'Redeeming...' : 'Redeem'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="space-y-3">
                    {loyaltyData?.transactions && loyaltyData.transactions.length > 0 ? (
                        loyaltyData.transactions.map((tx) => (
                            <div
                                key={tx.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        tx.type === 'earned' ? 'bg-green-100 text-green-600' :
                                        tx.type === 'redeemed' ? 'bg-red-100 text-red-600' :
                                        'bg-purple-100 text-purple-600'
                                    }`}>
                                        {tx.type === 'earned' ? <TrendingUp size={20} /> :
                                         tx.type === 'redeemed' ? <Gift size={20} /> :
                                         <Star size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{tx.description}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={`font-bold ${
                                    tx.type === 'redeemed' ? 'text-red-600' : 'text-green-600'
                                }`}>
                                    {tx.type === 'redeemed' ? '-' : '+'}{tx.points}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No transactions yet</p>
                        </div>
                    )}
                </div>
            )}

            {/* Tiers Tab */}
            {activeTab === 'tiers' && (
                <div className="space-y-4">
                    {tiers.map((tier) => {
                        const isCurrentTier = tier.name === currentTier.name;
                        return (
                            <div
                                key={tier.name}
                                className={`p-4 rounded-lg border-2 ${
                                    isCurrentTier ? 'border-red-900 bg-red-50' : 'border-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 ${tier.color} rounded-full flex items-center justify-center text-white`}>
                                        <Award size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{tier.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            {tier.minPoints}+ lifetime points
                                        </p>
                                    </div>
                                    {isCurrentTier && (
                                        <span className="ml-auto px-3 py-1 bg-red-900 text-white text-sm rounded-full">
                                            Current
                                        </span>
                                    )}
                                </div>
                                <ul className="space-y-1">
                                    {tier.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                            <Check size={16} className="text-green-500" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
