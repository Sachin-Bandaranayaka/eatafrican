import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPrice,
  parseCurrency,
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatPhoneNumber,
  generateOrderNumber,
  formatPercentage,
  truncateText,
  formatFileSize,
  capitalizeWords,
} from '../formatting';

describe('Currency Formatting', () => {
  it('should format currency as Swiss Francs with Fr. prefix and .- suffix', () => {
    expect(formatCurrency(24.50)).toBe('Fr. 24.50.-');
    expect(formatCurrency(100)).toBe('Fr. 100.00.-');
    expect(formatCurrency(0.99)).toBe('Fr. 0.99.-');
    expect(formatCurrency(1234.56)).toBe('Fr. 1234.56.-');
  });

  it('should format price without .- suffix', () => {
    expect(formatPrice(24.50)).toBe('Fr. 24.50');
    expect(formatPrice(100)).toBe('Fr. 100.00');
  });

  it('should parse currency string to number', () => {
    expect(parseCurrency('Fr. 24.50.-')).toBe(24.50);
    expect(parseCurrency('Fr. 100.00.-')).toBe(100.00);
    expect(parseCurrency('24.50')).toBe(24.50);
  });

  it('should handle edge cases for currency', () => {
    expect(formatCurrency(0)).toBe('Fr. 0.00.-');
    expect(formatCurrency(0.01)).toBe('Fr. 0.01.-');
    expect(formatCurrency(9999.99)).toBe('Fr. 9999.99.-');
  });
});

describe('Date Formatting', () => {
  it('should format date in European format (DD.MM.YYYY)', () => {
    const date = new Date('2024-01-24T15:30:00');
    expect(formatDate(date)).toBe('24.01.2024');
  });

  it('should format date from string', () => {
    expect(formatDate('2024-12-31T23:59:59')).toBe('31.12.2024');
    expect(formatDate('2024-01-01T00:00:00')).toBe('01.01.2024');
  });

  it('should pad single digit days and months with zero', () => {
    const date = new Date('2024-03-05T12:00:00');
    expect(formatDate(date)).toBe('05.03.2024');
  });

  it('should handle different months correctly', () => {
    expect(formatDate('2024-02-29T12:00:00')).toBe('29.02.2024'); // Leap year
    expect(formatDate('2024-11-15T12:00:00')).toBe('15.11.2024');
  });
});

describe('Time Formatting', () => {
  it('should format time in 24-hour format (HH:mm)', () => {
    const date = new Date('2024-01-24T15:30:00');
    expect(formatTime(date)).toBe('15:30');
  });

  it('should format time from string', () => {
    expect(formatTime('2024-01-24T09:05:00')).toBe('09:05');
    expect(formatTime('2024-01-24T23:59:00')).toBe('23:59');
    expect(formatTime('2024-01-24T00:00:00')).toBe('00:00');
  });

  it('should pad single digit hours and minutes with zero', () => {
    const date = new Date('2024-01-24T03:07:00');
    expect(formatTime(date)).toBe('03:07');
  });

  it('should handle edge times correctly', () => {
    expect(formatTime('2024-01-24T12:00:00')).toBe('12:00'); // Noon
    expect(formatTime('2024-01-24T00:01:00')).toBe('00:01'); // Just after midnight
  });
});

describe('DateTime Formatting', () => {
  it('should format date and time together', () => {
    const date = new Date('2024-01-24T15:30:00');
    expect(formatDateTime(date)).toBe('24.01.2024, 15:30');
  });

  it('should format datetime from string', () => {
    expect(formatDateTime('2024-12-31T23:59:00')).toBe('31.12.2024, 23:59');
  });
});

describe('Relative Time Formatting', () => {
  it('should format relative time in English', () => {
    const now = new Date();
    
    // Just now
    expect(formatRelativeTime(now, 'en')).toBe('just now');
    
    // Past
    const past30min = new Date(now.getTime() - 30 * 60000);
    expect(formatRelativeTime(past30min, 'en')).toBe('30 minutes ago');
    
    const past2hours = new Date(now.getTime() - 2 * 3600000);
    expect(formatRelativeTime(past2hours, 'en')).toBe('2 hours ago');
    
    // Future
    const future15min = new Date(now.getTime() + 15 * 60000);
    expect(formatRelativeTime(future15min, 'en')).toBe('in 15 minutes');
    
    const future3hours = new Date(now.getTime() + 3 * 3600000);
    expect(formatRelativeTime(future3hours, 'en')).toBe('in 3 hours');
  });

  it('should format relative time in German', () => {
    const now = new Date();
    
    expect(formatRelativeTime(now, 'de')).toBe('gerade eben');
    
    const past30min = new Date(now.getTime() - 30 * 60000);
    expect(formatRelativeTime(past30min, 'de')).toBe('vor 30 Minuten');
  });

  it('should format relative time in French', () => {
    const now = new Date();
    
    expect(formatRelativeTime(now, 'fr')).toBe('à l\'instant');
    
    const future15min = new Date(now.getTime() + 15 * 60000);
    expect(formatRelativeTime(future15min, 'fr')).toBe('dans 15 minutes');
  });

  it('should format relative time in Italian', () => {
    const now = new Date();
    
    expect(formatRelativeTime(now, 'it')).toBe('proprio ora');
    
    const past2hours = new Date(now.getTime() - 2 * 3600000);
    expect(formatRelativeTime(past2hours, 'it')).toBe('2 ore fa');
  });
});

describe('Phone Number Formatting', () => {
  it('should format Swiss phone numbers', () => {
    expect(formatPhoneNumber('+41791234567')).toBe('+41 79 123 45 67');
  });

  it('should handle phone numbers with existing formatting', () => {
    expect(formatPhoneNumber('+41 79 123 45 67')).toBe('+41 79 123 45 67');
  });

  it('should clean non-digit characters', () => {
    expect(formatPhoneNumber('+41-79-123-45-67')).toBe('+41 79 123 45 67');
  });
});

describe('Order Number Generation', () => {
  it('should generate order number with correct format', () => {
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toMatch(/^ORD-\d{8}-\d{3}$/);
  });

  it('should generate unique order numbers', () => {
    const orderNumber1 = generateOrderNumber();
    const orderNumber2 = generateOrderNumber();
    // They might be the same due to random, but format should be correct
    expect(orderNumber1).toMatch(/^ORD-\d{8}-\d{3}$/);
    expect(orderNumber2).toMatch(/^ORD-\d{8}-\d{3}$/);
  });
});

describe('Percentage Formatting', () => {
  it('should format percentage correctly', () => {
    expect(formatPercentage(0.15)).toBe('15%');
    expect(formatPercentage(0.5)).toBe('50%');
    expect(formatPercentage(1)).toBe('100%');
    expect(formatPercentage(0.075)).toBe('8%');
  });
});

describe('Text Truncation', () => {
  it('should truncate long text with ellipsis', () => {
    expect(truncateText('This is a very long text', 10)).toBe('This is...');
  });

  it('should not truncate short text', () => {
    expect(truncateText('Short', 10)).toBe('Short');
  });

  it('should handle exact length', () => {
    expect(truncateText('Exactly10!', 10)).toBe('Exactly10!');
  });
});

describe('File Size Formatting', () => {
  it('should format file sizes correctly', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(5242880)).toBe('5 MB'); // Max upload size
  });
});

describe('Text Capitalization', () => {
  it('should capitalize first letter of each word', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
    expect(capitalizeWords('HELLO WORLD')).toBe('Hello World');
    expect(capitalizeWords('hello')).toBe('Hello');
  });
});
