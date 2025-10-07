import { describe, it, expect } from 'vitest';
import {
  parseAcceptLanguageHeader,
  detectLanguage,
  isLanguageSupported,
  getLocalizedContent,
  getLanguageName,
  localizeMenuItem,
  localizeMenuItems,
  getLocalizedNotification,
  localizeRestaurant,
  createTranslations,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  NOTIFICATION_TEMPLATES,
} from '../language';
import { Language } from '@/lib/types';

describe('Language Detection Utility', () => {
  describe('parseAcceptLanguageHeader', () => {
    it('should parse simple Accept-Language header', () => {
      const result = parseAcceptLanguageHeader('en');
      expect(result).toBe('en');
    });

    it('should parse Accept-Language header with region', () => {
      const result = parseAcceptLanguageHeader('en-US');
      expect(result).toBe('en');
    });

    it('should parse Accept-Language header with quality values', () => {
      const result = parseAcceptLanguageHeader('en-US,en;q=0.9,de;q=0.8,fr;q=0.7');
      expect(result).toBe('en');
    });

    it('should return highest quality supported language', () => {
      const result = parseAcceptLanguageHeader('ja;q=0.9,de;q=0.8,en;q=0.7');
      expect(result).toBe('de');
    });

    it('should return null for unsupported languages', () => {
      const result = parseAcceptLanguageHeader('ja,zh,ko');
      expect(result).toBeNull();
    });

    it('should return null for null header', () => {
      const result = parseAcceptLanguageHeader(null);
      expect(result).toBeNull();
    });

    it('should handle German language', () => {
      const result = parseAcceptLanguageHeader('de-CH,de;q=0.9');
      expect(result).toBe('de');
    });

    it('should handle French language', () => {
      const result = parseAcceptLanguageHeader('fr-CH,fr;q=0.9');
      expect(result).toBe('fr');
    });

    it('should handle Italian language', () => {
      const result = parseAcceptLanguageHeader('it-CH,it;q=0.9');
      expect(result).toBe('it');
    });
  });

  describe('detectLanguage', () => {
    it('should prioritize user language preference', () => {
      const result = detectLanguage('en-US', 'de');
      expect(result).toBe('de');
    });

    it('should fall back to Accept-Language header when no user preference', () => {
      const result = detectLanguage('fr-CH,fr;q=0.9', null);
      expect(result).toBe('fr');
    });

    it('should fall back to default language when no header or preference', () => {
      const result = detectLanguage(null, null);
      expect(result).toBe(DEFAULT_LANGUAGE);
    });

    it('should fall back to header when user preference is invalid', () => {
      const result = detectLanguage('de-CH', 'invalid' as Language);
      expect(result).toBe('de');
    });

    it('should default to English when header has unsupported language', () => {
      const result = detectLanguage('ja,zh', null);
      expect(result).toBe('en');
    });
  });

  describe('isLanguageSupported', () => {
    it('should return true for supported languages', () => {
      expect(isLanguageSupported('en')).toBe(true);
      expect(isLanguageSupported('de')).toBe(true);
      expect(isLanguageSupported('fr')).toBe(true);
      expect(isLanguageSupported('it')).toBe(true);
    });

    it('should return false for unsupported languages', () => {
      expect(isLanguageSupported('ja')).toBe(false);
      expect(isLanguageSupported('zh')).toBe(false);
      expect(isLanguageSupported('es')).toBe(false);
    });
  });

  describe('getLocalizedContent', () => {
    const translations = {
      en: 'Hello',
      de: 'Hallo',
      fr: 'Bonjour',
      it: 'Ciao',
    };

    it('should return content in preferred language', () => {
      expect(getLocalizedContent(translations, 'de')).toBe('Hallo');
      expect(getLocalizedContent(translations, 'fr')).toBe('Bonjour');
    });

    it('should fall back to English when translation missing', () => {
      const partialTranslations = { en: 'Hello' };
      expect(getLocalizedContent(partialTranslations, 'de')).toBe('Hello');
    });

    it('should return first available translation when English missing', () => {
      const partialTranslations = { de: 'Hallo' };
      expect(getLocalizedContent(partialTranslations, 'fr')).toBe('Hallo');
    });

    it('should return undefined when no translations available', () => {
      expect(getLocalizedContent({}, 'en')).toBeUndefined();
    });
  });

  describe('getLanguageName', () => {
    it('should return native language names', () => {
      expect(getLanguageName('en')).toBe('English');
      expect(getLanguageName('de')).toBe('Deutsch');
      expect(getLanguageName('fr')).toBe('Français');
      expect(getLanguageName('it')).toBe('Italiano');
    });
  });

  describe('SUPPORTED_LANGUAGES', () => {
    it('should contain all four supported languages', () => {
      expect(SUPPORTED_LANGUAGES).toEqual(['en', 'de', 'fr', 'it']);
    });
  });

  describe('DEFAULT_LANGUAGE', () => {
    it('should be English', () => {
      expect(DEFAULT_LANGUAGE).toBe('en');
    });
  });
});

