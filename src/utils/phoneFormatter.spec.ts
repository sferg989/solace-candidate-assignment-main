import { formatPhoneNumber } from './phoneFormatter';

describe('formatPhoneNumber', () => {
  describe('10-digit numbers', () => {
    it('should format numeric phone number correctly', () => {
      expect(formatPhoneNumber(5551234567)).toBe('(555) 123-4567');
    });

    it('should format string phone number correctly', () => {
      expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567');
    });

    it('should format phone number with dashes', () => {
      expect(formatPhoneNumber('555-123-4567')).toBe('(555) 123-4567');
    });

    it('should format phone number with spaces', () => {
      expect(formatPhoneNumber('555 123 4567')).toBe('(555) 123-4567');
    });

    it('should format phone number with parentheses and dashes', () => {
      expect(formatPhoneNumber('(555) 123-4567')).toBe('(555) 123-4567');
    });

    it('should format phone number with mixed characters', () => {
      expect(formatPhoneNumber('555.123.4567')).toBe('(555) 123-4567');
    });
  });

  describe('11-digit numbers with country code', () => {
    it('should format 11-digit number starting with 1', () => {
      expect(formatPhoneNumber(15551234567)).toBe('+1 (555) 123-4567');
    });

    it('should format string 11-digit number starting with 1', () => {
      expect(formatPhoneNumber('15551234567')).toBe('+1 (555) 123-4567');
    });

    it('should format 11-digit number with formatting', () => {
      expect(formatPhoneNumber('1-555-123-4567')).toBe('+1 (555) 123-4567');
    });
  });

  describe('7-digit numbers', () => {
    it('should format 7-digit number', () => {
      expect(formatPhoneNumber(1234567)).toBe('123-4567');
    });

    it('should format string 7-digit number', () => {
      expect(formatPhoneNumber('1234567')).toBe('123-4567');
    });
  });

  describe('edge cases', () => {
    it('should handle invalid length numbers', () => {
      expect(formatPhoneNumber(123)).toBe('123');
      expect(formatPhoneNumber('12345')).toBe('12345');
      expect(formatPhoneNumber('123456789012')).toBe('123456789012');
    });

    it('should handle 11-digit numbers not starting with 1', () => {
      expect(formatPhoneNumber('25551234567')).toBe('25551234567');
    });

    it('should handle empty string', () => {
      expect(formatPhoneNumber('')).toBe('');
    });

    it('should handle zero', () => {
      expect(formatPhoneNumber(0)).toBe('0');
    });

    it('should handle phone number with only non-digits', () => {
      expect(formatPhoneNumber('abc-def-ghij')).toBe('');
    });
  });

  describe('real-world examples from seed data', () => {
    it('should format phone numbers from seed data correctly', () => {
      expect(formatPhoneNumber(5551234567)).toBe('(555) 123-4567');
      expect(formatPhoneNumber(5559876543)).toBe('(555) 987-6543');
      expect(formatPhoneNumber(5554567890)).toBe('(555) 456-7890');
      expect(formatPhoneNumber(5556543210)).toBe('(555) 654-3210');
      expect(formatPhoneNumber(5553210987)).toBe('(555) 321-0987');
    });
  });
}); 