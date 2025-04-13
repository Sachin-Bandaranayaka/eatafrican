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

        // Add a semi-transparent overlay to the body using ::before
        const style = document.createElement('style');
        style.textContent = `
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: -1;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
            document.head.removeChild(style);
            // Reset body styles when component unmounts
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundPosition = '';
            document.body.style.backgroundRepeat = '';
            document.body.style.backgroundAttachment = '';
        };
    }, []);

    // This component doesn't render anything visible, it just modifies the body
    return null;
};

export default BackgroundCollage; 