describe('Content Localization', () => {
  describe('localizeMenuItem', () => {
    const menuItem = {
      id: '1',
      name: 'Injera with Doro Wat',
      description: 'Traditional Ethiopian flatbread with spicy chicken stew',
      price: 24.50,
      translations: {
        de: {
          name: 'Injera mit Doro Wat',
          description: 'Traditionelles äthiopisches Fladenbrot mit würzigem Hühnereintopf',
        },
        fr: {
          name: 'Injera avec Doro Wat',
          description: 'Pain plat éthiopien traditionnel avec ragoût de poulet épicé',
        },
        it: {
          name: 'Injera con Doro Wat',
          description: 'Pane piatto etiope tradizionale con stufato di pollo piccante',
        },
      },
    };

    it('should return item as-is for English', () => {
      const result = localizeMenuItem(menuItem, 'en');
      expect(result.name).toBe('Injera with Doro Wat');
      expect(result.description).toBe('Traditional Ethiopian flatbread with spicy chicken stew');
    });

    it('should localize item to German', () => {
      const result = localizeMenuItem(menuItem, 'de');
      expect(result.name).toBe('Injera mit Doro Wat');
      expect(result.description).toBe('Traditionelles äthiopisches Fladenbrot mit würzigem Hühnereintopf');
    });

    it('should localize item to French', () => {
      const result = localizeMenuItem(menuItem, 'fr');
      expect(result.name).toBe('Injera avec Doro Wat');
      expect(result.description).toBe('Pain plat éthiopien traditionnel avec ragoût de poulet épicé');
    });

    it('should localize item to Italian', () => {
      const result = localizeMenuItem(menuItem, 'it');
      expect(result.name).toBe('Injera con Doro Wat');
      expect(result.description).toBe('Pane piatto etiope tradizionale con stufato di pollo piccante');
    });

    it('should return original when translation missing', () => {
      const itemWithoutTranslations = {
        id: '2',
        name: 'Jollof Rice',
        description: 'West African rice dish',
        price: 18.00,
      };
      const result = localizeMenuItem(itemWithoutTranslations, 'de');
      expect(result.name).toBe('Jollof Rice');
      expect(result.description).toBe('West African rice dish');
    });

    it('should preserve all other properties', () => {
      const result = localizeMenuItem(menuItem, 'de');
      expect(result.id).toBe('1');
      expect(result.price).toBe(24.50);
      expect(result.translations).toBeDefined();
    });
  });

  describe('localizeMenuItems', () => {
    const menuItems = [
      {
        id: '1',
        name: 'Injera',
        description: 'Ethiopian flatbread',
        translations: {
          de: { name: 'Injera', description: 'Äthiopisches Fladenbrot' },
        },
      },
      {
        id: '2',
        name: 'Jollof Rice',
        description: 'West African rice',
        translations: {
          de: { name: 'Jollof Reis', description: 'Westafrikanischer Reis' },
        },
      },
    ];

    it('should localize all items in array', () => {
      const results = localizeMenuItems(menuItems, 'de');
      expect(results).toHaveLength(2);
      expect(results[0].name).toBe('Injera');
      expect(results[0].description).toBe('Äthiopisches Fladenbrot');
      expect(results[1].name).toBe('Jollof Reis');
      expect(results[1].description).toBe('Westafrikanischer Reis');
    });

    it('should handle empty array', () => {
      const results = localizeMenuItems([], 'de');
      expect(results).toEqual([]);
    });
  });

  describe('getLocalizedNotification', () => {
    it('should get order confirmed notification in English', () => {
      const result = getLocalizedNotification('orderConfirmed', 'en', ['ORD-12345']);
      expect(result.title).toBe('Order Confirmed');
      expect(result.message).toBe('Your order ORD-12345 has been confirmed and is being prepared.');
    });

    it('should get order confirmed notification in German', () => {
      const result = getLocalizedNotification('orderConfirmed', 'de', ['ORD-12345']);
      expect(result.title).toBe('Bestellung bestätigt');
      expect(result.message).toBe('Ihre Bestellung ORD-12345 wurde bestätigt und wird zubereitet.');
    });

    it('should get order in transit notification with driver name', () => {
      const result = getLocalizedNotification('orderInTransit', 'en', ['ORD-12345', 'John']);
      expect(result.title).toBe('Order On The Way');
      expect(result.message).toContain('ORD-12345');
      expect(result.message).toContain('John');
    });

    it('should get welcome notification with first name', () => {
      const result = getLocalizedNotification('welcomeCustomer', 'fr', ['Marie']);
      expect(result.title).toBe('Bienvenue chez EatAfrican');
      expect(result.message).toContain('Marie');
    });

    it('should get loyalty points earned notification', () => {
      const result = getLocalizedNotification('loyaltyPointsEarned', 'it', [50, 'ORD-12345']);
      expect(result.title).toBe('Punti fedeltà guadagnati');
      expect(result.message).toContain('50');
      expect(result.message).toContain('ORD-12345');
    });

    it('should get restaurant approved notification', () => {
      const result = getLocalizedNotification('restaurantApproved', 'de', ['Addis Restaurant']);
      expect(result.title).toBe('Restaurant genehmigt');
      expect(result.message).toContain('Addis Restaurant');
    });

    it('should handle notification without parameters', () => {
      const result = getLocalizedNotification('driverApproved', 'en', []);
      expect(result.title).toBe('Driver Account Approved');
      expect(result.message).toContain('Congratulations');
    });

    it('should fall back to English for unsupported language', () => {
      const result = getLocalizedNotification('orderDelivered', 'en', ['ORD-12345']);
      expect(result.title).toBe('Order Delivered');
      expect(result.message).toContain('ORD-12345');
    });

    it('should throw error for unknown template', () => {
      expect(() => {
        getLocalizedNotification('unknownTemplate' as any, 'en', []);
      }).toThrow('Unknown notification template');
    });
  });

  describe('localizeRestaurant', () => {
    const restaurant = {
      id: '1',
      name: 'Addis Ababa Restaurant',
      description: 'Authentic Ethiopian cuisine',
      translations: {
        de: {
          name: 'Addis Ababa Restaurant',
          description: 'Authentische äthiopische Küche',
        },
        fr: {
          name: 'Restaurant Addis Ababa',
          description: 'Cuisine éthiopienne authentique',
        },
      },
    };

    it('should return restaurant as-is for English', () => {
      const result = localizeRestaurant(restaurant, 'en');
      expect(result.name).toBe('Addis Ababa Restaurant');
      expect(result.description).toBe('Authentic Ethiopian cuisine');
    });

    it('should localize restaurant to German', () => {
      const result = localizeRestaurant(restaurant, 'de');
      expect(result.name).toBe('Addis Ababa Restaurant');
      expect(result.description).toBe('Authentische äthiopische Küche');
    });

    it('should localize restaurant to French', () => {
      const result = localizeRestaurant(restaurant, 'fr');
      expect(result.name).toBe('Restaurant Addis Ababa');
      expect(result.description).toBe('Cuisine éthiopienne authentique');
    });

    it('should return original when translation missing', () => {
      const result = localizeRestaurant(restaurant, 'it');
      expect(result.name).toBe('Addis Ababa Restaurant');
      expect(result.description).toBe('Authentic Ethiopian cuisine');
    });
  });

  describe('createTranslations', () => {
    it('should create translations object with base content', () => {
      const result = createTranslations({
        name: 'Jollof Rice',
        description: 'West African rice dish',
      });
      expect(result.en).toEqual({
        name: 'Jollof Rice',
        description: 'West African rice dish',
      });
    });

    it('should add additional translations', () => {
      const result = createTranslations(
        {
          name: 'Jollof Rice',
          description: 'West African rice dish',
        },
        {
          de: {
            name: 'Jollof Reis',
            description: 'Westafrikanisches Reisgericht',
          },
          fr: {
            name: 'Riz Jollof',
            description: 'Plat de riz ouest-africain',
          },
        }
      );
      expect(result.en.name).toBe('Jollof Rice');
      expect(result.de?.name).toBe('Jollof Reis');
      expect(result.fr?.name).toBe('Riz Jollof');
    });

    it('should filter out invalid language codes', () => {
      const result = createTranslations(
        {
          name: 'Test',
          description: 'Test description',
        },
        {
          invalid: { name: 'Invalid', description: 'Invalid' },
        } as any
      );
      expect(result.invalid).toBeUndefined();
      expect(result.en).toBeDefined();
    });
  });

  describe('NOTIFICATION_TEMPLATES', () => {
    it('should have all required notification types', () => {
      expect(NOTIFICATION_TEMPLATES.orderConfirmed).toBeDefined();
      expect(NOTIFICATION_TEMPLATES.orderPreparing).toBeDefined();
      expect(NOTIFICATION_TEMPLATES.orderReadyForPickup).toBeDefined();
      expect(NOTIFICATION_TEMPLATES.orderInTransit).toBeDefined();
      expect(NOTIFICATION_TEMPLATES.orderDelivered).toBeDefined();
      expect(NOTIFICATION_TEMPLATES.orderCancelled).toBeDefined();
      expect(NOTIFICATION_TEMPLATES.restaurantApproved).toBeDefined();
      expect(NOTIFICATION_TEMPLATES.driverApproved).toBeDefined();
      expect(NOTIFICATION_TEMPLATES.welcomeCustomer).toBeDefined();
      expect(NOTIFICATION_TEMPLATES.passwordReset).toBeDefined();
      expect(NOTIFICATION_TEMPLATES.loyaltyPointsEarned).toBeDefined();
      expect(NOTIFICATION_TEMPLATES.loyaltyPointsRedeemed).toBeDefined();
    });

    it('should have all languages for each template', () => {
      Object.values(NOTIFICATION_TEMPLATES).forEach((template) => {
        SUPPORTED_LANGUAGES.forEach((lang) => {
          expect(template.title[lang]).toBeDefined();
          expect(template.message[lang]).toBeDefined();
        });
      });
    });
  });
});
