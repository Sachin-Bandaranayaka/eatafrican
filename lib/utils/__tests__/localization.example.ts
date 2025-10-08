/**
 * Content Localization Examples
 * 
 * This file demonstrates how to use the content localization utilities
 * for menu items and notifications in the food delivery platform.
 */

import {
  localizeMenuItem,
  localizeMenuItems,
  getLocalizedNotification,
  createTranslations,
  getLanguageFromRequest,
} from '../language';
import { Language } from '@/lib/types';

// ============================================================================
// Example 1: Localizing Menu Items in API Response
// ============================================================================

/**
 * Example: GET /api/restaurants/[id]/menu
 * Returns localized menu items based on user's language preference
 */
async function getRestaurantMenuExample(restaurantId: string, request: Request) {
  // Detect user language from request headers and user profile
  const headers = new Headers(request.headers);
  const user = { language: 'de' as Language }; // From authenticated user
  const language = getLanguageFromRequest(headers, user.language);

  // Fetch menu items from database
  const menuItems = [
    {
      id: '1',
      restaurantId,
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
      },
    },
  ];

  // Localize all menu items based on detected language
  const localizedItems = localizeMenuItems(menuItems, language);

  return {
    items: localizedItems,
    language,
  };
}

// ============================================================================
// Example 2: Sending Localized Notifications
// ============================================================================

/**
 * Example: Send order confirmation notification
 */
async function sendOrderConfirmationExample(
  userId: string,
  orderNumber: string,
  userLanguage: Language
) {
  const { title, message } = getLocalizedNotification(
    'orderConfirmed',
    userLanguage,
    [orderNumber]
  );

  const notification = {
    id: 'generated-id',
    userId,
    type: 'order_status' as const,
    title,
    message,
    data: { orderNumber },
    read: false,
    createdAt: new Date().toISOString(),
  };

  return notification;
}

export { getRestaurantMenuExample, sendOrderConfirmationExample };
