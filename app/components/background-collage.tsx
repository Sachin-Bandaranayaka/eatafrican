'use client';

import React, { useEffect } from 'react';

const BackgroundCollage = () => {
    useEffect(() => {
        // Simple direct approach - apply background directly to body with fixed settings
        const applyBackground = () => {
            try {
                const isMobile = window.innerWidth <= 768;
                const backgroundImage = isMobile
                    ? '/images/background-collage-mobile.png'
                    : '/images/background-collage-desktop.png';

                // Apply styles to body
                document.body.style.backgroundImage = `url(${backgroundImage})`;
                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundPosition = "center";
                document.body.style.backgroundRepeat = "no-repeat";
                document.body.style.backgroundAttachment = isMobile ? "scroll" : "fixed"; // Use scroll for mobile
                document.body.style.backgroundColor = "#331a00"; // Brown backup color
                document.body.style.margin = "0";
                document.body.style.padding = "0";
                document.body.style.minHeight = "100vh";

                // Ensure body can scroll on mobile
                if (isMobile) {
                    document.body.style.height = "auto";
                    document.body.style.overflow = "auto";
                }
            } catch (err) {
                console.error('Error applying background:', err);
            }
        };

        // Apply initially
        applyBackground();

        // Handle window resize
        const handleResize = () => {
            applyBackground();
        };

        // Add resize listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            // Only clean up what we set
            try {
                document.body.style.backgroundImage = "";
                document.body.style.backgroundSize = "";
                document.body.style.backgroundPosition = "";
                document.body.style.backgroundRepeat = "";
                document.body.style.backgroundAttachment = "";
                document.body.style.height = "";
                document.body.style.overflow = "";
            } catch (err) {
                console.error('Error cleaning up background:', err);
            }
        };
    }, []);

    // Component doesn't render anything visible
    return null;
};

export default BackgroundCollage; 