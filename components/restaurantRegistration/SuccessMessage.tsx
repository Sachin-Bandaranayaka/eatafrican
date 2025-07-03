// components/layout/SuccessMessage.tsx
"use client";

import React from 'react';

const SuccessMessage = () => (
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
);

export default SuccessMessage;