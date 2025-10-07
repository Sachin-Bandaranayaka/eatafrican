import { Language } from '@/lib/types';

/**
 * Format price as Swiss Francs
 * Example: 24.50 -> "Fr. 24.50.-"
 */
export function formatCurrency(amount: number, language: Language = 'en'): string {
  const formatted = amount.toFixed(2);
  
  // Swiss format with "Fr." prefix and ".-" suffix
  return `Fr. ${formatted}.-`;
}

/**
 * Format price for display (shorter version)
 * Example: 24.50 -> "Fr. 24.50"
 */
export function formatPrice(amount: number): string {
  return `Fr. ${amount.toFixed(2)}`;
}

/**
 * Parse currency string to number
 * Example: "Fr. 24.50.-" -> 24.50
 */
export function parseCurrency(currencyString: string): number {
  const cleaned = currencyString.replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Format date in European format (DD.MM.YYYY)
 */
export function formatDate(date: Date | string, language: Language = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}.${month}.${year}`;
}

/**
 * Format time in 24-hour format (HH:mm)
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

/**
 * Format date and time together
 * Example: "24.12.2024, 18:30"
 */
export function formatDateTime(date: Date | string, language: Language = 'en'): string {
  return `${formatDate(date, language)}, ${formatTime(date)}`;
}

/**
 * Format relative time (e.g., "2 hours ago", "in 30 minutes")
 */
export function formatRelativeTime(date: Date | string, language: Language = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const translations = {
    en: {
      justNow: 'just now',
      minutesAgo: (n: number) => `${n} minute${n !== 1 ? 's' : ''} ago`,
      hoursAgo: (n: number) => `${n} hour${n !== 1 ? 's' : ''} ago`,
      daysAgo: (n: number) => `${n} day${n !== 1 ? 's' : ''} ago`,
      inMinutes: (n: number) => `in ${n} minute${n !== 1 ? 's' : ''}`,
      inHours: (n: number) => `in ${n} hour${n !== 1 ? 's' : ''}`,
      inDays: (n: number) => `in ${n} day${n !== 1 ? 's' : ''}`,
    },
    de: {
      justNow: 'gerade eben',
      minutesAgo: (n: number) => `vor ${n} Minute${n !== 1 ? 'n' : ''}`,
      hoursAgo: (n: number) => `vor ${n} Stunde${n !== 1 ? 'n' : ''}`,
      daysAgo: (n: number) => `vor ${n} Tag${n !== 1 ? 'en' : ''}`,
      inMinutes: (n: number) => `in ${n} Minute${n !== 1 ? 'n' : ''}`,
      inHours: (n: number) => `in ${n} Stunde${n !== 1 ? 'n' : ''}`,
      inDays: (n: number) => `in ${n} Tag${n !== 1 ? 'en' : ''}`,
    },
    fr: {
      justNow: 'à l\'instant',
      minutesAgo: (n: number) => `il y a ${n} minute${n !== 1 ? 's' : ''}`,
      hoursAgo: (n: number) => `il y a ${n} heure${n !== 1 ? 's' : ''}`,
      daysAgo: (n: number) => `il y a ${n} jour${n !== 1 ? 's' : ''}`,
      inMinutes: (n: number) => `dans ${n} minute${n !== 1 ? 's' : ''}`,
      inHours: (n: number) => `dans ${n} heure${n !== 1 ? 's' : ''}`,
      inDays: (n: number) => `dans ${n} jour${n !== 1 ? 's' : ''}`,
    },
    it: {
      justNow: 'proprio ora',
      minutesAgo: (n: number) => `${n} minut${n !== 1 ? 'i' : 'o'} fa`,
      hoursAgo: (n: number) => `${n} or${n !== 1 ? 'e' : 'a'} fa`,
      daysAgo: (n: number) => `${n} giorn${n !== 1 ? 'i' : 'o'} fa`,
      inMinutes: (n: number) => `tra ${n} minut${n !== 1 ? 'i' : 'o'}`,
      inHours: (n: number) => `tra ${n} or${n !== 1 ? 'e' : 'a'}`,
      inDays: (n: number) => `tra ${n} giorn${n !== 1 ? 'i' : 'o'}`,
    },
  };

  const t = translations[language];

  if (Math.abs(diffMinutes) < 1) {
    return t.justNow;
  }

  if (diffMinutes < 0) {
    // Past
    if (Math.abs(diffMinutes) < 60) {
      return t.minutesAgo(Math.abs(diffMinutes));
    } else if (Math.abs(diffHours) < 24) {
      return t.hoursAgo(Math.abs(diffHours));
    } else {
      return t.daysAgo(Math.abs(diffDays));
    }
  } else {
    // Future
    if (diffMinutes < 60) {
      return t.inMinutes(diffMinutes);
    } else if (diffHours < 24) {
      return t.inHours(diffHours);
    } else {
      return t.inDays(diffDays);
    }
  }
}

/**
 * Format phone number for display
 * Example: "+41791234567" -> "+41 79 123 45 67"
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Swiss phone number format
  if (cleaned.startsWith('+41')) {
    const number = cleaned.substring(3);
    if (number.length === 9) {
      return `+41 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5, 7)} ${number.substring(7)}`;
    }
  }
  
  return cleaned;
}

/**
 * Format order number
 * Example: "ORD-20240124-001"
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `ORD-${year}${month}${day}-${random}`;
}

/**
 * Format percentage
 * Example: 0.15 -> "15%"
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format file size
 * Example: 1024 -> "1 KB", 1048576 -> "1 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
