import { Language } from '@/lib/types';

/**
 * Supported languages on the platform
 */
export const SUPPORTED_LANGUAGES: Language[] = ['en', 'de', 'fr', 'it'];

/**
 * Default language when no preference is found
 */
export const DEFAULT_LANGUAGE: Language = 'en';

/**
 * Parse Accept-Language header and return the best matching supported language
 * 
 * Accept-Language format: "en-US,en;q=0.9,de;q=0.8,fr;q=0.7"
 * 
 * @param acceptLanguageHeader - The Accept-Language header value
 * @returns The best matching supported language or null if none found
 */
export function parseAcceptLanguageHeader(acceptLanguageHeader: string | null): Language | null {
  if (!acceptLanguageHeader) {
    return null;
  }

  // Parse the Accept-Language header into language preferences with quality values
  const languagePreferences = acceptLanguageHeader
    .split(',')
    .map(lang => {
      const parts = lang.trim().split(';');
      const code = parts[0].toLowerCase();
      const quality = parts[1] ? parseFloat(parts[1].split('=')[1]) : 1.0;
      
      // Extract base language code (e.g., "en-US" -> "en")
      const baseCode = code.split('-')[0];
      
      return { code: baseCode, quality };
    })
    .sort((a, b) => b.quality - a.quality); // Sort by quality (highest first)

  // Find the first supported language
  for (const pref of languagePreferences) {
    if (SUPPORTED_LANGUAGES.includes(pref.code as Language)) {
      return pref.code as Language;
    }
  }

  return null;
}

/**
 * Detect user language from multiple sources with fallback priority:
 * 1. User profile language preference (if user is authenticated)
 * 2. Accept-Language header from request
 * 3. Default to English
 * 
 * @param acceptLanguageHeader - The Accept-Language header from the request
 * @param userLanguagePreference - The user's stored language preference (optional)
 * @returns The detected language
 */
export function detectLanguage(
  acceptLanguageHeader: string | null,
  userLanguagePreference?: Language | null
): Language {
  // Priority 1: User profile language preference
  if (userLanguagePreference && SUPPORTED_LANGUAGES.includes(userLanguagePreference)) {
    return userLanguagePreference;
  }

  // Priority 2: Accept-Language header
  const headerLanguage = parseAcceptLanguageHeader(acceptLanguageHeader);
  if (headerLanguage) {
    return headerLanguage;
  }

  // Priority 3: Default language
  return DEFAULT_LANGUAGE;
}

/**
 * Get language from Next.js request headers
 * 
 * @param headers - Next.js request headers
 * @param userLanguagePreference - The user's stored language preference (optional)
 * @returns The detected language
 */
export function getLanguageFromRequest(
  headers: Headers,
  userLanguagePreference?: Language | null
): Language {
  const acceptLanguage = headers.get('accept-language');
  return detectLanguage(acceptLanguage, userLanguagePreference);
}

/**
 * Validate if a language code is supported
 * 
 * @param language - The language code to validate
 * @returns True if the language is supported
 */
export function isLanguageSupported(language: string): language is Language {
  return SUPPORTED_LANGUAGES.includes(language as Language);
}

/**
 * Get localized content based on language preference
 * Falls back to English if translation is missing
 * 
 * @param translations - Object with translations for each language
 * @param language - The preferred language
 * @returns The localized content
 */
export function getLocalizedContent<T>(
  translations: Partial<Record<Language, T>>,
  language: Language
): T | undefined {
  // Try to get content in preferred language
  if (translations[language]) {
    return translations[language];
  }

  // Fall back to English
  if (translations[DEFAULT_LANGUAGE]) {
    return translations[DEFAULT_LANGUAGE];
  }

  // Return first available translation
  const availableLanguages = Object.keys(translations) as Language[];
  if (availableLanguages.length > 0) {
    return translations[availableLanguages[0]];
  }

  return undefined;
}

/**
 * Get language name in its native form
 * 
 * @param language - The language code
 * @returns The language name in its native form
 */
export function getLanguageName(language: Language): string {
  const languageNames: Record<Language, string> = {
    en: 'English',
    de: 'Deutsch',
    fr: 'Français',
    it: 'Italiano',
  };

  return languageNames[language];
}

// ============================================================================
// Content Localization Functions
// ============================================================================

/**
 * Translation object for menu items
 */
export interface MenuItemTranslations {
  name: string;
  description: string;
}

/**
 * Localize menu item content based on user language
 * Falls back to default content if translation is missing
 * 
 * @param item - Menu item with optional translations
 * @param language - The preferred language
 * @returns Localized menu item
 */
