"use client";

import React, { useState } from 'react';
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

        if (password !== confirmPassword) {
            setError('Passwords do not match');
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
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
            <div 
                className={`w-full max-w-5xl bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-8 md:p-16 ${
                    isSubmitted ? 'flex flex-col items-center justify-start text-center' : ''
                }`}
                style={{ minHeight: '720px' }}
            >
                {isSubmitted ? (
                    <SuccessMessage />
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Partner with Eat African
                            </h1>
                            <p className="text-gray-600">
                                Register your restaurant and reach more customers
                            </p>
                        </div>
                        
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
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
    );
}
