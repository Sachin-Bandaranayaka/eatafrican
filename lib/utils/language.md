# Language Detection Utility

This utility provides comprehensive language detection and localization support for the food delivery platform, supporting English (EN), German (DE), French (FR), and Italian (IT) as required for the Swiss market.

## Features

- **Multi-source Language Detection**: Detects user language from Accept-Language headers and user profile preferences
- **Fallback Strategy**: Implements a priority-based fallback system (user preference → header → default)
- **Content Localization**: Helper functions for retrieving localized content with automatic fallbacks
- **Type-Safe**: Full TypeScript support with proper type guards

## Requirements Satisfied

This implementation satisfies the following requirements from Requirement 11 (Multi-language and Localization):

- **11.1**: User language preference storage and retrieval
- **11.2**: Multilingual content support
- **11.3**: Language-based notification delivery
- **11.6**: Fallback to English when translation is missing
- **11.7**: Dynamic language updates

## API Reference

### Core Functions

#### `detectLanguage(acceptLanguageHeader, userLanguagePreference)`

Detects the user's language with the following priority:
1. User profile language preference (if authenticated)
2. Accept-Language header from request
3. Default to English

```typescript
const language = detectLanguage('de-CH,de;q=0.9', 'fr');
// Returns: 'fr' (user preference takes priority)

const language = detectLanguage('de-CH,de;q=0.9', null);
// Returns: 'de' (from header)

const language = detectLanguage(null, null);
// Returns: 'en' (default)
```

#### `getLanguageFromRequest(headers, userLanguagePreference)`

Convenience function for Next.js API routes that extracts the Accept-Language header and detects language.

```typescript
// In a Next.js API route
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  const language = getLanguageFromRequest(request.headers, user?.language);
  
  // Use language for response...
}
```

#### `parseAcceptLanguageHeader(acceptLanguageHeader)`

Parses the Accept-Language header and returns the best matching supported language.

```typescript
const language = parseAcceptLanguageHeader('en-US,en;q=0.9,de;q=0.8');
// Returns: 'en'

const language = parseAcceptLanguageHeader('ja,zh,de;q=0.5');
// Returns: 'de' (first supported language)

const language = parseAcceptLanguageHeader('ja,zh');
// Returns: null (no supported languages)
```

#### `getLocalizedContent(translations, language)`

Retrieves localized content with automatic fallback to English or first available translation.

```typescript
const translations = {
  en: 'Hello',
  de: 'Hallo',
  fr: 'Bonjour',
  it: 'Ciao',
};

const content = getLocalizedContent(translations, 'de');
// Returns: 'Hallo'

const content = getLocalizedContent({ en: 'Hello' }, 'fr');
// Returns: 'Hello' (fallback to English)
```

#### `isLanguageSupported(language)`

Type guard that checks if a language code is supported.

```typescript
if (isLanguageSupported(userInput)) {
  // TypeScript knows userInput is Language type here
  const language: Language = userInput;
}
```

#### `getLanguageName(language)`

Returns the language name in its native form.

```typescript
getLanguageName('en'); // Returns: 'English'
getLanguageName('de'); // Returns: 'Deutsch'
getLanguageName('fr'); // Returns: 'Français'
getLanguageName('it'); // Returns: 'Italiano'
```

### Constants

#### `SUPPORTED_LANGUAGES`

Array of all supported language codes: `['en', 'de', 'fr', 'it']`

#### `DEFAULT_LANGUAGE`

The default language when no preference is found: `'en'`

## Usage Examples

### Example 1: API Route with Authenticated User

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getLanguageFromRequest, getLocalizedContent } from '@/lib/utils';
import { getAuthenticatedUser } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  // Get authenticated user
  const user = await getAuthenticatedUser(request);
  
  // Detect language (prioritizes user preference)
  const language = getLanguageFromRequest(request.headers, user?.language);
  
  // Use language for localized response
  const messages = {
    en: 'Welcome back!',
    de: 'Willkommen zurück!',
    fr: 'Bon retour!',
    it: 'Bentornato!',
  };
  
  return NextResponse.json({
    message: getLocalizedContent(messages, language),
    language,
  });
}
```

### Example 2: API Route for Guest Users

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getLanguageFromRequest } from '@/lib/utils';

export async function GET(request: NextRequest) {
  // For guest users, only use Accept-Language header
  const language = getLanguageFromRequest(request.headers, null);
  
  // Fetch restaurants with localized content
  const restaurants = await getRestaurants(language);
  
  return NextResponse.json({ restaurants, language });
}
```

### Example 3: Localizing Menu Items

