/**
 * Input Validation Service
 * Implements secure input validation following OWASP guidelines
 * @author NeomSense Development Team
 * @version 1.0.0
 */

import { z } from 'zod';

/**
 * Content validation schemas
 */
export const ContentValidationSchemas = {
  // Social post content validation
  socialPostContent: z.string()
    .min(1, 'Content cannot be empty')
    .max(10000, 'Content exceeds maximum length')
    .refine(
      (value) => !/[<>]/.test(value), 
      'Content contains potentially unsafe characters'
    ),

  // User input validation
  userInput: z.string()
    .min(1, 'Input cannot be empty')
    .max(1000, 'Input exceeds maximum length')
    .regex(/^[a-zA-Z0-9\s\-_.@#$%&*+=/\\(\\)\\[\\]{}|;:'"`,.<>?!~]+$/, 'Input contains invalid characters'),

  // URL validation
  url: z.string().url('Invalid URL format').max(2048, 'URL too long'),

  // Email validation
  email: z.string().email('Invalid email format').max(254, 'Email too long'),

  // Author name validation
  authorName: z.string()
    .min(1, 'Author name cannot be empty')
    .max(100, 'Author name too long')
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Invalid characters in author name'),
};

/**
 * Security-focused input validator
 */
export class InputValidator {
  private static readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^>]*>/gi,
    /<object\b[^>]*>/gi,
    /<embed\b[^>]*>/gi,
  ];

  private static readonly SQL_INJECTION_PATTERNS = [
    /('|(\\'))|(;)|(--)|(\b(SELECT|UPDATE|DELETE|INSERT|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
  ];

  /**
   * Validates and sanitizes content for security threats
   */
  public static validateContent(content: unknown): { isValid: boolean; sanitized?: string; errors: string[] } {
    const errors: string[] = [];

    // Type validation
    if (typeof content !== 'string') {
      errors.push('Content must be a string');
      return { isValid: false, errors };
    }

    // Schema validation
    const schemaResult = ContentValidationSchemas.socialPostContent.safeParse(content);
    if (!schemaResult.success) {
      errors.push(...schemaResult.error.errors.map(e => e.message));
      return { isValid: false, errors };
    }

    // XSS detection
    if (this.containsXSS(content)) {
      errors.push('Content contains potentially malicious scripts');
      return { isValid: false, errors };
    }

    // SQL injection detection
    if (this.containsSQLInjection(content)) {
      errors.push('Content contains SQL injection patterns');
      return { isValid: false, errors };
    }

    // Sanitize content
    const sanitized = this.sanitizeContent(content);

    return { isValid: true, sanitized, errors: [] };
  }

  /**
   * Validates URL safety
   */
  public static validateURL(url: unknown): { isValid: boolean; sanitized?: string; errors: string[] } {
    const errors: string[] = [];

    if (typeof url !== 'string') {
      errors.push('URL must be a string');
      return { isValid: false, errors };
    }

    const schemaResult = ContentValidationSchemas.url.safeParse(url);
    if (!schemaResult.success) {
      errors.push(...schemaResult.error.errors.map(e => e.message));
      return { isValid: false, errors };
    }

    // Check for malicious protocols
    const maliciousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    const lowerUrl = url.toLowerCase();
    
    if (maliciousProtocols.some(protocol => lowerUrl.startsWith(protocol))) {
      errors.push('URL contains potentially unsafe protocol');
      return { isValid: false, errors };
    }

    return { isValid: true, sanitized: url, errors: [] };
  }

  /**
   * Validates author information
   */
  public static validateAuthor(author: unknown): { isValid: boolean; sanitized?: string; errors: string[] } {
    const errors: string[] = [];

    if (typeof author !== 'string') {
      errors.push('Author name must be a string');
      return { isValid: false, errors };
    }

    const schemaResult = ContentValidationSchemas.authorName.safeParse(author);
    if (!schemaResult.success) {
      errors.push(...schemaResult.error.errors.map(e => e.message));
      return { isValid: false, errors };
    }

    const sanitized = this.sanitizeContent(author);
    return { isValid: true, sanitized, errors: [] };
  }

  /**
   * Checks for XSS patterns
   */
  private static containsXSS(content: string): boolean {
    return this.XSS_PATTERNS.some(pattern => pattern.test(content));
  }

  /**
   * Checks for SQL injection patterns
   */
  private static containsSQLInjection(content: string): boolean {
    return this.SQL_INJECTION_PATTERNS.some(pattern => pattern.test(content));
  }

  /**
   * Sanitizes content by removing/escaping dangerous characters
   */
  private static sanitizeContent(content: string): string {
    return content
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }
}

/**
 * Rate limiting utilities
 */
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>();

  /**
   * Checks if request is within rate limits
   */
  public static checkLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const request = this.requests.get(identifier);

    if (!request || now > request.resetTime) {
      // First request or window expired
      this.requests.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (request.count >= maxRequests) {
      return false; // Rate limit exceeded
    }

    request.count++;
    return true;
  }

  /**
   * Resets rate limit for identifier
   */
  public static resetLimit(identifier: string): void {
    this.requests.delete(identifier);
  }
}