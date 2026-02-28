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
    const [currentStep, setCurrentStep] = useState(1);
    const [cities, setCities] = useState<string[]>(['Select City...']);

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await fetch('/api/cities');
            const data = await response.json();
            if (Array.isArray(data)) {
                const cityNames = data.map((city: any) => city.name);
                setCities(['Select City...', ...cityNames]);
            } else {
                console.error('Cities data is not an array:', data);
                setCities(['Select City...']);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
            setCities(['Select City...']);
        }
    };

    const handleNext = () => {
        const form = document.querySelector('form') as HTMLFormElement;
        let isValid = true;

        if (currentStep === 1) {
            // Validate contact details
            const contactInputs = ['firstName', 'lastName', 'phone', 'email'];
            contactInputs.forEach(name => {
                const input = form.querySelector(`input[name="${name}"]`) as HTMLInputElement;
                if (input && input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.focus();
                    return;
                }
            });
        } else if (currentStep === 2) {
            // Validate restaurant information
            const restaurantInputs = ['restaurantName', 'city', 'postalCode', 'street'];
            restaurantInputs.forEach(name => {
                const input = form.querySelector(`input[name="${name}"], select[name="${name}"]`) as HTMLInputElement | HTMLSelectElement;
                if (input && input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.focus();
                    return;
                }
            });
            const citySelect = form.querySelector('select[name="city"]') as HTMLSelectElement;
            if (citySelect && citySelect.value === 'Select City...') {
                alert('Please select a city');
                isValid = false;
                citySelect.focus();
            }
        }

        if (isValid) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const steps = [
        { id: 1, title: 'Contact Details' },
        { id: 2, title: 'Restaurant Information' },
        { id: 3, title: 'Restaurant Verification' }
    ];
    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="hidden" name="password" value="DefaultPassword123!" />
                <div className="space-y-4" style={{display: currentStep === 1 ? 'block' : 'none'}}>
                        {/* Contact Details */}
                        <div className="max-w-96">
                            <h2 className="text-xs font-extrabold text-[#00FF4C] mb-2">CONTACT DETAILS</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                <FormInput label="Manager First Name" name="firstName" placeholder="" required />
                                <FormInput label="Last Name" name="lastName" placeholder="" required />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                <FormInput label="Phone Number" name="phone" placeholder="" type="tel" required />
                                <FormInput label="Email Address" name="email" placeholder="" type="email" required />
                            </div>
                            <p className="text-xs text-white mt-1">
                                We'll register your restaurant with this email. It will also serve as your login to access and manage your dashboard.
                            </p>
                        </div>

                        {/* Next Button */}
                        <div className="text-left mt-4 relative">
                            <button type="button" onClick={handleNext} className="bg-[#00FF4C] text-black font-bold py-1 px-8 rounded transition-colors">
                                NEXT
                            </button>
                            {/* Step Indicator */}
                            <div className="absolute right-4 top-0">
                                <div className="flex items-center justify-center space-x-2">
                                    {steps.map((step, index) => (
                                        <React.Fragment key={step.id}>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStep(step.id)}
                                                className={`flex items-center justify-center w-8 h-8 rounded border-2 cursor-pointer ${
                                                    currentStep >= step.id ? 'bg-[#B37224] border-[#B37224] text-black' : 'bg-slate-400 border-slate-400 text-black'
                                                }`}
                                            >
                                                {step.id}
                                            </button>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                <div className="space-y-4" style={{display: currentStep === 2 ? 'block' : 'none'}}>
                        {/* Restaurant Information */}
                        <div className="max-w-md mx-auto">
                            <h2 className="text-xs font-extrabold text-[#00FF4C] mb-2">RESTAURANT INFORMATION</h2>
                            <FormInput label="Restaurant name" name="restaurantName" placeholder="" required fullWidth />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                <FormSelect label="City" name="city" options={cities} required />
                                <FormInput label="Postal Code" name="postalCode" placeholder="" required />
                            </div>
                            <FormInput label="Street Name & Number" name="street" placeholder="" fullWidth required />
                            <FormSelect label="Type of Restaurant" name="restaurantType" options={['Select Type...', 'Fine Dining', 'Casual Dining', 'Fast Food', 'Cafe']} fullWidth />
                            <FormSelect label="How does your restaurant do delivery?" name="deliveryMethod" options={['Select Method...', 'Own Delivery Fleet', 'Third-party Service', 'Both']} fullWidth />

                            {/* Type of Country Specialty */}
                            <div className="mt-4">
                                <h2 className="text-xs font-extrabold text-[#00FF4C] mb-2">TYPE OF COUNTRY SPECIALTY</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-bold text-sm text-white mb-1">East African</h3>
                                        <div className="space-y-1">
                                            <Checkbox label="Eritrean" />
                                            <Checkbox label="Ethiopian" />
                                            <Checkbox label="Kenyan" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-white mb-1">West African</h3>
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
                        </div>

                        {/* Navigation Buttons */}
                        <div className="text-left mt-4 relative">
                            <button type="button" onClick={handleNext} className="bg-[#00FF4C] text-black font-bold py-1 px-6 rounded transition-colors">
                                NEXT
                            </button>
                            {/* Step Indicator */}
                            <div className="absolute right-4 top-0">
                                <div className="flex items-center justify-center space-x-2">
                                    {steps.map((step, index) => (
                                        <React.Fragment key={step.id}>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStep(step.id)}
                                                className={`flex items-center justify-center w-8 h-8 rounded border-2 cursor-pointer ${
                                                    currentStep >= step.id ? 'bg-[#B37224] border-[#B37224] text-black' : 'bg-slate-400 border-slate-400 text-black'
                                                }`}
                                            >
                                                {step.id}
                                            </button>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                <div className="space-y-4" style={{display: currentStep === 3 ? 'block' : 'none'}}>
                        {/* Restaurant Verification */}
                        <div className="max-w-md mx-auto">
                            <h2 className="text-xs font-extrabold text-[#00FF4C] mb-2">RESTAURANT VERIFICATION</h2>

                            {/* Proof of Ownership */}
                            <div className="mb-4">
                                <h3 className="text-xs font-extrabold text-white mb-2">Upload one of the following as proof of ownership or authorization</h3>
                                <ul className="list-disc list-inside text-xs text-white mb-2 space-y-1">
                                    <li>Business registration certificate</li>
                                    <li>Trade license</li>
                                    <li>Authorization letter signed by the owner</li>
                                    <li>Commercial register extract (e.g. Handelsregisterauszug)</li>
                                </ul>
                                <FileUpload label="" buttonText="Browse Document"/>
                            </div>

                            {/* ID Upload */}
                            <div>
                                <h3 className="text-xs font-extrabold text-white mb-2">Upload an image of your id or passport for verification purposes</h3>
                                <FileUpload label="" buttonText="Browse Image" acceptedTypes="Accepted file: JPG, or PNG. Max size: 5MB" />
                            </div>

                            {/* Language Selection */}
                            <div className="mt-4">
                                <FormSelect
                                    label="Select your preferred language for email notifications"
                                    name="language"
                                    options={['Select Language...', 'English', 'French', 'Arabic', 'Amharic', 'Swahili']}
                                    fullWidth
                                />
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="text-left mt-4 relative">
                            <button type="submit" className="bg-[#00FF4C] text-black font-bold py-1 px-8 rounded transition-colors">
                                SUBMIT
                            </button>
                            {/* Step Indicator */}
                            <div className="absolute right-4 top-0">
                                <div className="flex items-center justify-center space-x-2">
                                    {steps.map((step, index) => (
                                        <React.Fragment key={step.id}>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStep(step.id)}
                                                className={`flex items-center justify-center w-8 h-8 rounded border-2 cursor-pointer ${
                                                    currentStep >= step.id ? 'bg-[#B37224] border-[#B37224] text-black' : 'bg-slate-400 border-slate-400 text-black'
                                                }`}
                                            >
                                                {step.id}
                                            </button>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-white mt-2 text-center">
                            By clicking "Submit", you agree to our Terms and Conditions and acknowledge you have read the Privacy Notice.
                        </p>
                    </div>
            </form>
        </>
    );
};

export default RegistrationForm;