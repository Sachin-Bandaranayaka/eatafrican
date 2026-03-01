"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// The Register component props
interface RegisterProps {
    onBackToLogin: () => void;
}

// The Register component based on the restaurant-owner style
export default function Register({ onBackToLogin }: RegisterProps) {
    // State to track current step
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [cities, setCities] = useState<string[]>([]);

    // State for all form fields
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        city: '',
        postalCode: '',
        street: '',
        pickupLocation: '',
    });

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await fetch('/api/cities');
            const data = await response.json();
            const cityNames = data.map((city: any) => city.name);
            setCities(cityNames);
        } catch (error) {
            console.error('Error fetching cities:', error);
            // Fallback to hardcoded cities if API fails
            setCities(['Basel', 'Bern', 'Luzern', 'Olten', 'Zürich']);
        }
    };

    // Handler to update state on input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const steps = [
        { id: 1, title: 'Contact & Driver Information' },
        { id: 2, title: 'Verify Identity' }
    ];

    // Validation for step 1
    const validateStep1 = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
            setError('Please fill in all required contact details');
            return false;
        }
        if (!password || password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (!formData.pickupLocation) {
            setError('Please select a pickup location');
            return false;
        }
        return true;
    };

    // Handle next button
    const handleNext = () => {
        setError('');
        
        if (currentStep === 1) {
            if (validateStep1()) {
                setCurrentStep(2);
            }
        }
    };

    // Handle previous button
    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    // Handler for form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        setLoading(true);

        try {
            // Step 1: Register user account
            const registerResponse = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    role: 'driver',
                }),
            });

            const registerData = await registerResponse.json();

            if (!registerResponse.ok) {
                setError(registerData.error?.message || 'Registration failed');
                setLoading(false);
                return;
            }

            // Step 2: Create driver profile
            const driverResponse = await fetch('/api/drivers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${registerData.token}`,
                },
                body: JSON.stringify({
                    userId: registerData.user.id,
                    licenseNumber: 'PENDING', // Will be updated after document verification
                    vehicleType: 'Car', // Default, can be updated later
                    vehiclePlate: 'PENDING', // Will be updated after document verification
                    pickupZone: formData.pickupLocation,
                }),
            });

            const driverData = await driverResponse.json();

            if (!driverResponse.ok) {
                setError(driverData.error?.message || 'Failed to create driver profile');
                setLoading(false);
                return;
            }

            // Success!
            setIsSubmitted(true);
        } catch (error) {
            console.error('Registration error:', error);
            setError('An error occurred during registration. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-screen p-4">
            <div className="flex items-center justify-center md:justify-start p-4 md:p-8">
                <div
                    className={`w-full max-w-md md:max-w-96 p-2 md:p-8 md:ml-64 ${
                        isSubmitted ? 'flex flex-col items-center justify-center text-center' : ''
                    }`}
                    style={{ minHeight: '600px' }}
                >
                    {isSubmitted ? (
                        // Success Message
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-white mb-4 underline underline-offset-8">
                                REGISTRATION SUCCESSFUL
                            </h1>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-6">
                                <h2 className="text-lg font-bold text-white mb-4">Thank you for registering as a driver!</h2>
                                <p className="text-white mb-4 text-xs">
                                    We've received your details and will review your submission shortly. You'll get an email confirmation once your identity has been verified.
                                </p>
                                <p className="text-white text-xs">
                                    If you have any questions in the meantime, feel free to reach out to our support team at{' '}
                                    <a href="mailto:support@eatafrican.ch" className="text-yellow-400 underline">
                                        support@eatafrican.ch
                                    </a>
                                </p>
                            </div>
                            <button
                                onClick={onBackToLogin}
                                className="mt-6 px-8 py-2 bg-red-900 text-white font-bold rounded-full border-4 border-amber-300 hover:bg-red-800 transition-colors"
                            >
                                BACK TO LOGIN
                            </button>
                        </div>
                    ) : (
                        // Registration Form
                        <>
                            <div className="text-left mb-8">
                                <h1 className="text-2xl font-bold text-white mb-2 underline underline-offset-8">
                                    REGISTER DRIVER
                                </h1>
                            </div>
                            
                            {error && (
                                <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Step 1: Contact Details & Driver Information */}
                                <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                                    {/* Contact Details */}
                                    <div className="max-w-96">
                                        <h2 className="text-xs font-extrabold text-[#00FF4C] mb-2">CONTACT DETAILS</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                            <div>
                                                <label htmlFor="firstName" className="block text-xs font-bold text-white mb-1">
                                                    First Name*
                                                </label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
                                                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm text-gray-900"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="lastName" className="block text-xs font-bold text-white mb-1">
                                                    Last Name*
                                                </label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
                                                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm text-gray-900"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                            <div>
                                                <label htmlFor="phone" className="block text-xs font-bold text-white mb-1">
                                                    Phone Number*
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
                                                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm text-gray-900"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-xs font-bold text-white mb-1">
                                                    Email Address*
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
                                                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm text-gray-900"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-white mt-1">
                                            We'll register your driver's account with this email. It will also serve as your login.
                                        </p>
                                    </div>

                                    {/* Password Fields */}
                                    <div className="max-w-96 mt-4">
                                        <h2 className="text-xs font-extrabold text-[#00FF4C] mb-2">CREATE PASSWORD</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                            <div>
                                                <label htmlFor="password" className="block text-xs font-bold text-white mb-1">
                                                    Password*
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    disabled={loading}
                                                    minLength={8}
                                                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm text-gray-900"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="confirmPassword" className="block text-xs font-bold text-white mb-1">
                                                    Confirm Password*
                                                </label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                    disabled={loading}
                                                    minLength={8}
                                                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm text-gray-900"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-white mt-1">
                                            Password must be at least 8 characters long.
                                        </p>
                                    </div>

                                    {/* Address */}
                                    <div className="max-w-96 mt-4">
                                        <h2 className="text-xs font-extrabold text-[#00FF4C] mb-2">YOUR ADDRESS</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                            <div>
                                                <label htmlFor="city" className="block text-xs font-bold text-white mb-1">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    disabled={loading}
                                                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm text-gray-900"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="postalCode" className="block text-xs font-bold text-white mb-1">
                                                    Postal Code
                                                </label>
                                                <input
                                                    type="text"
                                                    id="postalCode"
                                                    name="postalCode"
                                                    value={formData.postalCode}
                                                    onChange={handleChange}
                                                    disabled={loading}
                                                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm text-gray-900"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <label htmlFor="street" className="block text-xs font-bold text-white mb-1">
                                                Street Name & Number
                                            </label>
                                            <input
                                                type="text"
                                                id="street"
                                                name="street"
                                                value={formData.street}
                                                onChange={handleChange}
                                                disabled={loading}
                                                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm text-gray-900"
                                            />
                                        </div>
                                    </div>

                                    {/* Preferred Pickup Location */}
                                    <div className="max-w-96 mt-4">
                                        <h2 className="text-xs font-extrabold text-[#00FF4C] mb-2">PREFERRED PICKUP LOCATION</h2>
                                        <p className="text-xs text-white mb-3">
                                            Which location would you like to pick up orders from?
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {cities.map(loc => (
                                                <div key={loc} className="flex items-center">
                                                    <input
                                                        id={loc}
                                                        name="pickupLocation"
                                                        type="radio"
                                                        value={loc}
                                                        checked={formData.pickupLocation === loc}
                                                        onChange={handleChange}
                                                        className="h-4 w-4 text-yellow-500 border-white focus:ring-yellow-500"
                                                    />
                                                    <label htmlFor={loc} className="ml-2 text-xs font-bold text-white">
                                                        {loc}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Next Button */}
                                    <div className="text-left mt-4 relative">
                                        <button type="button" onClick={handleNext} className="bg-[#00FF4C] text-black font-bold py-1 px-8 rounded transition-colors">
                                            NEXT
                                        </button>
                                        {/* Step Indicator */}
                                        <div className="absolute right-4 top-0">
                                            <div className="flex items-center justify-center space-x-2">
                                                {steps.map((step) => (
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

                                {/* Step 2: Verify Identity */}
                                <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                                    <div className="max-w-96">
                                        <h2 className="text-xs font-extrabold text-[#00FF4C] mb-2">VERIFY YOUR IDENTITY</h2>
                                        <p className="text-xs text-white mb-2">
                                            Upload one of the following to verify your identity:
                                        </p>
                                        <ul className="list-disc list-outside pl-4 mb-3 text-xs text-white">
                                            <li>Photo of your ID card</li>
                                            <li>Photo of your passport</li>
                                        </ul>
                                        <div className="mb-3">
                                            <label htmlFor="drivingLicense" className="block text-xs font-bold text-white mb-1">
                                                Upload a photo of your driving license
                                            </label>
                                            <input
                                                type="file"
                                                id="drivingLicense"
                                                name="drivingLicense"
                                                accept="image/jpeg, image/png"
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-xs text-gray-700 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="cv" className="block text-xs font-bold text-white mb-1">
                                                Upload your CV
                                            </label>
                                            <input
                                                type="file"
                                                id="cv"
                                                name="cv"
                                                accept=".pdf, .doc, .docx"
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-xs text-gray-700 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="text-left mt-4 relative">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-[#00FF4C] text-black font-bold py-1 px-8 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'SUBMITTING...' : 'SUBMIT'}
                                        </button>
                                        {/* Step Indicator */}
                                        <div className="absolute right-4 top-0">
                                            <div className="flex items-center justify-center space-x-2">
                                                {steps.map((step) => (
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

                                <div className="mt-4">
                                    <p className="text-white text-xs">
                                        Already have an account?{' '}
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onBackToLogin();
                                            }}
                                            className="text-yellow-400 font-bold hover:text-yellow-300"
                                        >
                                            Login
                                        </a>
                                    </p>
                                </div>
                            </form>
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
                    <h3 className="text-lg font-semibold mb-2">Drive with Eat African</h3>
                    <p className="text-gray-700 mb-4">
                        Join our team of delivery drivers and earn money by delivering delicious African meals to customers in your area. Flexible hours, competitive pay!
                    </p>
                    <div className="bg-amber-50 p-3 rounded-lg">
                        <h4 className="font-bold text-sm mb-2">Driver Benefits:</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>✓ Flexible working hours</li>
                            <li>✓ Competitive pay rates</li>
                            <li>✓ Keep 100% of your tips</li>
                            <li>✓ Weekly payouts</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