export function localizeMenuItem<T extends {
  name: string;
  description: string;
  translations?: Record<string, MenuItemTranslations>;
}>(item: T, language: Language): T {
  // If no translations or language is English, return as-is
  if (!item.translations || language === DEFAULT_LANGUAGE) {
    return item;
  }

  // Get translation for the requested language
  const translation = item.translations[language];
  
  if (translation) {
    return {
      ...item,
      name: translation.name || item.name,
      description: translation.description || item.description,
    };
  }

  // No translation found, return original
  return item;
}

/**
 * Localize multiple menu items
 * 
 * @param items - Array of menu items
 * @param language - The preferred language
 * @returns Array of localized menu items
 */
export function localizeMenuItems<T extends {
  name: string;
  description: string;
  translations?: Record<string, MenuItemTranslations>;
}>(items: T[], language: Language): T[] {
  return items.map(item => localizeMenuItem(item, language));
}

/**
 * Notification message templates for different types and languages
 */
export interface NotificationTemplates {
  orderConfirmed: {
    title: Record<Language, string>;
    message: Record<Language, (orderNumber: string) => string>;
  };
  orderPreparing: {
    title: Record<Language, string>;
    message: Record<Language, (orderNumber: string) => string>;
  };
  orderReadyForPickup: {
    title: Record<Language, string>;
    message: Record<Language, (orderNumber: string) => string>;
  };
  orderInTransit: {
    title: Record<Language, string>;
    message: Record<Language, (orderNumber: string, driverName: string) => string>;
  };
  orderDelivered: {
    title: Record<Language, string>;
    message: Record<Language, (orderNumber: string) => string>;
  };
  orderCancelled: {
    title: Record<Language, string>;
    message: Record<Language, (orderNumber: string) => string>;
  };
  restaurantApproved: {
    title: Record<Language, string>;
    message: Record<Language, (restaurantName: string) => string>;
  };
  driverApproved: {
    title: Record<Language, string>;
    message: Record<Language, string>;
  };
  welcomeCustomer: {
    title: Record<Language, string>;
    message: Record<Language, (firstName: string) => string>;
  };
  passwordReset: {
    title: Record<Language, string>;
    message: Record<Language, string>;
  };
  loyaltyPointsEarned: {
    title: Record<Language, string>;
    message: Record<Language, (points: number, orderNumber: string) => string>;
  };
  loyaltyPointsRedeemed: {
    title: Record<Language, string>;
    message: Record<Language, (points: number, voucherCode: string) => string>;
  };
}

/**
 * Predefined notification templates in all supported languages
 */
