import { useState, useEffect } from 'react';

// Supported locations with coordinates [lat, lng]
export const LOCATIONS = {
    SWITZERLAND: ['BASEL', 'OLTEN', 'ZURICH', 'LUGANO'],
    GERMANY: ['BERLIN', 'MUNICH', 'FRANKFURT'],
    FRANCE: ['PARIS', 'LYON', 'STRASBOURG']
};

// Location coordinates for distance calculation
export const CITY_COORDINATES = {
    // Switzerland
    BASEL: { lat: 47.5596, lng: 7.5886 },
    OLTEN: { lat: 47.3510, lng: 7.9041 },
    ZURICH: { lat: 47.3769, lng: 8.5417 },
    LUGANO: { lat: 46.0037, lng: 8.9511 },
    // Germany
    BERLIN: { lat: 52.5200, lng: 13.4050 },
    MUNICH: { lat: 48.1351, lng: 11.5820 },
    FRANKFURT: { lat: 50.1109, lng: 8.6821 },
    // France
    PARIS: { lat: 48.8566, lng: 2.3522 },
    LYON: { lat: 45.7640, lng: 4.8357 },
    STRASBOURG: { lat: 48.5734, lng: 7.7521 }
};

// Country coordinates (center points)
export const COUNTRY_COORDINATES = {
    SWITZERLAND: { lat: 46.8182, lng: 8.2275 },
    GERMANY: { lat: 51.1657, lng: 10.4515 },
    FRANCE: { lat: 46.6034, lng: 1.8883 }
};

// Supported languages based on location
export const LANGUAGES = {
    SWITZERLAND: ['de', 'fr', 'it', 'en'],
    GERMANY: ['de', 'en'],
    FRANCE: ['fr', 'en']
};

// Default language for each country
export const DEFAULT_LANGUAGE = {
    SWITZERLAND: 'de',
    GERMANY: 'de',
    FRANCE: 'fr',
    DEFAULT: 'en'
};

// Location detection options
type LocationDetectionMethod = 'browser' | 'geolocation' | 'ip' | 'manual';

export type LocationInfo = {
    country: keyof typeof LOCATIONS | null;
    city: string | null;
    language: string;
    detectionMethod: LocationDetectionMethod;
};

export type UseLocationReturn = {
    locationInfo: LocationInfo;
    isFirstVisit: boolean;
    setLocation: (country: keyof typeof LOCATIONS, city: string) => void;
    setLanguage: (language: string) => void;
    showPrompt: boolean;
    setShowPrompt: (show: boolean) => void;
};

// Simple browser language detection
const detectBrowserLanguage = (): string => {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE.DEFAULT;

    const language = navigator.language.split('-')[0].toLowerCase();
    return ['de', 'fr', 'it'].includes(language) ? language : DEFAULT_LANGUAGE.DEFAULT;
};

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// Find closest city and country from coordinates
const findClosestLocation = (latitude: number, longitude: number): {
    country: keyof typeof LOCATIONS | null;
    city: string | null;
} => {
    let closestCity = null;
    let closestDistance = Infinity;
    let closestCountry = null;

    // First find the closest city
    for (const [countryName, cities] of Object.entries(LOCATIONS)) {
        for (const city of cities) {
            const cityCoords = CITY_COORDINATES[city as keyof typeof CITY_COORDINATES];
            if (cityCoords) {
                const distance = calculateDistance(latitude, longitude, cityCoords.lat, cityCoords.lng);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestCity = city;
                    closestCountry = countryName as keyof typeof LOCATIONS;
                }
            }
        }
    }

    // If closest city is more than 500km away, try to determine just the country
    if (closestDistance > 500 && !closestCountry) {
        closestDistance = Infinity;
        for (const [countryName, coords] of Object.entries(COUNTRY_COORDINATES)) {
            const distance = calculateDistance(latitude, longitude, coords.lat, coords.lng);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestCountry = countryName as keyof typeof LOCATIONS;
            }
        }
        // If we found a country but no city, pick the first city from that country
        if (closestCountry && !closestCity && closestDistance < 1000) {
            closestCity = LOCATIONS[closestCountry][0];
        }
    }

    return { country: closestCountry, city: closestCity };
};

// Utility to determine country from city
const getCountryFromCity = (city: string): keyof typeof LOCATIONS | null => {
    for (const [country, cities] of Object.entries(LOCATIONS)) {
        if (cities.includes(city.toUpperCase())) {
            return country as keyof typeof LOCATIONS;
        }
    }
    return null;
};

// Fallback to language-based location estimation
const getLocationFromBrowserLanguage = (): {
    country: keyof typeof LOCATIONS | null;
    city: string | null;
    language: string;
} => {
    const browserLang = detectBrowserLanguage();

    // Try to guess country from browser language
    let guessedCountry: keyof typeof LOCATIONS | null = null;
    if (browserLang === 'de') guessedCountry = 'GERMANY';
    else if (browserLang === 'fr') guessedCountry = 'FRANCE';
    else if (browserLang === 'it') guessedCountry = 'SWITZERLAND';

    return {
        country: guessedCountry,
        city: guessedCountry ? LOCATIONS[guessedCountry][0] : null,
        language: browserLang
    };
};

