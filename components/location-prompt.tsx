"use client";

import { useState, useEffect } from "react";
import { useLocationContext } from "@/lib/location-context";
import { LOCATIONS, LANGUAGES } from "@/hooks/use-location";
import { Language } from "@/lib/translations";

export function LocationPrompt() {
    const {
        locationInfo,
        showPrompt,
        setShowPrompt,
        setLocation,
        setLanguage,
        t,
        allCountries
    } = useLocationContext();

    const [editMode, setEditMode] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<keyof typeof LOCATIONS | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(locationInfo.language as Language || 'en');

    // Reset selection when entering edit mode
    useEffect(() => {
        if (editMode) {
            setSelectedCountry(locationInfo.country);
            setSelectedCity(locationInfo.city);
            setSelectedLanguage(locationInfo.language as Language || 'en');
        }
    }, [editMode, locationInfo]);

    // Close the modal and confirm location
    const handleConfirm = () => {
        setShowPrompt(false);
    };

    // Confirm edited location
    const handleSaveChanges = () => {
        if (selectedCountry && selectedCity) {
            setLocation(selectedCountry, selectedCity);
            setLanguage(selectedLanguage);
            setEditMode(false);
            setShowPrompt(false);
        }
    };

    // Don't render if prompt shouldn't be shown
    if (!showPrompt) {
        return null;
    }

    // Get available cities based on selected country
    const availableCities = selectedCountry ? allCountries[selectedCountry] : [];

    // Get available languages based on selected country
    const availableLanguages = selectedCountry
        ? LANGUAGES[selectedCountry]
        : ['en', 'de', 'fr', 'it'];

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
            <div className="bg-black border border-yellow-500 text-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-yellow-400 text-center">
                    {t('location_prompt_title')}
                </h2>

                {!editMode ? (
                    // Location confirmation view
                    <>
                        <p className="mb-4 text-center">
                            {t('location_prompt_message')}
                        </p>

                        <div className="flex flex-col items-center justify-center mb-6">
                            <div className="text-2xl font-bold text-center bg-yellow-400 text-black px-6 py-3 rounded-lg mb-2">
                                {locationInfo.city || "Unknown"}
                            </div>
                            <div className="text-sm opacity-80">
                                {locationInfo.country || "Unknown"}
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={handleConfirm}
                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg"
                            >
                                {t('location_confirm')}
                            </button>
                            <button
                                onClick={() => setEditMode(true)}
                                className="bg-transparent hover:bg-gray-800 border border-yellow-500 text-yellow-500 font-bold py-2 px-4 rounded-lg"
                            >
                                {t('location_change')}
                            </button>
                        </div>
                    </>
                ) : (
                    // Location selection view
                    <>
                        <div className="space-y-4 mb-6">
                            {/* Country selection */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-yellow-400">
                                    {t('select_country')}
                                </label>
                                <select
                                    value={selectedCountry || ''}
                                    onChange={(e) => {
                                        const country = e.target.value as keyof typeof LOCATIONS;
                                        setSelectedCountry(country || null);
                                        setSelectedCity(null); // Reset city when country changes
                                    }}
                                    className="bg-gray-900 border border-yellow-400 text-white rounded-lg w-full p-2.5"
                                >
                                    <option value="">--</option>
                                    {Object.keys(allCountries).map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* City selection - only show if country selected */}
                            {selectedCountry && (
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-yellow-400">
                                        {t('select_city')}
                                    </label>
                                    <select
                                        value={selectedCity || ''}
                                        onChange={(e) => setSelectedCity(e.target.value || null)}
                                        className="bg-gray-900 border border-yellow-400 text-white rounded-lg w-full p-2.5"
                                    >
                                        <option value="">--</option>
                                        {availableCities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Language selection */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-yellow-400">
                                    {t('select_language')}
                                </label>
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                                    className="bg-gray-900 border border-yellow-400 text-white rounded-lg w-full p-2.5"
                                >
                                    {availableLanguages.map((lang) => (
                                        <option key={lang} value={lang}>
                                            {lang === 'en' ? 'English' :
                                                lang === 'de' ? 'Deutsch' :
                                                    lang === 'fr' ? 'Français' :
                                                        lang === 'it' ? 'Italiano' : lang}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setEditMode(false)}
                                className="flex-1 bg-transparent hover:bg-gray-800 border border-yellow-500 text-yellow-500 font-bold py-2 px-4 rounded-lg"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                disabled={!selectedCountry || !selectedCity}
                                className={`flex-1 font-bold py-2 px-4 rounded-lg ${!selectedCountry || !selectedCity
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                                    }`}
                            >
                                {t('confirm')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
} 