import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  generateAuditSlug,
  formatCurrency,
  slugify,
} from '@/lib/utils';

describe('Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('generateAuditSlug', () => {
    it('should generate unique slugs', () => {
      const slug1 = generateAuditSlug();
      const slug2 = generateAuditSlug();
      expect(slug1).not.toBe(slug2);
      expect(slug1.length).toBeGreaterThan(0);
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers as USD', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(1500)).toBe('$1,500');
      expect(formatCurrency(100)).toBe('$100');
    });
  });

  describe('slugify', () => {
    it('should convert strings to slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('My-API Key')).toBe('my-api-key');
      expect(slugify('  test  ')).toBe('test');
    });
  });
});