// We're using default coordinates for Europe as fallback
const FALLBACK_COORDS = { latitude: 48.8566, longitude: 2.3522 }; // Paris, France

export const useLocation = (): UseLocationReturn => {
    const [locationInfo, setLocationInfo] = useState<LocationInfo>({
        country: null,
        city: null,
        language: DEFAULT_LANGUAGE.DEFAULT,
        detectionMethod: 'browser'
    });

    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);

    useEffect(() => {
        // Check if user has already set a location preference
        const savedLocation = localStorage.getItem('user-location');

        if (savedLocation) {
            try {
                const parsed = JSON.parse(savedLocation);
                setLocationInfo(parsed);
                setIsFirstVisit(false);
                setShowPrompt(false);
            } catch (error) {
                console.error('Failed to parse saved location:', error);
                detectLocation();
            }
        } else {
            // First visit - detect location
            detectLocation();
        }
    }, []);

    // Function to detect user's location
    const detectLocation = () => {
        setIsDetecting(true);

        // Try to get geolocation
        if (typeof window !== 'undefined' && navigator.geolocation) {
            try {
                navigator.geolocation.getCurrentPosition(
                    // Success callback
                    (position) => {
                        try {
                            const { latitude, longitude } = position.coords;
                            const { country, city } = findClosestLocation(latitude, longitude);

                            // Set detected browser language
                            const browserLang = detectBrowserLanguage();

                            // Default to browser language, but if we found a country, use its default
                            let detectedLanguage = browserLang;
                            if (country && LANGUAGES[country].includes(browserLang)) {
                                detectedLanguage = browserLang;
                            } else if (country) {
                                detectedLanguage = DEFAULT_LANGUAGE[country];
                            }

                            const newLocationInfo = {
                                country,
                                city,
                                language: detectedLanguage,
                                detectionMethod: 'geolocation' as LocationDetectionMethod
                            };

                            setLocationInfo(newLocationInfo);
                            setShowPrompt(true);
                            setIsFirstVisit(true);
                            setIsDetecting(false);
                        } catch (err) {
                            console.warn('Error processing geolocation data:', err);
                            fallbackToLanguageDetection();
                        }
                    },
                    // Error callback
                    (error) => {
                        // Handle specific geolocation errors
                        let errorMessage;
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                errorMessage = 'User denied the request for geolocation';
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMessage = 'Location information is unavailable';
                                break;
                            case error.TIMEOUT:
                                errorMessage = 'The request to get user location timed out';
                                break;
                            default:
                                errorMessage = 'An unknown error occurred';
                        }
                        console.warn(`Geolocation error: ${errorMessage}`);

                        fallbackToLanguageDetection();
                    },
                    // Options with increased timeout and high accuracy
                    {
                        enableHighAccuracy: false, // High accuracy can cause more timeouts
                        timeout: 8000,
                        maximumAge: 60000 // Allow cached positions up to 1 minute
                    }
                );
            } catch (e) {
                console.warn('Failed to request geolocation:', e);
                fallbackToLanguageDetection();
            }
        } else {
            fallbackToLanguageDetection();
        }
    };

    // Common fallback function for when geolocation fails
    const fallbackToLanguageDetection = () => {
        const { country, city, language } = getLocationFromBrowserLanguage();

        const newLocationInfo = {
            country,
            city,
            language,
            detectionMethod: 'browser' as LocationDetectionMethod
        };

        setLocationInfo(newLocationInfo);
        setShowPrompt(true);
        setIsFirstVisit(true);
        setIsDetecting(false);
    };

    // Function to update location
    const setLocation = (country: keyof typeof LOCATIONS, city: string) => {
        const newLocationInfo = {
            ...locationInfo,
            country,
            city,
            detectionMethod: 'manual' as LocationDetectionMethod,
        };

        // Update language if not already compatible with the new country
        const availableLanguages = LANGUAGES[country];
        if (!availableLanguages.includes(locationInfo.language)) {
            newLocationInfo.language = DEFAULT_LANGUAGE[country];
        }

        setLocationInfo(newLocationInfo);

        // Save to localStorage
        localStorage.setItem('user-location', JSON.stringify(newLocationInfo));
        setIsFirstVisit(false);
    };

    // Function to update language
    const setLanguage = (language: string) => {
        const newLocationInfo = {
            ...locationInfo,
            language,
        };

        setLocationInfo(newLocationInfo);
        localStorage.setItem('user-location', JSON.stringify(newLocationInfo));
    };

    return {
        locationInfo,
        isFirstVisit,
        setLocation,
        setLanguage,
        showPrompt,
        setShowPrompt
    };
}; 