// Simple translation system for the application
// Currently supporting English (en), German (de), French (fr), and Italian (it)

export type Language = 'en' | 'de' | 'fr' | 'it';

export type TranslationKey =
    | 'location_prompt_title'
    | 'location_prompt_message'
    | 'location_confirm'
    | 'location_change'
    | 'select_country'
    | 'select_city'
    | 'select_language'
    | 'confirm'
    | 'cancel'
    | 'how_it_works'
    | 'customer_feedback'
    | 'order_food_title'
    | 'delivery_subtitle';

type Translations = {
    [key in Language]: {
        [key in TranslationKey]: string;
    };
};

export const translations: Translations = {
    en: {
        location_prompt_title: 'Your Location',
        location_prompt_message: 'We detected your location as:',
        location_confirm: 'Yes, this is correct',
        location_change: 'Change location',
        select_country: 'Select country',
        select_city: 'Select city',
        select_language: 'Select language',
        confirm: 'Confirm',
        cancel: 'Cancel',
        how_it_works: 'HOW IT WORKS',
        customer_feedback: 'CUSTOMER FEEDBACK',
        order_food_title: 'ORDER FRESHLY PREPARED AFRICAN FOOD DIRECTLY FROM AFRICAN RESTAURANTS NEAR YOU',
        delivery_subtitle: 'CONVENIENTLY DELIVERED TO YOUR HOME'
    },
    de: {
        location_prompt_title: 'Ihr Standort',
        location_prompt_message: 'Wir haben Ihren Standort erkannt als:',
        location_confirm: 'Ja, das ist korrekt',
        location_change: 'Standort ändern',
        select_country: 'Land auswählen',
        select_city: 'Stadt auswählen',
        select_language: 'Sprache auswählen',
        confirm: 'Bestätigen',
        cancel: 'Abbrechen',
        how_it_works: 'WIE ES FUNKTIONIERT',
        customer_feedback: 'KUNDENFEEDBACK',
        order_food_title: 'BESTELLEN SIE FRISCH ZUBEREITETES AFRIKANISCHES ESSEN DIREKT VON AFRIKANISCHEN RESTAURANTS IN IHRER NÄHE',
        delivery_subtitle: 'BEQUEM ZU IHNEN NACH HAUSE GELIEFERT'
    },
    fr: {
        location_prompt_title: 'Votre emplacement',
        location_prompt_message: 'Nous avons détecté votre emplacement comme étant:',
        location_confirm: 'Oui, c\'est correct',
        location_change: 'Changer d\'emplacement',
        select_country: 'Sélectionner un pays',
        select_city: 'Sélectionner une ville',
        select_language: 'Sélectionner une langue',
        confirm: 'Confirmer',
        cancel: 'Annuler',
        how_it_works: 'COMMENT ÇA MARCHE',
        customer_feedback: 'AVIS DES CLIENTS',
        order_food_title: 'COMMANDEZ DES PLATS AFRICAINS FRAÎCHEMENT PRÉPARÉS DIRECTEMENT AUPRÈS DES RESTAURANTS AFRICAINS PRÈS DE CHEZ VOUS',
        delivery_subtitle: 'LIVRÉ COMMODÉMENT À VOTRE DOMICILE'
    },
    it: {
        location_prompt_title: 'La tua posizione',
        location_prompt_message: 'Abbiamo rilevato la tua posizione come:',
        location_confirm: 'Sì, è corretto',
        location_change: 'Cambia posizione',
        select_country: 'Seleziona paese',
        select_city: 'Seleziona città',
        select_language: 'Seleziona lingua',
        confirm: 'Conferma',
        cancel: 'Annulla',
        how_it_works: 'COME FUNZIONA',
        customer_feedback: 'FEEDBACK DEI CLIENTI',
        order_food_title: 'ORDINA CIBO AFRICANO FRESCO DIRETTAMENTE DAI RISTORANTI AFRICANI VICINO A TE',
        delivery_subtitle: 'COMODAMENTE CONSEGNATO A CASA TUA'
    }
};

export const getTranslation = (key: TranslationKey, language: Language = 'en'): string => {
    // Fallback to English if language not found
    if (!translations[language]) {
        return translations.en[key] || key;
    }

    // Fallback to the key if translation not found
    return translations[language][key] || translations.en[key] || key;
}; 