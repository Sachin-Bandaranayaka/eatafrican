"use client"

import React from 'react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import ImageCollage from '../components/ImageCollage';
import BackgroundCollage from '../components/background-collage';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function GalleryPage() {
    return (
        <>
            <BackgroundCollage />

            <main className="relative z-20 min-h-screen flex flex-col">
                {/* Header */}
                <header className="py-4 px-4">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <Link href="/" className="flex items-center text-white">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            <span>HOME</span>
                        </Link>

                        <h1 className="text-white text-xl font-bold text-center">
                            AFRICAN CUISINE GALLERY
                        </h1>

                        <div className="w-20"></div> {/* Spacer for flex alignment */}
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8 flex-1">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Our Food Gallery</h2>
                        <p className="text-center text-gray-600 mb-8">Experience the vibrant colors and flavors of authentic African cuisine</p>

                        <ImageCollage />
                    </div>
                </div>

                <SiteFooter />
            </main>
        </>
    );
} 