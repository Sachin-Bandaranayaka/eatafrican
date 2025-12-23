"use client";

import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, ExternalLink } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

interface FavoriteItem {
    id: string;
    menuItemId: string;
    menuItem: {
        id: string;
        name: string;
        description: string;
        price: number;
        imageUrl?: string;
        restaurantId: string;
    };
    restaurant: {
        id: string;
        name: string;
        logoUrl?: string;
    };
    createdAt: string;
}

interface FavoriteItemsProps {
    userId: string;
}

export default function FavoriteItems({ userId }: FavoriteItemsProps) {
    const { addItem } = useCart();
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        fetchFavorites();
    }, [userId]);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            const response = await fetch(`/api/customers/${userId}/favorites`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFavorites(data.favorites || []);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (menuItemId: string) => {
        setRemovingId(menuItemId);
        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            const response = await fetch(`/api/customers/${userId}/favorites/${menuItemId}`, {
                method: 'DELETE',
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                setFavorites(favorites.filter(f => f.menuItemId !== menuItemId));
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
        } finally {
            setRemovingId(null);
        }
    };

    const handleAddToCart = (favorite: FavoriteItem) => {
        addItem({
            id: `${favorite.menuItemId}-${Date.now()}`,
            menuItemId: favorite.menuItemId,
            name: favorite.menuItem.name,
            description: favorite.menuItem.description,
            price: favorite.menuItem.price,
            quantity: 1,
            image: favorite.menuItem.imageUrl,
            restaurantId: favorite.menuItem.restaurantId,
            restaurantName: favorite.restaurant.name,
        });
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
            <h2 className="text-xl font-bold text-gray-800 mb-6">Favorite Items</h2>

            {favorites.length === 0 ? (
                <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No favorites yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Browse restaurants and save your favorite dishes
                    </p>
                    <Link
                        href="/restaurants"
                        className="inline-flex items-center gap-2 mt-4 px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition"
                    >
                        <ExternalLink size={18} />
                        Browse Restaurants
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {favorites.map((favorite) => (
                        <div
                            key={favorite.id}
                            className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                        >
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {favorite.menuItem.imageUrl ? (
                                    <img
                                        src={favorite.menuItem.imageUrl}
                                        alt={favorite.menuItem.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No image
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 truncate">
                                    {favorite.menuItem.name}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">
                                    {favorite.restaurant.name}
                                </p>
                                <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                                    {favorite.menuItem.description}
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="font-bold text-red-900">
                                        CHF {favorite.menuItem.price.toFixed(2)}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(favorite)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-900 text-white text-sm rounded-lg hover:bg-red-800 transition"
                                        >
                                            <ShoppingCart size={16} />
                                            Add
                                        </button>
                                        <button
                                            onClick={() => handleRemove(favorite.menuItemId)}
                                            disabled={removingId === favorite.menuItemId}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
