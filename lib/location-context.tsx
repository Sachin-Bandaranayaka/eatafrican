"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useLocation, UseLocationReturn, LOCATIONS } from '@/hooks/use-location';
import { Language, getTranslation, TranslationKey } from './translations';

// Create the context
export const LocationContext = createContext<UseLocationReturn & {
    t: (key: TranslationKey) => string;
    allCountries: (typeof LOCATIONS)
}>(null!);

// Export the context provider
export const LocationProvider = ({ children }: { children: ReactNode }) => {
    // Use the location hook
    const locationData = useLocation();

    // Translation function that uses the current language
    const t = (key: TranslationKey): string => {
        return getTranslation(key, locationData.locationInfo.language as Language);
    };

    return (
        <LocationContext.Provider value={{
            ...locationData,
            t,
            allCountries: LOCATIONS
        }}>
            {children}
        </LocationContext.Provider>
    );
};

// Export a custom hook to use the context
export const useLocationContext = () => {
    const context = useContext(LocationContext);

    if (!context) {
        throw new Error('useLocationContext must be used within a LocationProvider');
    }

    return context;
}; 