/**
 * Tests for Payment Error Handling Utilities
 */

import {
  getPaymentErrorDetails,
  isRetryableError,
  getRetryDelay,
  isNetworkTimeout,
  withTimeout,
} from '../payment-errors';

describe('Payment Error Utilities', () => {
  describe('getPaymentErrorDetails', () => {
    it('should return user-friendly message for card_declined', () => {
      const error = { code: 'card_declined', message: 'Card was declined' };
      const result = getPaymentErrorDetails(error);

      expect(result.code).toBe('card_declined');
      expect(result.userMessage).toContain('card was declined');
      expect(result.retryable).toBe(true);
      expect(result.suggestedAction).toBeDefined();
    });

    it('should return user-friendly message for insufficient_funds', () => {
      const error = { code: 'insufficient_funds', message: 'Insufficient funds' };
      const result = getPaymentErrorDetails(error);

      expect(result.code).toBe('insufficient_funds');
      expect(result.userMessage).toContain('insufficient funds');
      expect(result.retryable).toBe(true);
    });

    it('should return user-friendly message for expired_card', () => {
      const error = { code: 'expired_card', message: 'Card expired' };
      const result = getPaymentErrorDetails(error);

      expect(result.code).toBe('expired_card');
      expect(result.userMessage).toContain('expired');
      expect(result.retryable).toBe(true);
    });

    it('should return user-friendly message for incorrect_cvc', () => {
      const error = { code: 'incorrect_cvc', message: 'CVC incorrect' };
      const result = getPaymentErrorDetails(error);

      expect(result.code).toBe('incorrect_cvc');
      expect(result.userMessage).toContain('security code');
      expect(result.retryable).toBe(true);
    });

    it('should handle network errors', () => {
      const error = { code: 'api_connection_error', message: 'Network error' };
      const result = getPaymentErrorDetails(error);

      expect(result.code).toBe('api_connection_error');
      expect(result.userMessage).toContain('connect');
      expect(result.retryable).toBe(true);
    });

    it('should handle unknown errors', () => {
      const error = { code: 'some_unknown_error', message: 'Unknown error' };
      const result = getPaymentErrorDetails(error);

      expect(result.code).toBe('some_unknown_error');
      expect(result.userMessage).toContain('unexpected error');
      expect(result.retryable).toBe(true);
    });

    it('should handle errors without code', () => {
      const error = { message: 'Some error' };
      const result = getPaymentErrorDetails(error);

      expect(result.code).toBe('unknown_error');
      expect(result.retryable).toBe(true);
    });

    it('should mark non-retryable errors correctly', () => {
      const error = { code: 'amount_too_small', message: 'Amount too small' };
      const result = getPaymentErrorDetails(error);

      expect(result.retryable).toBe(false);
    });
  });

  describe('isRetryableError', () => {
    it('should return true for retryable errors', () => {
      const error = { code: 'card_declined', message: 'Card declined' };
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return false for non-retryable errors', () => {
      const error = { code: 'amount_too_small', message: 'Amount too small' };
      expect(isRetryableError(error)).toBe(false);
    });
  });

  describe('getRetryDelay', () => {
    it('should return increasing delays with exponential backoff', () => {
      const delay1 = getRetryDelay(1);
      const delay2 = getRetryDelay(2);
      const delay3 = getRetryDelay(3);

      // First attempt should be around 1 second (1000ms + jitter)
      expect(delay1).toBeGreaterThanOrEqual(1000);
      expect(delay1).toBeLessThan(2000);

      // Second attempt should be around 2 seconds
      expect(delay2).toBeGreaterThanOrEqual(2000);
      expect(delay2).toBeLessThan(3000);

      // Third attempt should be around 4 seconds
      expect(delay3).toBeGreaterThanOrEqual(4000);
      expect(delay3).toBeLessThan(5000);
    });

    it('should cap delay at maximum value', () => {
      const delay = getRetryDelay(10); // Very high attempt number
      expect(delay).toBeLessThanOrEqual(16500); // Max 16000 + 500 jitter
    });

    it('should add jitter to prevent thundering herd', () => {
      const delays = Array.from({ length: 10 }, () => getRetryDelay(1));
      const uniqueDelays = new Set(delays);
      
      // With jitter, delays should be different
      expect(uniqueDelays.size).toBeGreaterThan(1);
    });
  });

  describe('isNetworkTimeout', () => {
    it('should detect timeout errors', () => {
      expect(isNetworkTimeout({ message: 'Request timeout' })).toBe(true);
      expect(isNetworkTimeout({ message: 'Connection timeout' })).toBe(true);
      expect(isNetworkTimeout({ code: 'ETIMEDOUT' })).toBe(true);
      expect(isNetworkTimeout({ code: 'ECONNABORTED' })).toBe(true);
    });

    it('should detect network errors', () => {
      expect(isNetworkTimeout({ message: 'Network error' })).toBe(true);
      expect(isNetworkTimeout({ message: 'Fetch failed' })).toBe(true);
    });

    it('should return false for non-network errors', () => {
      expect(isNetworkTimeout({ message: 'Card declined' })).toBe(false);
      expect(isNetworkTimeout({ code: 'card_declined' })).toBe(false);
    });

    it('should handle null/undefined errors', () => {
      expect(isNetworkTimeout(null)).toBe(false);
      expect(isNetworkTimeout(undefined)).toBe(false);
      expect(isNetworkTimeout({})).toBe(false);
    });
  });

  describe('withTimeout', () => {
    it('should resolve when promise completes before timeout', async () => {
      const promise = Promise.resolve('success');
      const result = await withTimeout(promise, 1000);
      expect(result).toBe('success');
    });

    it('should reject when promise takes longer than timeout', async () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('late'), 2000));
      
      await expect(withTimeout(promise, 100)).rejects.toThrow('timeout');
    });

    it('should use default timeout of 30 seconds', async () => {
      const promise = Promise.resolve('success');
      const result = await withTimeout(promise);
      expect(result).toBe('success');
    });

    it('should reject with timeout error message', async () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('late'), 2000));
      
      try {
        await withTimeout(promise, 100);
        fail('Should have thrown timeout error');
      } catch (error: any) {
        expect(error.message).toContain('timeout');
        expect(error.message).toContain('connection');
      }
    });
  });
});