```typescript
import { getLocalizedContent } from '@/lib/utils';
import { Language } from '@/lib/types';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  translations?: Record<string, { name: string; description: string }>;
}

function getLocalizedMenuItem(item: MenuItem, language: Language) {
  // Build translations object for name
  const nameTranslations: Partial<Record<Language, string>> = {
    en: item.name,
  };
  
  if (item.translations) {
    Object.entries(item.translations).forEach(([lang, trans]) => {
      nameTranslations[lang as Language] = trans.name;
    });
  }
  
  // Build translations object for description
  const descTranslations: Partial<Record<Language, string>> = {
    en: item.description,
  };
  
  if (item.translations) {
    Object.entries(item.translations).forEach(([lang, trans]) => {
      descTranslations[lang as Language] = trans.description;
    });
  }
  
  return {
    ...item,
    name: getLocalizedContent(nameTranslations, language) || item.name,
    description: getLocalizedContent(descTranslations, language) || item.description,
  };
}
```

### Example 4: Sending Localized Notifications

```typescript
import { getLocalizedContent } from '@/lib/utils';
import { Language } from '@/lib/types';

async function sendOrderConfirmation(userId: string, orderNumber: string) {
  // Get user's language preference
  const user = await getUserById(userId);
  const language = user.language || 'en';
  
  // Localized notification messages
  const titles = {
    en: 'Order Confirmed',
    de: 'Bestellung bestätigt',
    fr: 'Commande confirmée',
    it: 'Ordine confermato',
  };
  
  const messages = {
    en: `Your order ${orderNumber} has been confirmed`,
    de: `Ihre Bestellung ${orderNumber} wurde bestätigt`,
    fr: `Votre commande ${orderNumber} a été confirmée`,
    it: `Il tuo ordine ${orderNumber} è stato confermato`,
  };
  
  await createNotification({
    userId,
    type: 'order_status',
    title: getLocalizedContent(titles, language)!,
    message: getLocalizedContent(messages, language)!,
  });
}
```

### Example 5: Language Selector Component

```typescript
import { SUPPORTED_LANGUAGES, getLanguageName } from '@/lib/utils';
import { Language } from '@/lib/types';

function LanguageSelector({ 
  currentLanguage, 
  onChange 
}: { 
  currentLanguage: Language;
  onChange: (lang: Language) => void;
}) {
  return (
    <select value={currentLanguage} onChange={(e) => onChange(e.target.value as Language)}>
      {SUPPORTED_LANGUAGES.map(lang => (
        <option key={lang} value={lang}>
          {getLanguageName(lang)}
        </option>
      ))}
    </select>
  );
}
```

## Integration with Existing Code

### With Formatting Utilities

The language parameter is already integrated with existing formatting utilities:

```typescript
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';

const price = formatCurrency(24.50, language);
const date = formatDate(new Date(), language);
const time = formatRelativeTime(orderDate, language);
```

### With Email Notifications

```typescript
import { sendEmail } from '@/lib/utils/email';
import { getLocalizedContent } from '@/lib/utils';

async function sendWelcomeEmail(user: User) {
  const subjects = {
    en: 'Welcome to EatAfrican',
    de: 'Willkommen bei EatAfrican',
    fr: 'Bienvenue chez EatAfrican',
    it: 'Benvenuto su EatAfrican',
  };
  
  const subject = getLocalizedContent(subjects, user.language);
  
  await sendEmail({
    to: user.email,
    subject: subject!,
    template: `welcome_${user.language}`,
    data: { firstName: user.firstName },
  });
}
```

## Testing

The utility includes comprehensive test coverage in `lib/utils/__tests__/language.test.ts` covering:

- Accept-Language header parsing with various formats
- Language detection with different priority scenarios
- Localized content retrieval with fallbacks
- Language validation
- Edge cases and error handling

See `lib/utils/__tests__/language.example.ts` for additional usage examples.

## Best Practices

1. **Always provide fallback content**: Ensure English translations are always available
2. **Use type guards**: Use `isLanguageSupported()` when accepting user input
3. **Prioritize user preference**: Always pass user's language preference when available
4. **Cache translations**: Consider caching frequently used translations
5. **Consistent formatting**: Use the formatting utilities with language parameter for dates, times, and currency

## Content Localization Functions

### Menu Item Localization

#### `localizeMenuItem(item, language)`

Localizes a single menu item based on the user's language preference. Falls back to the original content if translation is missing.

```typescript
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
  },
};

const localizedItem = localizeMenuItem(menuItem, 'de');
// Returns item with German name and description
```

#### `localizeMenuItems(items, language)`

Localizes an array of menu items. Useful for API endpoints that return multiple items.

```typescript
const items = await getMenuItems(restaurantId);
const localizedItems = localizeMenuItems(items, userLanguage);
```

### Notification Localization

#### `getLocalizedNotification(templateKey, language, params)`

Returns localized notification title and message based on predefined templates. Supports dynamic parameters for personalization.

