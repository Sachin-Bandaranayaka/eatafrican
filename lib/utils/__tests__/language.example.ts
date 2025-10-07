/**
 * Example usage of the language detection utility
 * 
 * This file demonstrates how to use the language detection functions
 * in various scenarios throughout the application.
 */

import { NextRequest } from 'next/server';
import {
  detectLanguage,
  getLanguageFromRequest,
  getLocalizedContent,
  parseAcceptLanguageHeader,
  isLanguageSupported,
  getLanguageName,
} from '../language';
import { Language } from '@/lib/types';

// Example 1: Detect language from Accept-Language header only
function example1() {
  const acceptLanguage = 'de-CH,de;q=0.9,en;q=0.8';
  const language = detectLanguage(acceptLanguage, null);
  console.log('Detected language:', language); // Output: 'de'
}

// Example 2: Detect language with user preference (highest priority)
function example2() {
  const acceptLanguage = 'de-CH,de;q=0.9,en;q=0.8';
  const userPreference: Language = 'fr'; // User has set French as preference
  const language = detectLanguage(acceptLanguage, userPreference);
  console.log('Detected language:', language); // Output: 'fr'
}

// Example 3: Use in Next.js API route
async function example3(request: NextRequest) {
  // Get authenticated user's language preference from database
  const user = { language: 'it' as Language }; // Example user object
  
  // Detect language considering both header and user preference
  const language = getLanguageFromRequest(request.headers, user.language);
  
  console.log('Language for this request:', language);
  return language;
}

// Example 4: Use in API route without authenticated user
async function example4(request: NextRequest) {
  // For guest users, only use Accept-Language header
  const language = getLanguageFromRequest(request.headers, null);
  
  console.log('Language for guest user:', language);
  return language;
}

// Example 5: Get localized menu item content
function example5() {
  const menuItem = {
    name: 'Injera with Doro Wat',
    description: 'Traditional Ethiopian dish',
    translations: {
      de: {
        name: 'Injera mit Doro Wat',
        description: 'Traditionelles äthiopisches Gericht',
      },
      fr: {
        name: 'Injera avec Doro Wat',
        description: 'Plat éthiopien traditionnel',
      },
      it: {
        name: 'Injera con Doro Wat',
        description: 'Piatto tradizionale etiope',
      },
    },
  };

  const userLanguage: Language = 'de';
  
  // Get localized content
  const localizedName = getLocalizedContent(
    {
      en: menuItem.name,
      ...Object.fromEntries(
        Object.entries(menuItem.translations || {}).map(([lang, trans]) => [
          lang,
          trans.name,
        ])
      ),
    } as Record<Language, string>,
    userLanguage
  );

  console.log('Localized name:', localizedName); // Output: 'Injera mit Doro Wat'
}

// Example 6: Validate language from query parameter
function example6(languageParam: string) {
  if (isLanguageSupported(languageParam)) {
    console.log(`${languageParam} is supported`);
    // Use the language
    const language: Language = languageParam as Language;
    return language;
  } else {
    console.log(`${languageParam} is not supported, using default`);
    return 'en' as Language;
  }
}

// Example 7: Display language selector
function example7() {
  const languages: Language[] = ['en', 'de', 'fr', 'it'];
  
  const languageOptions = languages.map(lang => ({
    value: lang,
    label: getLanguageName(lang),
  }));

  console.log('Language options:', languageOptions);
  // Output:
  // [
  //   { value: 'en', label: 'English' },
  //   { value: 'de', label: 'Deutsch' },
  //   { value: 'fr', label: 'Français' },
  //   { value: 'it', label: 'Italiano' }
  // ]
}

// Example 8: Parse Accept-Language header directly
function example8() {
  const header = 'en-US,en;q=0.9,de;q=0.8,fr;q=0.7,it;q=0.6';
  const language = parseAcceptLanguageHeader(header);
  console.log('Parsed language:', language); // Output: 'en'
}

// Example 9: Handle missing translations gracefully
function example9() {
  const notification = {
    translations: {
      en: 'Your order has been delivered',
      de: 'Ihre Bestellung wurde geliefert',
      // French and Italian translations missing
    },
  };

  const userLanguage: Language = 'fr';
  
  // Will fall back to English when French is not available
  const message = getLocalizedContent(
    notification.translations as Partial<Record<Language, string>>,
    userLanguage
  );

  console.log('Message:', message); // Output: 'Your order has been delivered'
}

// Example 10: Complete API route example
async function example10(request: NextRequest) {
  // Extract user from JWT token (example)
  const userId = 'user-123';
  
  // Fetch user from database
  // const user = await getUserById(userId);
  const user = { id: userId, language: 'de' as Language };
  
  // Detect language
  const language = getLanguageFromRequest(request.headers, user?.language);
  
  // Use language for response
  const messages = {
    en: 'Order created successfully',
    de: 'Bestellung erfolgreich erstellt',
    fr: 'Commande créée avec succès',
    it: 'Ordine creato con successo',
  };
  
  const message = getLocalizedContent(messages, language);
  
  return {
    success: true,
    message,
    language,
  };
}

export {
  example1,
  example2,
  example3,
  example4,
  example5,
  example6,
  example7,
  example8,
  example9,
  example10,
};
