
"use client";

import { useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import RegularButton from '@/app/components/RegularButton';
import CustomDropdown from '@/app/components/DropDown';

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
    const [mealType, setMealType] = useState('Vegan');
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
        <div className="min-h-screen text-black relative overflow-hidden">
            <div className="relative z-10 p-4 pt-12">
                <div className="max-w-4xl mx-auto relative">
                    {type === 'drink' && (
                        <div
                            style={{ backgroundColor: '#E8D7B4' }}
                            className="w-full max-w-[768px] min-h-64 shadow-lg text-black text-xs opacity-70 absolute inset-0"
                        ></div>
                    )}
                    <div
                        style={{ backgroundColor: 'rgba(232, 215, 180, 0.8)' }}
                        className="w-full max-w-[900px] min-h-48 shadow-lg text-black text-xs p-4"
                    >

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Left Section - Image Upload */}
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-xs font-bold text-black mb-4">
                                        {type.charAt(0).toUpperCase() + type.slice(1)} Image
                                    </label>
                                    <div className="w-72 h-64 bg-yellow-100 rounded-xl flex flex-col items-center justify-center border-2 border-white">
                                        {formData.image ? (
                                            <img
                                                src={URL.createObjectURL(formData.image)}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        ) : (
                                            <div className="text-center">
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 text-[10px] text-black italic space-y-0">
                                        <p>• Image must be clear, no blur, without text on it</p>
                                        <p>• Image size must be 320 × 320 px</p>
                                    </div>
                                    <RegularButton
                                        text="UPLOAD"
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                        fillColor="#e8974b"
                                        borderColor="#ffffff"
                                        fontColor="#000000"
                                    />
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
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-black mb-2">
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
                                    <p className="text-xs text-black mt-1">Max 50 characters</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-black mb-2">
                                        {type.charAt(0).toUpperCase() + type.slice(1)} Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        maxLength={250}
                                        rows={3}
                                        className="w-full px-2 py-0.5 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 resize-none"
                                        placeholder={`Describe your ${type}...`}
                                    />
                                    <p className="text-xs text-black mt-1">Max 250 characters</p>
                                </div>
                            </div>

                            {/* Bottom Section - Details & Pricing */}
                            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                                <div>
                                    <label className="block text-xs font-bold text-black mb-2">
                                        Meal Type
                                    </label>
                                    <CustomDropdown
                                        options={['Vegan', 'Vegetarian', 'Non-Vegetarian']}
                                        defaultOption={formData.mealType}
                                        backgroundColor="#ffffff"
                                        textColor="#000000"
                                        onOptionSelect={(option) => {
                                            setMealType(option);
                                            setFormData(prev => ({ ...prev, mealType: option }));
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-black mb-2">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        min="1"
                                        className="w-full px-2 py-0.5 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                                    />
                                    <p className="text-xs text-black mt-1">Min: 1 Qty</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-black mb-2">
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
                                        className="w-full px-2 py-1 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                                        placeholder="4.00"
                                    />
                                    <p className="text-xs text-black mt-1">Min: 4.-</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-black mb-2">
                                        Special Price
                                    </label>
                                    <input
                                        type="number"
                                        name="specialPrice"
                                        value={formData.specialPrice}
                                        onChange={handleChange}
                                        step="0.01"
                                        className="w-full px-2 py-1 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                                        placeholder="Optional"
                                    />
                                    <p className="text-xs text-red-600 mt-1">Offer Period</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="lg:col-span-2 flex gap-4 mt-4">
                                <RegularButton
                                    text={loading ? 'Submitting...' : 'SUBMIT FOR REVIEW'}
                                    type="submit"
                                    disabled={loading}
                                    fillColor="#b45309"
                                    borderColor="#b45309"
                                />
                                <RegularButton
                                    text="SAVE DRAFT"
                                    fillColor="#b45309"
                                    borderColor="#b45309"
                                />
                                <RegularButton
                                    text="CANCEL"
                                    onClick={() => router.back()}
                                    fillColor="#a16207"
                                    borderColor="#a16207"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AddMenuItem() {
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentView, setCurrentView] = useState('MENU');
    const [menuTab, setMenuTab] = useState('Main Dishes');
    const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);

    return (
        <div className="relative w-full min-h-screen bg-black text-white overflow-hidden font-sans p-8">
            {/* Language Selector */}
            <div className="absolute top-3 left-0 z-20 ml-10">
                <div className="flex items-center">
                    <select className="bg-black text-white font-bold px-1 py-4 pl-8 rounded text-xs appearance-none">
                        <option value="en">EN</option>
                        <option value="fr">FR</option>
                        <option value="es">ES</option>
                    </select>
                    <ChevronDown size={18} strokeWidth={4} className="text-white ml-1" />
                </div>
            </div>

            {/* Portal and Login Information */}
            <div className="absolute top-2 left-0.5 z-20">
                <div
                    className="text-white text-xs font-bold mt-20 px-2 py-2 border w-80 whitespace-nowrap"
                    style={{ backgroundColor: '#2F6B2F', borderColor: '#2F6B2F' }}
                >
                    EAT AFRICAN RESTAURANTS PORTAL
                </div>

                <div className="flex items-center gap-1 font-bold text-xs mt-8 ml-2 pl-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{ backgroundColor: '#2F6B2F' }}
                            className="text-white px-3 py-1 rounded flex items-center justify-between w-32"
                        >
                            <span className="truncate whitespace-nowrap overflow-hidden">
                                {currentView}
                            </span>
                            <ChevronDown size={18} strokeWidth={4} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 -mt-2 pt-2 w-36 bg-green-900 text-white rounded-bl-[9px] rounded-br-[9px] shadow-lg z-50">
                                {['ORDERS', 'MENU', 'EARNINGS', 'MY RESTAURANT', 'TEAM MANAGEMENT', 'ACCOUNT'].map(view => (
                                    <button
                                        key={view}
                                        onClick={() => {
                                            setCurrentView(view);
                                            setIsDropdownOpen(false);
                                            router.push('/restaurant-owner');
                                        }}
                                        className="block w-full text-left px-2 h-8 text-[12px] font-semibold hover:bg-gray-600 flex items-center"
                                    >
                                        {view}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {currentView === 'MENU' && (
                        <div className="relative ml-4">
                            <button
                                onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                                style={{ backgroundColor: '#ff9920' }}
                                className="text-black px-3 py-1 rounded flex items-center justify-between w-32"
                            >
                                <span className="truncate">{menuTab}</span>
                                <ChevronDown size={18} strokeWidth={4} className="ml-2" />
                            </button>
                            {isMenuDropdownOpen && (
                                <div className="absolute top-full left-0 -mt-2 pt-2 w-36 text-black rounded-bl-[9px] rounded-br-[9px] shadow-lg z-50" style={{ backgroundColor: '#ff9920' }}>
                                    {['Main Dishes', 'DRINKS', 'SPECIAL DEALS'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => {
                                                setMenuTab(tab);
                                                setIsMenuDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-2 h-8 text-[12px] font-semibold hover:bg-orange-300 flex items-center"
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Top Right Buttons */}
            <div className="absolute top-4 right-12 z-20 w-fit flex items-center space-x-6">
                <button
                    onClick={() => {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('user');
                        router.push('/');
                    }}
                    className="group flex items-center"
                >
                    <span className="relative text-xs font-bold text-yellow-500 pr-4 pb-1">
                        LOGOUT
                        <span
                            className="absolute bottom-0 h-[1.5px] bg-white transition-all
                                       group-hover:bg-yellow-500"
                            style={{ left: '-1rem', width: 'calc(100% + 2rem)' }}
                        />
                    </span>

                    <span className="relative w-10 h-10 -ml-3">
                        <Image
                            src="/images/UserIcon (1).png"
                            alt="Profile"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                    </span>
                </button>

                <button className="relative w-8 h-8 hover:scale-110 transition">
                    <Image src="/images/cart_icon.png" alt="Cart" width={32} height={32} className="object-contain" />
                </button>
            </div>

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/eatafricanbck1.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            </div>

            <div className="absolute z-10 top-24 left-1/2 transform -translate-x-1/2">
                <Suspense fallback={
                    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 pt-20 flex items-center justify-center">
                        <div className="text-gray-600">Loading...</div>
                    </div>
                }>
                    <AddMenuItemForm />
                </Suspense>
            </div>
        </div>
    );
}
