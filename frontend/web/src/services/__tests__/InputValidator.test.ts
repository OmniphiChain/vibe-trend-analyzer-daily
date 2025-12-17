/**
 * Unit Tests for InputValidator
 * Comprehensive test coverage following industry standards
 * @author NeomSense Development Team
 */

import { describe, test, expect } from 'vitest';
import { InputValidator } from '../validation/InputValidator';

describe('InputValidator', () => {
  describe('validateContent', () => {
    test('should validate normal content successfully', () => {
      const content = 'This is a normal post about stocks and trading.';
      const result = InputValidator.validateContent(content);
      
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(content);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject XSS attempts', () => {
      const maliciousContent = '<script>alert("xss")</script>This is content';
      const result = InputValidator.validateContent(maliciousContent);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Content contains potentially malicious scripts');
    });

    test('should reject SQL injection patterns', () => {
      const sqlInjection = "'; DROP TABLE users; --";
      const result = InputValidator.validateContent(sqlInjection);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Content contains SQL injection patterns');
    });

    test('should reject non-string input', () => {
      const result = InputValidator.validateContent(123 as any);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Content must be a string');
    });

    test('should reject empty content', () => {
      const result = InputValidator.validateContent('');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Content cannot be empty');
    });

    test('should reject overly long content', () => {
      const longContent = 'a'.repeat(10001);
      const result = InputValidator.validateContent(longContent);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Content exceeds maximum length');
    });

    test('should sanitize content by removing dangerous characters', () => {
      const content = 'This has <dangerous> characters';
      const result = InputValidator.validateContent(content);
      
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('This has dangerous characters');
    });
  });

  describe('validateURL', () => {
    test('should validate HTTPS URLs', () => {
      const url = 'https://example.com/path';
      const result = InputValidator.validateURL(url);
      
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(url);
    });

    test('should validate HTTP URLs', () => {
      const url = 'http://example.com/path';
      const result = InputValidator.validateURL(url);
      
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(url);
    });

    test('should reject malicious protocols', () => {
      const maliciousUrl = 'javascript:alert("xss")';
      const result = InputValidator.validateURL(maliciousUrl);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('URL contains potentially unsafe protocol');
    });

    test('should reject invalid URLs', () => {
      const invalidUrl = 'not-a-url';
      const result = InputValidator.validateURL(invalidUrl);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid URL format');
    });

    test('should reject non-string URLs', () => {
      const result = InputValidator.validateURL(123 as any);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('URL must be a string');
    });
  });

  describe('validateAuthor', () => {
    test('should validate normal author names', () => {
      const author = 'trading_expert_123';
      const result = InputValidator.validateAuthor(author);
      
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(author);
    });

    test('should reject authors with invalid characters', () => {
      const author = 'author<script>alert()</script>';
      const result = InputValidator.validateAuthor(author);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid characters in author name');
    });

    test('should reject empty author names', () => {
      const result = InputValidator.validateAuthor('');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Author name cannot be empty');
    });

    test('should reject overly long author names', () => {
      const longAuthor = 'a'.repeat(101);
      const result = InputValidator.validateAuthor(longAuthor);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Author name too long');
    });
  });
});