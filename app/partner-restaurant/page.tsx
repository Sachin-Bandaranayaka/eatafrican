"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import RegistrationForm from '@/components/restaurantRegistration/RegistrationForm';
import SuccessMessage from '@/components/restaurantRegistration/SuccessMessage';

export default function PartnerRestaurantPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        
        // Extract form data
        const cuisineTypes: string[] = [];
        
        // Collect checked cuisine types
        const checkboxes = event.currentTarget.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach((checkbox) => {
            const value = (checkbox as HTMLInputElement).value;
            if (value) cuisineTypes.push(value);
        });

        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const phone = formData.get('phone') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const restaurantName = formData.get('restaurantName') as string;
        const city = formData.get('city') as string;
        const postalCode = formData.get('postalCode') as string;
        const street = formData.get('street') as string;
        const otherSpecialty = formData.get('otherSpecialty') as string;

        // Validation
        if (!firstName || !lastName || !phone || !email || !password || !restaurantName || !city || !postalCode || !street) {
            setError('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        if (city === 'Select City...') {
            setError('Please select a city');
            setIsLoading(false);
            return;
        }


        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            setIsLoading(false);
            return;
        }

        // Add other specialty to cuisine types if provided
        if (otherSpecialty) {
            cuisineTypes.push(otherSpecialty);
        }

        try {
            // Step 1: Register user account
            const registerResponse = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName,
                    phone,
                    role: 'restaurant_owner',
                    language: 'en'
                })
            });

            if (!registerResponse.ok) {
                const errorData = await registerResponse.json();
                throw new Error(errorData.error?.message || 'Failed to create account');
            }

            const { token } = await registerResponse.json();

            // Step 2: Create restaurant
            const restaurantResponse = await fetch('/api/restaurants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: restaurantName,
                    description: `${cuisineTypes.join(', ')} restaurant in ${city}`,
                    cuisineTypes,
                    address: street,
                    city,
                    postalCode,
                    region: city, // Using city as region for now
                    phone,
                    email,
                    minOrderAmount: 24.0,
                    latitude: null,
                    longitude: null,
                    logoUrl: null,
                    coverImageUrl: null,
                    openingHours: {
                        monday: { open: '11:00', close: '22:00' },
                        tuesday: { open: '11:00', close: '22:00' },
                        wednesday: { open: '11:00', close: '22:00' },
                        thursday: { open: '11:00', close: '22:00' },
                        friday: { open: '11:00', close: '22:00' },
                        saturday: { open: '11:00', close: '22:00' },
                        sunday: { open: '11:00', close: '22:00' }
                    }
                })
            });

            if (!restaurantResponse.ok) {
                const errorData = await restaurantResponse.json();
                throw new Error(errorData.error?.message || 'Failed to create restaurant');
            }

            // Success!
            setIsSubmitted(true);
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Failed to submit registration');
        } finally {
            setIsLoading(false);
        }
    };

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
            {/* Portal and Login Information Only*/}
             <div className="absolute top-2 left-0.5 z-20 ">
                <div className="text-white text-sm font-bold mt-20 px-4 py-2 border" style={{backgroundColor: '#2F6B2F', borderColor: '#2F6B2F'}}>EAT AFRICAN RESTAURANTS PORTAL</div>
                <div className="flex items-center gap-1 font-bold text-xs mt-8 ml-10 pl-4">
                  <Image src="/images/folk_link.png" alt="Folk Link" width={30} height={30} />
                  <span style={{color: '#F2C94C'}}>Login</span>
                </div>
            </div>
            {/* Top Right Buttons */}
            <div className="absolute top-4 right-12 z-20 w-fit flex items-center space-x-6">
                <button className="flex items-center space-x-2 hover:text-yellow-500 transition group">
                    <span className="text-xs font-bold group-hover:text-yellow-500" style={{color: '#F2C94C'}}>LOGIN</span>
                    <div className="relative w-8 h-8">
                        <Image src="/images/folk_link.png" alt="Login" fill className="object-contain" />
                    </div>
                </button>
                <button className="relative w-8 h-8 hover:scale-110 transition">
                    <Image src="/images/cart_icon.png" alt="Cart" fill className="object-contain" />
                </button>
            </div>
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/eatafricanbck1 (1).png"
                    alt="Background"
                    fill
                    className="object-cover opacity-60 transition-opacity duration-500"
                    priority
                />
                {/* Overlay gradient for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-screen p-4">
                <div className="flex items-center justify-center md:justify-start p-4 md:p-8">
                    <div
                        className={`w-full max-w-md md:max-w-96 p-2 md:p-8 md:ml-64 ${
                            isSubmitted ? 'flex flex-col items-center justify-center text-center' : ''
                        }`}
                        style={{ minHeight: '600px' }}
                    >
                {isSubmitted ? (
                    <SuccessMessage />
                ) : (
                    <>
                        <div className="text-left mb-8">
                            <h1 className="text-2xl font-bold text-white mb-2 underline underline-offset-8">
                                REGISTER RESTAURANT
                            </h1>
                        </div>
                        
                        {error && (
                            <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}
                        
                        <RegistrationForm onSubmit={handleSubmit} />
                        
                        {isLoading && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded-lg shadow-xl">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto"></div>
                                    <p className="mt-4 text-gray-700">Submitting your registration...</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
                </div>
            </div>
            <div className="hidden md:flex items-center justify-center p-4 md:p-8">
                <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-sm">
                    <Image
                        src="/Terminal.png"
                        alt="Terminal"
                        width={400}
                        height={300}
                        className="w-full h-auto rounded mb-4"
                    />
                    <h3 className="text-lg font-semibold mb-2">Get a Free Payment Terminal for the First 2 Months</h3>
                    <p className="text-gray-700 mb-4">
                        Instead of using many systems to track your income, you can monitor your whole restaurant cash flow in one simple dashboard — both what you earn through our platform and what you earn directly at your restaurant.
                    </p>
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Get Payment Terminal</span>
                    </label>
                </div>
            </div>
        </div>
    </div>
    );
}