export const NOTIFICATION_TEMPLATES: NotificationTemplates = {
  orderConfirmed: {
    title: {
      en: 'Order Confirmed',
      de: 'Bestellung bestätigt',
      fr: 'Commande confirmée',
      it: 'Ordine confermato',
    },
    message: {
      en: (orderNumber) => `Your order ${orderNumber} has been confirmed and is being prepared.`,
      de: (orderNumber) => `Ihre Bestellung ${orderNumber} wurde bestätigt und wird zubereitet.`,
      fr: (orderNumber) => `Votre commande ${orderNumber} a été confirmée et est en cours de préparation.`,
      it: (orderNumber) => `Il tuo ordine ${orderNumber} è stato confermato ed è in preparazione.`,
    },
  },
  orderPreparing: {
    title: {
      en: 'Order Being Prepared',
      de: 'Bestellung wird zubereitet',
      fr: 'Commande en préparation',
      it: 'Ordine in preparazione',
    },
    message: {
      en: (orderNumber) => `Your order ${orderNumber} is being prepared by the restaurant.`,
      de: (orderNumber) => `Ihre Bestellung ${orderNumber} wird vom Restaurant zubereitet.`,
      fr: (orderNumber) => `Votre commande ${orderNumber} est en cours de préparation par le restaurant.`,
      it: (orderNumber) => `Il tuo ordine ${orderNumber} è in preparazione dal ristorante.`,
    },
  },
  orderReadyForPickup: {
    title: {
      en: 'Order Ready for Pickup',
      de: 'Bestellung abholbereit',
      fr: 'Commande prête pour le ramassage',
      it: 'Ordine pronto per il ritiro',
    },
    message: {
      en: (orderNumber) => `Your order ${orderNumber} is ready and waiting for driver pickup.`,
      de: (orderNumber) => `Ihre Bestellung ${orderNumber} ist fertig und wartet auf die Abholung durch den Fahrer.`,
      fr: (orderNumber) => `Votre commande ${orderNumber} est prête et attend le ramassage par le chauffeur.`,
      it: (orderNumber) => `Il tuo ordine ${orderNumber} è pronto e in attesa del ritiro da parte del corriere.`,
    },
  },
  orderInTransit: {
    title: {
      en: 'Order On The Way',
      de: 'Bestellung unterwegs',
      fr: 'Commande en route',
      it: 'Ordine in arrivo',
    },
    message: {
      en: (orderNumber, driverName) => `Your order ${orderNumber} is on the way! ${driverName} is delivering your food.`,
      de: (orderNumber, driverName) => `Ihre Bestellung ${orderNumber} ist unterwegs! ${driverName} liefert Ihr Essen.`,
      fr: (orderNumber, driverName) => `Votre commande ${orderNumber} est en route ! ${driverName} livre votre nourriture.`,
      it: (orderNumber, driverName) => `Il tuo ordine ${orderNumber} è in arrivo! ${driverName} sta consegnando il tuo cibo.`,
    },
  },
  orderDelivered: {
    title: {
      en: 'Order Delivered',
      de: 'Bestellung zugestellt',
      fr: 'Commande livrée',
      it: 'Ordine consegnato',
    },
    message: {
      en: (orderNumber) => `Your order ${orderNumber} has been delivered. Enjoy your meal!`,
      de: (orderNumber) => `Ihre Bestellung ${orderNumber} wurde zugestellt. Guten Appetit!`,
      fr: (orderNumber) => `Votre commande ${orderNumber} a été livrée. Bon appétit !`,
      it: (orderNumber) => `Il tuo ordine ${orderNumber} è stato consegnato. Buon appetito!`,
    },
  },
  orderCancelled: {
    title: {
      en: 'Order Cancelled',
      de: 'Bestellung storniert',
      fr: 'Commande annulée',
      it: 'Ordine annullato',
    },
    message: {
      en: (orderNumber) => `Your order ${orderNumber} has been cancelled.`,
      de: (orderNumber) => `Ihre Bestellung ${orderNumber} wurde storniert.`,
      fr: (orderNumber) => `Votre commande ${orderNumber} a été annulée.`,
      it: (orderNumber) => `Il tuo ordine ${orderNumber} è stato annullato.`,
    },
  },
  restaurantApproved: {
    title: {
      en: 'Restaurant Approved',
      de: 'Restaurant genehmigt',
      fr: 'Restaurant approuvé',
      it: 'Ristorante approvato',
    },
    message: {
      en: (restaurantName) => `Congratulations! Your restaurant "${restaurantName}" has been approved and is now live on the platform.`,
      de: (restaurantName) => `Herzlichen Glückwunsch! Ihr Restaurant "${restaurantName}" wurde genehmigt und ist jetzt auf der Plattform verfügbar.`,
      fr: (restaurantName) => `Félicitations ! Votre restaurant "${restaurantName}" a été approuvé et est maintenant en ligne sur la plateforme.`,
      it: (restaurantName) => `Congratulazioni! Il tuo ristorante "${restaurantName}" è stato approvato ed è ora disponibile sulla piattaforma.`,
    },
  },
  driverApproved: {
    title: {
      en: 'Driver Account Approved',
      de: 'Fahrerkonto genehmigt',
      fr: 'Compte chauffeur approuvé',
      it: 'Account corriere approvato',
    },
    message: {
      en: 'Congratulations! Your driver account has been approved. You can now start accepting deliveries.',
      de: 'Herzlichen Glückwunsch! Ihr Fahrerkonto wurde genehmigt. Sie können jetzt Lieferungen annehmen.',
      fr: 'Félicitations ! Votre compte chauffeur a été approuvé. Vous pouvez maintenant commencer à accepter des livraisons.',
      it: 'Congratulazioni! Il tuo account corriere è stato approvato. Ora puoi iniziare ad accettare consegne.',
    },
  },
  welcomeCustomer: {
    title: {
      en: 'Welcome to EatAfrican',
      de: 'Willkommen bei EatAfrican',
      fr: 'Bienvenue chez EatAfrican',
      it: 'Benvenuto su EatAfrican',
    },
    message: {
      en: (firstName) => `Welcome ${firstName}! Thank you for joining EatAfrican. Start exploring delicious African cuisine near you.`,
      de: (firstName) => `Willkommen ${firstName}! Vielen Dank, dass Sie EatAfrican beigetreten sind. Entdecken Sie köstliche afrikanische Küche in Ihrer Nähe.`,
      fr: (firstName) => `Bienvenue ${firstName} ! Merci de rejoindre EatAfrican. Commencez à explorer la délicieuse cuisine africaine près de chez vous.`,
      it: (firstName) => `Benvenuto ${firstName}! Grazie per esserti unito a EatAfrican. Inizia a esplorare la deliziosa cucina africana vicino a te.`,
    },
  },
  passwordReset: {
    title: {
      en: 'Password Reset Request',
      de: 'Anfrage zum Zurücksetzen des Passworts',
      fr: 'Demande de réinitialisation du mot de passe',
      it: 'Richiesta di reimpostazione password',
    },
    message: {
      en: 'We received a request to reset your password. Click the link in the email to reset your password.',
      de: 'Wir haben eine Anfrage zum Zurücksetzen Ihres Passworts erhalten. Klicken Sie auf den Link in der E-Mail, um Ihr Passwort zurückzusetzen.',
      fr: 'Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le lien dans l\'e-mail pour réinitialiser votre mot de passe.',
      it: 'Abbiamo ricevuto una richiesta di reimpostazione della password. Fai clic sul link nell\'email per reimpostare la password.',
    },
  },
  loyaltyPointsEarned: {
    title: {
      en: 'Loyalty Points Earned',
      de: 'Treuepunkte verdient',
      fr: 'Points de fidélité gagnés',
      it: 'Punti fedeltà guadagnati',
    },
    message: {
      en: (points, orderNumber) => `You earned ${points} loyalty points from order ${orderNumber}!`,
      de: (points, orderNumber) => `Sie haben ${points} Treuepunkte aus Bestellung ${orderNumber} verdient!`,
      fr: (points, orderNumber) => `Vous avez gagné ${points} points de fidélité de la commande ${orderNumber} !`,
      it: (points, orderNumber) => `Hai guadagnato ${points} punti fedeltà dall'ordine ${orderNumber}!`,
    },
  },
  loyaltyPointsRedeemed: {
    title: {
      en: 'Loyalty Points Redeemed',
      de: 'Treuepunkte eingelöst',
      fr: 'Points de fidélité échangés',
      it: 'Punti fedeltà riscattati',
    },
    message: {
      en: (points, voucherCode) => `You redeemed ${points} points for voucher code: ${voucherCode}`,
      de: (points, voucherCode) => `Sie haben ${points} Punkte für den Gutscheincode eingelöst: ${voucherCode}`,
      fr: (points, voucherCode) => `Vous avez échangé ${points} points pour le code promo : ${voucherCode}`,
      it: (points, voucherCode) => `Hai riscattato ${points} punti per il codice voucher: ${voucherCode}`,
    },
  },
};

