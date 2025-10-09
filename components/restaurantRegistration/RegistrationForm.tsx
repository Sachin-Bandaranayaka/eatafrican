// components/forms/RegistrationForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import Checkbox from './Checkbox';
import FileUpload from './FileUpload';

interface RegistrationFormProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
    const [cities, setCities] = useState<string[]>(['Select City...']);

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await fetch('/api/cities');
            const data = await response.json();
            const cityNames = data.map((city: any) => city.name);
            setCities(['Select City...', ...cityNames]);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };
    return (
        <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-28">
                {/* Left Column */}
                <div className="space-y-4">
                    {/* Contact Details */}
                    <div>
                        <h2 className="text-sm font-extrabold text-gray-800 mb-2">CONTACT DETAILS</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                            <FormInput label="Manager First Name" name="firstName" placeholder="" required />
                            <FormInput label="Last Name" name="lastName" placeholder="" required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                            <FormInput label="Phone Number" name="phone" placeholder="" type="tel" required />
                            <FormInput label="Email Address" name="email" placeholder="" type="email" required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                            <FormInput label="Password" name="password" placeholder="" type="password" required />
                            <FormInput label="Confirm Password" name="confirmPassword" placeholder="" type="password" required />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            We'll register your restaurant with this email. It will also serve as your login to access and manage your dashboard.
                        </p>
                    </div>

                    {/* Restaurant Information */}
                    <div>
                        <h2 className="text-sm font-extrabold text-gray-800 mb-2 mt-4">RESTAURANT INFORMATION</h2>
                        <FormInput label="Restaurant name" name="restaurantName" placeholder="" required fullWidth />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                            <FormSelect label="City" name="city" options={cities} required />
                            <FormInput label="Postal Code" name="postalCode" placeholder="" />
                        </div>
                        <FormInput label="Street Name & Number" name="street" placeholder="" fullWidth />
                        <FormSelect label="Type of Restaurant" name="restaurantType" options={['Select Type...', 'Fine Dining', 'Casual Dining', 'Fast Food', 'Cafe']} fullWidth />
                        <FormSelect label="How does your restaurant do delivery?" name="deliveryMethod" options={['Select Method...', 'Own Delivery Fleet', 'Third-party Service', 'Both']} fullWidth />
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4 mt-8 md:mt-0">
                    {/* Type of Country Specialty */}
                    <div>
                        <h2 className="text-sm font-extrabold text-gray-800 mb-2">TYPE OF COUNTRY SPECIALTY</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-bold text-sm text-gray-700 mb-1">East African</h3>
                                <div className="space-y-1">
                                    <Checkbox label="Eritrean" />
                                    <Checkbox label="Ethiopian" />
                                    <Checkbox label="Kenyan" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-gray-700 mb-1">West African</h3>
                                <div className="space-y-1">
                                    <Checkbox label="Ghana" />
                                    <Checkbox label="Nigeria" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <FormInput label="Other Country Specialty Not Listed" name="otherSpecialty" placeholder="Input Country" fullWidth />
                        </div>
                    </div>

                    {/* Proof of Ownership */}
                    <div>
                        <h2 className="text-sm font-extrabold text-gray-800 mb-2">Upload one of the following as proof of ownership or authorization</h2>
                        <ul className="list-disc list-inside text-xs text-gray-600 mb-2 space-y-1">
                            <li>Business registration certificate</li>
                            <li>Trade license</li>
                            <li>Authorization letter signed by the owner</li>
                            <li>Commercial register extract (e.g. Handelsregisterauszug)</li>
                        </ul>
                        <FileUpload label="" buttonText="Browse Document"/>
                    </div>

                    {/* ID Upload */}
                    <div>
                        <h2 className="text-sm font-extrabold text-gray-800 mb-2">Upload an image of your id or passport for verification purposes</h2>
                        <FileUpload label="" buttonText="Browse Image" acceptedTypes="Accepted file: JPG, or PNG. Max size: 5MB" />
                    </div>

                    {/* Submit Button */}
                    <div className="text-center md:text-left mt-6">
                        <button type="submit" className="bg-red-900 text-white font-bold py-2 px-12 rounded-full border-4 border-amber-300 transition-colors">
                            SUBMIT
                        </button>
                        <p className="text-xs text-gray-600 mt-2">
                            By clicking "Submit", you agree to our Terms and Conditions and acknowledge you have read the Privacy Notice.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default RegistrationForm;