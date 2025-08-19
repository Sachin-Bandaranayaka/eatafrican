"use client";

import React, { useState } from 'react';

// A simple icon component for the list items
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

// The Register component props
interface RegisterProps {
    onBackToLogin: () => void;
}

// The Register component based on the provided images
export default function Register({ onBackToLogin }: RegisterProps) {
    // State to track if the form has been submitted
    const [isSubmitted, setIsSubmitted] = useState(false);

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

    // Handler to update state on input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handler for form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you would typically handle form validation and API submission
        console.log('Form submitted:', formData);
        setIsSubmitted(true); // Switch to the "Thank You" view
    };

    return (
        <main className="flex justify-center min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="w-full mx-auto">
                {/* Header Section */}
                <div className='px-32 '>
                    <section className="w-full bg-white bg-opacity-80 border-2 border-[#f1c232] rounded-lg flex flex-col items-center p-4 mb-6 text-center">
                        <h1 className="text-[15px] font-bold text-red-600">EAT AFRICAN DRIVER PORTAL</h1>
                        <button
                            onClick={onBackToLogin}
                            className="bg-amber-800 text-[15px] text-white font-semibold py-0.5 px-6 rounded-lg my-3 hover:bg-opacity-90 transition-colors"
                        >
                            LOGIN
                        </button>
                        <p className="text-green-600 font-bold text-[15px]">Register Your Driver Account</p>
                    </section>
                </div>


                {/* Body Section */}
                <section className="w-full min-h-[80vh] relative bg-white bg-opacity-80 border-2 border-[#f1c232] rounded-lg flex flex-col items-center p-4 sm:p-6 lg:p-8 z-10">
                    {isSubmitted ? (
                        // Thank You View (after submission)
                        <div className="text-center w-full animate-fade-in">
                            <h2 className="text-center text-[15px] font-bold text-green-700 mb-6">REGISTER DRIVER ACCOUNT</h2>

                            <h2 className="text-[20px] font-bold text-black mb-4">Thank you for registering as a driver!</h2>
                            <p className="text-black mb-4 text-[15px]">
                                We've received your details and will review your submission shortly. You'll get an email confirmation once your identity has been verified.
                            </p>
                            <p className="text-black text-[15px]">
                                If you have any questions in the meantime, feel free to reach out to our support team at <a href="mailto:support@eatafrican.ch" className="text-blue-600  underline">support@eatafrican.ch</a>
                            </p>
                        </div>
                    ) : (
                        // Registration Form View
                        <form onSubmit={handleSubmit} className="w-full  px-24">
                            <h2 className="text-center text-[15px] font-bold text-green-700 mb-6">REGISTER DRIVER ACCOUNT</h2>

                            {/* Contact Details */}
                            <fieldset className="mb-6">
                                <legend className="text-[15px] font-bold text-black mb-2">CONTACT DETAILS</legend>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <label htmlFor="firstName" className="block text-[15px] font-bold text-black">First Name*</label>
                                        <input type="text" id="firstName" name="firstName" className="mt-1 block w-full px-3 py-0.5 bg-white border rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-[15px] font-bold text-black">Last Name*</label>
                                        <input type="text" id="lastName" name="lastName" className="mt-1 block w-full px-3 py-0.5 bg-white border rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-[15px] font-bold text-black">Phone Number*</label>
                                        <input type="tel" id="phone" name="phone" className="mt-1 block w-full px-3 py-0.5 bg-white border rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-[15px] font-bold text-black">Email Address*</label>
                                        <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-0.5 bg-white border rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500" />
                                    </div>
                                </div>
                                <p className="text-[13px] font-semibold text-black mt-2">We'll register your driver's account with this email. It will also serve as your login to access and manage your dashboard.</p>
                            </fieldset>

                            {/* Address */}
                            <fieldset className="mb-6">
                                <legend className="text-[15px] font-bold text-black mb-4">YOUR ADDRESS</legend>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="city" className="block text-[15px] font-bold text-black">City</label>
                                        <input type="text" id="city" name="city" className="mt-1 block w-full px-3 py-0.5 bg-white border rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="postalCode" className="block text-[15px] font-bold text-black">Postal Code</label>
                                        <input type="text" id="postalCode" name="postalCode" className="mt-1 block w-full px-3 py-0.5 bg-white border rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="street" className="block text-[15px] font-bold text-black">Street Name & Number</label>
                                    <input type="text" id="street" name="street" className="mt-1 block w-full px-3 py-0.5 bg-white border rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500" />
                                </div>
                            </fieldset>

                            {/* Preferred Pickup Location */}
                            <fieldset className="mb-6">
                                <legend className="text-[15px] font-bold text-black mb-2">YOUR PREFERRED PICKUP LOCATION</legend>
                                <p className="text-[13px] font-semibold text-black mb-4">Which location would you like to pick up orders from? You'll be delivering meals from there to nearby areas and other regions.</p>
                                <h2 className='font-bold text-[13px] mb-2'>Choose Pickup Location</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 w-44">
                                    {['Basel', 'Solothurn', 'Bern', 'Luzern', 'Olten', 'Zurich'].map(loc => (
                                        <div key={loc} className="flex items-center">
                                            <input id={loc} name="pickupLocation" type="radio" value={loc} onChange={handleChange} className="h-4 w-4 text-yellow-600 border-black focus:ring-yellow-500" />
                                            <label htmlFor={loc} className="ml-3 block text-[12px] font-bold text-black">{loc}</label>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>

                            {/* Verify Identity */}
                            <fieldset className="mb-6">
                                <legend className="text-[15px] font-bold text-black mb-2">VERIFY YOUR IDENTITY</legend>
                                <p className="text-[13px] font-bold text-black mb-2">Upload one of the following to verify your identity</p>

                                <ul className="list-disc list-outside pl-4 mb-4 text-sm text-black">
                                    <li className="italic">Photo of your ID card</li>
                                    <li className="italic">Photo of your passport</li>
                                </ul>

                                <div className="mb-4">
                                    <label htmlFor="drivingLicense" className="block text-[15px] font-bold text-black mb-2">Upload a photo of your driving license</label>
                                    <label htmlFor="drivingLicense" className="cursor-pointer block w-full bg-white rounded-md px-3 py-3 text-sm text-gray-500">

                                    </label>
                                    <input
                                        type="file"
                                        id="drivingLicense"
                                        name="drivingLicense"
                                        className="hidden"
                                        accept="image/jpeg, image/png"
                                    />
                                    <p className="text-[13px] font-semibold text-black mt-1">Accepted file types: <span className='font-bold'>PDF or DOC</span>. Max size: 5MB.</p>
                                </div>

                                <div>
                                    <label htmlFor="cv" className="block text-[15px] font-bold text-black mb-2">Upload your CV</label>
                                    <label htmlFor="cv" className="cursor-pointer block w-full bg-white rounded-md px-3 py-3 text-sm text-gray-500">

                                    </label>
                                    <input
                                        type="file"
                                        id="cv"
                                        name="cv"
                                        className="hidden"

                                        accept=".pdf, .doc, .docx"
                                    />
                                    <p className="text-[13px] font-semibold text-black mt-1">Accepted file types: <span className='font-bold'>PDF or DOC</span>. Max size: 5MB.</p>
                                </div>
                            </fieldset>

                            {/* Submit Button */}
                            <div className="text-start">
                                <button type="submit" className="bg-red-900 text-white font-bold py-2 px-12 rounded-full border-4 border-amber-300 transition-colors">
                                    SUBMIT
                                </button>
                                <p className="text-start font-semibold text-[13px] text-black mt-4">
                                    By clicking "Submit", you agree to our Terms and Conditions and acknowledge you have read the Privacy Notice.
                                </p>
                            </div>
                        </form>
                    )}
                </section>
            </div>
        </main>
    );
}