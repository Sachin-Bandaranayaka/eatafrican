'use client';

import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Array of background images to cycle through
const DESKTOP_IMAGES = [
  '/images/background-collage-desktop.png',
  '/images/background-collage-desktop01.png',
  '/images/background-collage-desktop02.png',
  '/images/background-collage-desktop03.png',

];

const MOBILE_IMAGES = [
  '/images/background-collage-mobile.png',
  '/images/ethiopia-eritrea01.png',
  '/images/ethiopia-eritrea02.png',
];

const BackgroundCollage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState(-1);
  const isMobile = useIsMobile();

  const images = isMobile ? MOBILE_IMAGES : DESKTOP_IMAGES;

  useEffect(() => {
    // Apply base styles to body to ensure full-size background
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.minHeight = "100vh";
    document.body.style.backgroundColor = "#331a00"; // Brown backup color
    document.body.style.position = "relative"; // Ensure proper positioning context

    // Create and apply the styles for our slider container
    const createSliderStyles = () => {
      let styleElement = document.getElementById('background-slider-styles');

      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'background-slider-styles';
        document.head.appendChild(styleElement);
      }

      // Updated styles with proper z-indexing
      styleElement.innerHTML = `
        .bg-slider-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          z-index: 0; /* Changed from -1 to ensure it's visible but behind content */
          pointer-events: none; /* Don't capture mouse events */
        }
        
        .bg-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0;
          transition: opacity 2s ease-in-out;
          z-index: 0;
        }
        
        .bg-slide.active {
          opacity: 1;
          z-index: 1;
        }
        
        .bg-slide.ken-burns {
          animation: kenBurns 20s ease-in-out forwards;
          transform-origin: center center;
        }
        
        .bg-slider-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(51, 26, 0, 0.5); /* dark brown, 50% opacity */
          pointer-events: none;
          z-index: 2;
        }
        
        @keyframes kenBurns {
          0% {
            transform: scale(1.0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1.0);
          }
        }
        
        /* Make sure content is layered above the slider */
        main, header, footer, .content {
          position: relative;
          z-index: 1;
        }
        
        @media (max-width: 768px) {
          .bg-slider-container {
            position: fixed;
          }
        }
      `;
    };

    // Create the slider container and initial slides
    const createSliderElements = () => {
      // Remove existing container if present
      let container = document.getElementById('background-slider-container');
      if (container) {
        container.remove();
      }

      // Create new container
      container = document.createElement('div');
      container.id = 'background-slider-container';
      container.className = 'bg-slider-container';
      document.body.insertBefore(container, document.body.firstChild); // Insert at beginning

      // Create slides for each image - make first one active immediately
      images.forEach((imgSrc, index) => {
        const slide = document.createElement('div');
        slide.className = `bg-slide ${index === currentImageIndex ? 'active ken-burns' : ''}`;
        slide.id = `bg-slide-${index}`;

        // Force the image to load first to check if it exists
        const tempImg = new Image();
        tempImg.onload = () => {
          // Image exists, set as background
          slide.style.backgroundImage = `url(${imgSrc})`;
          console.log(`Image loaded: ${imgSrc}`);
        };
        tempImg.onerror = () => {
          console.error(`Failed to load image: ${imgSrc}`);
          // Set a fallback color instead
          slide.style.backgroundColor = "#331a00";
        };
        tempImg.src = imgSrc;

        container.appendChild(slide);
        console.log(`Added slide ${index} with image: ${imgSrc}`);
      });

      // Add overlay div
      const overlay = document.createElement('div');
      overlay.className = 'bg-slider-overlay';
      container.appendChild(overlay);

      // Force the container to be visible
      container.style.display = "block";
    };

    // Handle the slide transition
    const rotateBackground = () => {
      const oldSlide = document.getElementById(`bg-slide-${currentImageIndex}`);
      setPrevImageIndex(currentImageIndex);

      // Set next image index with looping
      const nextIndex = (currentImageIndex + 1) % images.length;
      setCurrentImageIndex(nextIndex);

      // Apply transition on next frame
      setTimeout(() => {
        // Remove active and ken-burns class from old slide
        if (oldSlide) {
          oldSlide.classList.remove('active', 'ken-burns');
        }

        // Add active and ken-burns to new slide
        const newSlide = document.getElementById(`bg-slide-${nextIndex}`);
        if (newSlide) {
          newSlide.classList.add('active', 'ken-burns');
        }
      }, 50);
    };

    // Setup the slider
    createSliderStyles();
    createSliderElements();

    // Start the rotation timer
    const rotationTimer = setInterval(rotateBackground, 10000); // Change image every 10 seconds

    // Handle window resize
    const handleResize = () => {
      createSliderStyles();
      createSliderElements();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearInterval(rotationTimer);
      window.removeEventListener('resize', handleResize);

      const container = document.getElementById('background-slider-container');
      if (container) {
        container.remove();
      }

      const styleElement = document.getElementById('background-slider-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [currentImageIndex, isMobile, images]);

  return null;
};

export default BackgroundCollage; 