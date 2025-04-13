'use client';

import React from 'react';

export default function TestBgPage() {
    const images = [
        '/images/background-collage-desktop.png',
        '/images/background-collage-mobile.png',
        '/debug-images/test-bg.png'
    ];

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Background Image Test</h1>

            <div className="grid gap-8">
                {images.map((src, i) => (
                    <div key={i} className="border border-gray-300 p-4 rounded">
                        <h2 className="font-bold mb-2">{src}</h2>

                        <div className="mb-4">
                            <h3 className="text-sm font-bold mb-1">1. Direct img tag:</h3>
                            <img
                                src={src}
                                alt={`Test ${i + 1}`}
                                className="max-w-full h-64 object-cover"
                            />
                        </div>

                        <div className="mb-4">
                            <h3 className="text-sm font-bold mb-1">2. CSS background:</h3>
                            <div
                                style={{
                                    height: '16rem',
                                    backgroundImage: `url(${src})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 