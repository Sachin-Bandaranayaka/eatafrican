/**
 * Verification script for formatting utilities
 * Run with: npx tsx lib/utils/__tests__/formatting.verify.ts
 */

import {
  formatCurrency,
  formatPrice,
  formatDate,
  formatTime,
  formatDateTime,
} from '../formatting';

console.log('=== Currency Formatting Tests ===');
console.log('formatCurrency(24.50):', formatCurrency(24.50));
console.log('Expected: Fr. 24.50.-');
console.log('✓ Pass:', formatCurrency(24.50) === 'Fr. 24.50.-');
console.log();

console.log('formatCurrency(100):', formatCurrency(100));
console.log('Expected: Fr. 100.00.-');
console.log('✓ Pass:', formatCurrency(100) === 'Fr. 100.00.-');
console.log();

console.log('formatPrice(24.50):', formatPrice(24.50));
console.log('Expected: Fr. 24.50');
console.log('✓ Pass:', formatPrice(24.50) === 'Fr. 24.50');
console.log();

console.log('=== Date Formatting Tests ===');
const testDate = new Date('2024-01-24T15:30:00');
console.log('formatDate(2024-01-24T15:30:00):', formatDate(testDate));
console.log('Expected: 24.01.2024');
console.log('✓ Pass:', formatDate(testDate) === '24.01.2024');
console.log();

const testDate2 = new Date('2024-03-05T12:00:00');
console.log('formatDate(2024-03-05T12:00:00):', formatDate(testDate2));
console.log('Expected: 05.03.2024 (with zero padding)');
console.log('✓ Pass:', formatDate(testDate2) === '05.03.2024');
console.log();

console.log('=== Time Formatting Tests ===');
console.log('formatTime(2024-01-24T15:30:00):', formatTime(testDate));
console.log('Expected: 15:30');
console.log('✓ Pass:', formatTime(testDate) === '15:30');
console.log();

const testDate3 = new Date('2024-01-24T03:07:00');
console.log('formatTime(2024-01-24T03:07:00):', formatTime(testDate3));
console.log('Expected: 03:07 (with zero padding)');
console.log('✓ Pass:', formatTime(testDate3) === '03:07');
console.log();

const testDate4 = new Date('2024-01-24T00:00:00');
console.log('formatTime(2024-01-24T00:00:00):', formatTime(testDate4));
console.log('Expected: 00:00 (midnight)');
console.log('✓ Pass:', formatTime(testDate4) === '00:00');
console.log();

console.log('=== DateTime Formatting Tests ===');
console.log('formatDateTime(2024-01-24T15:30:00):', formatDateTime(testDate));
console.log('Expected: 24.01.2024, 15:30');
console.log('✓ Pass:', formatDateTime(testDate) === '24.01.2024, 15:30');
console.log();

console.log('=== All Tests Summary ===');
const allTests = [
  formatCurrency(24.50) === 'Fr. 24.50.-',
  formatCurrency(100) === 'Fr. 100.00.-',
  formatPrice(24.50) === 'Fr. 24.50',
  formatDate(testDate) === '24.01.2024',
  formatDate(testDate2) === '05.03.2024',
  formatTime(testDate) === '15:30',
  formatTime(testDate3) === '03:07',
  formatTime(testDate4) === '00:00',
  formatDateTime(testDate) === '24.01.2024, 15:30',
];

const passedTests = allTests.filter(t => t).length;
const totalTests = allTests.length;

console.log(`Passed: ${passedTests}/${totalTests}`);
if (passedTests === totalTests) {
  console.log('✅ All formatting utilities are working correctly!');
  process.exit(0);
} else {
  console.log('❌ Some tests failed!');
  process.exit(1);
}