```typescript
// Order confirmation
const { title, message } = getLocalizedNotification(
  'orderConfirmed',
  'de',
  ['ORD-12345']
);
// title: "Bestellung bestätigt"
// message: "Ihre Bestellung ORD-12345 wurde bestätigt und wird zubereitet."

// Order in transit with driver name
const notification = getLocalizedNotification(
  'orderInTransit',
  'fr',
  ['ORD-12345', 'Jean']
);
// title: "Commande en route"
// message: "Votre commande ORD-12345 est en route ! Jean livre votre nourriture."

// Loyalty points earned
const loyaltyNotif = getLocalizedNotification(
  'loyaltyPointsEarned',
  'it',
  [50, 'ORD-12345']
);
// title: "Punti fedeltà guadagnati"
// message: "Hai guadagnato 50 punti fedeltà dall'ordine ORD-12345!"
```

#### Available Notification Templates

- `orderConfirmed` - Order has been confirmed
- `orderPreparing` - Order is being prepared
- `orderReadyForPickup` - Order is ready for driver pickup
- `orderInTransit` - Order is on the way (requires driver name)
- `orderDelivered` - Order has been delivered
- `orderCancelled` - Order has been cancelled
- `restaurantApproved` - Restaurant has been approved (requires restaurant name)
- `driverApproved` - Driver account has been approved
- `welcomeCustomer` - Welcome message for new customers (requires first name)
- `passwordReset` - Password reset request
- `loyaltyPointsEarned` - Loyalty points earned (requires points and order number)
- `loyaltyPointsRedeemed` - Loyalty points redeemed (requires points and voucher code)

### Restaurant Localization

#### `localizeRestaurant(restaurant, language)`

Localizes restaurant name and description. Useful for future expansion when restaurants provide multilingual content.

```typescript
const restaurant = {
  id: '1',
  name: 'Addis Ababa Restaurant',
  description: 'Authentic Ethiopian cuisine',
  translations: {
    de: {
      name: 'Addis Ababa Restaurant',
      description: 'Authentische äthiopische Küche',
    },
  },
};

const localized = localizeRestaurant(restaurant, 'de');
```

### Translation Management

#### `createTranslations(baseContent, translations)`

Helper function to create a complete translations object from base English content and optional translations in other languages.

```typescript
const translations = createTranslations(
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

// Use when creating menu items
const menuItem = {
  name: 'Jollof Rice',
  description: 'West African rice dish',
  translations, // Store in database
};
```

## API Integration Examples

### Example 1: Menu Endpoint with Localization

```typescript
// app/api/restaurants/[id]/menu/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getLanguageFromRequest, localizeMenuItems } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get user language
  const user = await getAuthenticatedUser(request);
  const language = getLanguageFromRequest(request.headers, user?.language);
  
  // Fetch menu items from database
  const items = await getMenuItems(params.id);
  
  // Localize items
  const localizedItems = localizeMenuItems(items, language);
  
  return NextResponse.json({ items: localizedItems });
}
```

### Example 2: Order Status Notification

```typescript
// lib/utils/notifications.ts
import { getLocalizedNotification } from '@/lib/utils';

export async function notifyOrderStatusChange(
  userId: string,
  orderNumber: string,
  status: string,
  userLanguage: Language
) {
  let templateKey: keyof NotificationTemplates;
  let params: any[] = [orderNumber];
  
  switch (status) {
    case 'confirmed':
      templateKey = 'orderConfirmed';
      break;
    case 'preparing':
      templateKey = 'orderPreparing';
      break;
    case 'in_transit':
      templateKey = 'orderInTransit';
      const driver = await getDriverForOrder(orderNumber);
      params = [orderNumber, driver.firstName];
      break;
    case 'delivered':
      templateKey = 'orderDelivered';
      break;
    default:
      return;
  }
  
  const { title, message } = getLocalizedNotification(
    templateKey,
    userLanguage,
    params
  );
  
  await createNotification({
    userId,
    type: 'order_status',
    title,
    message,
    data: { orderNumber, status },
  });
}
```

### Example 3: Restaurant Approval Notification

```typescript
// app/api/admin/restaurants/[id]/approve/route.ts
import { getLocalizedNotification } from '@/lib/utils';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const restaurant = await getRestaurant(params.id);
  const owner = await getUser(restaurant.ownerId);
  
  // Update restaurant status
  await updateRestaurantStatus(params.id, 'active');
  
  // Send localized notification to owner
  const { title, message } = getLocalizedNotification(
    'restaurantApproved',
    owner.language,
    [restaurant.name]
  );
  
  await createNotification({
    userId: owner.id,
    type: 'account',
    title,
    message,
    data: { restaurantId: params.id },
  });
  
  return NextResponse.json({ success: true });
}
```

## Future Enhancements

Potential improvements for future iterations:

- Add support for additional languages
- Implement translation management system
- Add pluralization support
- Implement context-aware translations
- Add translation validation tools
- Support for rich text formatting in translations
- Translation versioning and rollback
