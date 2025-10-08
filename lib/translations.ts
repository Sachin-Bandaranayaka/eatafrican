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
    | 'delivery_subtitle'
    | 'main_title'
    | 'tagline'
    | 'how_we_deliver'
    | 'restaurants_in_location'
    | 'african_restaurants'
    | 'country_specialty'
    | 'location'
    | 'restaurant'
    | 'change'
    | 'back'
    | 'view_menu'
    | 'choose_location_prompt'
    | 'about_specialty'
    | 'loading_locations';

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
        delivery_subtitle: 'CONVENIENTLY DELIVERED TO YOUR HOME',
        main_title: 'ORDER FRESHLY PREPARED AFRICAN FOOD DIRECTLY FROM AFRICAN RESTAURANTS AND HAVE IT CONVENIENTLY DELIVERED TO YOUR HOME',
        tagline: 'YOUR FAVOURITE AFRICAN MEALS JUST A FEW CLICKS AWAY, WHEREVER YOU ARE IN SWITZERLAND.',
        how_we_deliver: 'HOW WE DELIVER',
        restaurants_in_location: 'RESTAURANTS IN LUZERN',
        african_restaurants: 'AFRICAN RESTAURANTS',
        country_specialty: 'COUNTRY SPECIALTY',
        location: 'LOCATION',
        restaurant: 'RESTAURANT',
        change: 'CHANGE',
        back: 'BACK',
        view_menu: 'VIEW MENU',
        choose_location_prompt: 'CHOOSE A LOCATION TO SEE RESTAURANT LIST AND VIEW THEIR MENU',
        about_specialty: 'ABOUT ETHIOPIAN, ERITREAN SPECIALTY',
        loading_locations: 'Loading available locations...'
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
        delivery_subtitle: 'BEQUEM ZU IHNEN NACH HAUSE GELIEFERT',
        main_title: 'BESTELLEN SIE FRISCH ZUBEREITETES AFRIKANISCHES ESSEN DIREKT VON AFRIKANISCHEN RESTAURANTS UND LASSEN SIE ES BEQUEM ZU IHNEN NACH HAUSE LIEFERN',
        tagline: 'IHRE LIEBLINGS-AFRIKANISCHEN GERICHTE NUR WENIGE KLICKS ENTFERNT, WO IMMER SIE IN DER SCHWEIZ SIND.',
        how_we_deliver: 'WIE WIR LIEFERN',
        restaurants_in_location: 'RESTAURANTS IN LUZERN',
        african_restaurants: 'AFRIKANISCHE RESTAURANTS',
        country_specialty: 'LÄNDERSPEZIALITÄT',
        location: 'STANDORT',
        restaurant: 'RESTAURANT',
        change: 'ÄNDERN',
        back: 'ZURÜCK',
        view_menu: 'MENÜ ANSEHEN',
        choose_location_prompt: 'WÄHLEN SIE EINEN STANDORT, UM DIE RESTAURANTLISTE ZU SEHEN UND IHR MENÜ ANZUZEIGEN',
        about_specialty: 'ÜBER ÄTHIOPISCHE, ERITREISCHE SPEZIALITÄT',
        loading_locations: 'Verfügbare Standorte werden geladen...'
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
        delivery_subtitle: 'LIVRÉ COMMODÉMENT À VOTRE DOMICILE',
        main_title: 'COMMANDEZ DES PLATS AFRICAINS FRAÎCHEMENT PRÉPARÉS DIRECTEMENT AUPRÈS DES RESTAURANTS AFRICAINS ET FAITES-LES LIVRER COMMODÉMENT À VOTRE DOMICILE',
        tagline: 'VOS PLATS AFRICAINS PRÉFÉRÉS À QUELQUES CLICS, OÙ QUE VOUS SOYEZ EN SUISSE.',
        how_we_deliver: 'COMMENT NOUS LIVRONS',
        restaurants_in_location: 'RESTAURANTS À LUCERNE',
        african_restaurants: 'RESTAURANTS AFRICAINS',
        country_specialty: 'SPÉCIALITÉ DU PAYS',
        location: 'EMPLACEMENT',
        restaurant: 'RESTAURANT',
        change: 'CHANGER',
        back: 'RETOUR',
        view_menu: 'VOIR LE MENU',
        choose_location_prompt: 'CHOISISSEZ UN EMPLACEMENT POUR VOIR LA LISTE DES RESTAURANTS ET LEUR MENU',
        about_specialty: 'À PROPOS DE LA SPÉCIALITÉ ÉTHIOPIENNE ET ÉRYTHRÉENNE',
        loading_locations: 'Chargement des emplacements disponibles...'
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
        delivery_subtitle: 'COMODAMENTE CONSEGNATO A CASA TUA',
        main_title: 'ORDINA CIBO AFRICANO FRESCO DIRETTAMENTE DAI RISTORANTI AFRICANI E FATTI CONSEGNARE COMODAMENTE A CASA',
        tagline: 'I TUOI PIATTI AFRICANI PREFERITI A POCHI CLIC, OVUNQUE TU SIA IN SVIZZERA.',
        how_we_deliver: 'COME CONSEGNIAMO',
        restaurants_in_location: 'RISTORANTI A LUCERNA',
        african_restaurants: 'RISTORANTI AFRICANI',
        country_specialty: 'SPECIALITÀ DEL PAESE',
        location: 'POSIZIONE',
        restaurant: 'RISTORANTE',
        change: 'CAMBIA',
        back: 'INDIETRO',
        view_menu: 'VISUALIZZA MENU',
        choose_location_prompt: 'SCEGLI UNA POSIZIONE PER VEDERE LA LISTA DEI RISTORANTI E IL LORO MENU',
        about_specialty: 'INFORMAZIONI SULLA SPECIALITÀ ETIOPE ED ERITREA',
        loading_locations: 'Caricamento delle posizioni disponibili...'
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