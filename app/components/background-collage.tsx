'use client';

import React, { useEffect, useState } from 'react';

const BackgroundCollage = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Handle mobile detection
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        setIsMobile(mediaQuery.matches);

        const handleMediaQueryChange = (e) => {
            setIsMobile(e.matches);
        };

        mediaQuery.addEventListener('change', handleMediaQueryChange);

        // Apply background directly to the body
        const imagePath = mediaQuery.matches
            ? '/images/background-collage-mobile.png'
            : '/images/background-collage-desktop.png';

        // Apply styles directly to the document body
        document.body.style.backgroundImage = `url(${imagePath})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.height = '100vh';
        document.body.style.minHeight = '100vh';
        document.body.style.overflow = 'hidden';

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
            // Reset body styles when component unmounts
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundPosition = '';
            document.body.style.backgroundRepeat = '';
            document.body.style.backgroundAttachment = '';
            document.body.style.height = '';
            document.body.style.minHeight = '';
            document.body.style.overflow = '';
        };
    }, []);

    // This component doesn't render anything visible, it just modifies the body
    return null;
};

export default BackgroundCollage; 