/**
 * Get localized notification content
 * 
 * @param templateKey - The notification template key
 * @param language - The preferred language
 * @param params - Parameters to pass to the message template function
 * @returns Localized notification title and message
 */
export function getLocalizedNotification(
  templateKey: keyof NotificationTemplates,
  language: Language,
  params?: any[]
): { title: string; message: string } {
  const template = NOTIFICATION_TEMPLATES[templateKey];
  
  if (!template) {
    throw new Error(`Unknown notification template: ${templateKey}`);
  }

  const title = template.title[language] || template.title[DEFAULT_LANGUAGE];
  
  // Get message - it might be a function or a string
  const messageTemplate = template.message[language] || template.message[DEFAULT_LANGUAGE];
  const message = typeof messageTemplate === 'function' 
    ? messageTemplate(...(params || []))
    : messageTemplate;

  return { title, message };
}

/**
 * Get localized restaurant description
 * Useful for future expansion when restaurants have multilingual descriptions
 * 
 * @param restaurant - Restaurant object with optional translations
 * @param language - The preferred language
 * @returns Localized restaurant
 */
export function localizeRestaurant<T extends {
  name: string;
  description: string;
  translations?: Record<string, { name: string; description: string }>;
}>(restaurant: T, language: Language): T {
  // If no translations or language is English, return as-is
  if (!restaurant.translations || language === DEFAULT_LANGUAGE) {
    return restaurant;
  }

  // Get translation for the requested language
  const translation = restaurant.translations[language];
  
  if (translation) {
    return {
      ...restaurant,
      name: translation.name || restaurant.name,
      description: translation.description || restaurant.description,
    };
  }

  // No translation found, return original
  return restaurant;
}

/**
 * Helper to create a translations object from base content
 * Useful when creating new menu items or content
 * 
 * @param baseContent - The base content in English
 * @param translations - Additional translations for other languages
 * @returns Complete translations object
 */
export function createTranslations(
  baseContent: { name: string; description: string },
  translations?: Partial<Record<Language, { name: string; description: string }>>
): Record<string, { name: string; description: string }> {
  const result: Record<string, { name: string; description: string }> = {
    en: baseContent,
  };

  if (translations) {
    Object.entries(translations).forEach(([lang, content]) => {
      if (content && isLanguageSupported(lang)) {
        result[lang] = content;
      }
    });
  }

  return result;
}
