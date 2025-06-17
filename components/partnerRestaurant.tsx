"use client";

import React, { useState } from 'react';

// Reusable component for form input fields
const FormInput = ({ label, placeholder, type = "text", fullWidth = false, required = false }) => (
    <div className={`mb-3 ${fullWidth ? 'w-full' : 'w-auto'}`}>
        <label className="block text-xs font-bold text-gray-800 mb-1">
            {label}{required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            placeholder={placeholder}
            className="w-full bg-white text-sm text-black px-3 py-1 rounded-sm border border-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
    </div>
);

// Reusable component for dropdown/select fields
const FormSelect = ({ label, options, fullWidth = false }) => (
    <div className={`mb-3 ${fullWidth ? 'w-full' : 'w-auto'}`}>
        <label className="block text-xs font-bold text-gray-800 mb-1">{label}</label>
        <div className="relative">
            <select className="w-full bg-white text-sm text-black px-3 py-2 rounded-sm border border-gray-400 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500">
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
        </div>
    </div>
);

// Reusable component for checkboxes
const Checkbox = ({ label }) => (
    <div className="flex items-center">
        <input type="checkbox" id={label} className="h-4 w-4 text-amber-600 border-gray-400 rounded focus:ring-amber-500" />
        <label htmlFor={label} className="ml-2 text-sm text-gray-800">{label}</label>
    </div>
);

// Reusable component for file uploads
const FileUpload = ({ label, acceptedTypes }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-gray-800 mb-1">{label}</label>
        <div className="relative">
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="w-full bg-white text-sm text-gray-500 px-3 py-1 rounded-sm border border-gray-400">
                Browse Image
            </div>
        </div>
        {acceptedTypes && <p className="text-xs text-gray-600 mt-1">{acceptedTypes}</p>}
    </div>
);


export default function PartnerRestaurant() {
    // State to manage the visibility of the form vs. the success message
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Handler for the submit button click
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        setIsSubmitted(true); // Set state to show the success message
    };

    // Define common classes for the main container to ensure consistent size and style
    const containerClasses = "w-full max-w-5xl bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-lg p-16 z-20";

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            {isSubmitted ? (
                // --- Success Message Section ---
                // The container has the same classes as the form's container.
                // 'flex' and 'items-center' are added to vertically center the content.
                // A min-height is added to ensure it doesn't collapse vertically.
                <div className={`${containerClasses} flex flex-col items-center justify-start text-center`} style={{minHeight: '720px'}}>
                    <div className='mt-14'>
                        <h2 className="text-2xl font-bold text-gray-800 mb-8">
                            Thank you for registering your restaurant!
                        </h2>
                        <p className="text-sm text-black mb-6">
                            We've received your details and will review your submission shortly.
                        </p>
                        <p className="text-sm text-black mb-6">
                            You'll get an email confirmation once your restaurant has been verified and your dashboard is ready to use.
                        </p>
                        <p className="text-sm text-black">
                            If you have any questions in the meantime, feel free to reach out to our support team at <a href="mailto:support@eatafrican.ch" className="text-black font-semibold hover:underline">support@eatafrican.ch</a>
                        </p>
                    </div>
                </div>

            ) : (
                // --- Registration Form Section ---
                <div className={containerClasses}>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-28">
                            {/* Left Column */}
                            <div className="space-y-4">
                                {/* Contact Details */}
                                <div>
                                    <h2 className="text-sm font-extrabold text-gray-800 mb-2">CONTACT DETAILS</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                        <FormInput label="Manager First Name" placeholder="" required />
                                        <FormInput label="Last Name" placeholder="" required />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                        <FormInput label="Phone Number" placeholder="" type="tel" required />
                                        <FormInput label="Email Address" placeholder="" type="email" required />
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">
                                        We'll register your restaurant with this email. It will also serve as your login to access and manage your dashboard.
                                    </p>
                                </div>

                                {/* Restaurant Information */}
                                <div>
                                    <h2 className="text-sm font-extrabold text-gray-800 mb-2 mt-4">RESTAURANT INFORMATION</h2>
                                    <FormInput label="Restaurant name" placeholder="" required fullWidth />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                        <FormInput label="City" placeholder="" />
                                        <FormInput label="Postal Code" placeholder="" />
                                    </div>
                                    <FormInput label="Street Name & Number" placeholder="" fullWidth />
                                    <FormSelect label="Type of Restaurant" options={['Select Type...', 'Fine Dining', 'Casual Dining', 'Fast Food', 'Cafe']} fullWidth />
                                    <FormSelect label="How does your restaurant do delivery?" options={['Select Method...', 'Own Delivery Fleet', 'Third-party Service', 'Both']} fullWidth />
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
                                        <FormInput label="Other Country Specialty Not Listed" placeholder="Input Country" fullWidth />
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
                                    <FileUpload label="" />
                                </div>

                                {/* ID Upload */}
                                <div>
                                    <h2 className="text-sm font-extrabold text-gray-800 mb-2">Upload an image of your id or passport for verification purposes</h2>
                                    <FileUpload label="" acceptedTypes="Accepted file: JPG, or PNG. Max size: 5MB" />
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
                </div>
            )}
        </div>
    );
}