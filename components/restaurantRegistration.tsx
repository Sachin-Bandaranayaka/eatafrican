// app/partner-restaurant/page.tsx
"use client";

import React, { useState } from 'react';
import RegistrationForm from '@/components/restaurantRegistration/RegistrationForm'; // Adjust import path as needed
import SuccessMessage from '@/components/restaurantRegistration/SuccessMessage';   // Adjust import path as needed

export default function PartnerRestaurantPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Handler for the submit button click
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission behavior
        // Add your form submission logic here (e.g., API call)
        setIsSubmitted(true); // Set state to show the success message
    };

    // Define common classes for the main container
    const containerClasses = "w-full max-w-5xl bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-lg p-16 z-20";

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className={`${containerClasses} ${isSubmitted ? 'flex flex-col items-center justify-start text-center' : ''}`} style={{minHeight: '720px'}}>
                {isSubmitted ? (
                    <SuccessMessage />
                ) : (
                    <RegistrationForm onSubmit={handleSubmit} />
                )}
            </div>
        </div>
    );
}