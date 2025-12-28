import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  type: 'access' | 'refresh';
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});

const signupSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

// ============================================================================
// JWT UTILITIES
// ============================================================================

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_REFRESH_SECRET: string;
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly REFRESH_TOKEN_EXPIRY = '7d';

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';
    
    if (process.env.NODE_ENV === 'production' && (this.JWT_SECRET.includes('change') || this.JWT_REFRESH_SECRET.includes('change'))) {
      throw new Error('🚨 SECURITY: JWT secrets must be changed in production!');
    }
  }

  // Generate access token (short-lived)
  generateAccessToken(payload: Omit<JWTPayload, 'type'>): string {
    return jwt.sign(
      { ...payload, type: 'access' },
      this.JWT_SECRET,
      { expiresIn: this.ACCESS_TOKEN_EXPIRY }
    );
  }

  // Generate refresh token (long-lived)
  generateRefreshToken(payload: Omit<JWTPayload, 'type'>): string {
    return jwt.sign(
      { ...payload, type: 'refresh' },
      this.JWT_REFRESH_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRY }
    );
  }

  // Verify access token
  verifyAccessToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      return decoded.type === 'access' ? decoded : null;
    } catch (error) {
      return null;
    }
  }

  // Verify refresh token
  verifyRefreshToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_REFRESH_SECRET) as JWTPayload;
      return decoded.type === 'refresh' ? decoded : null;
    } catch (error) {
      return null;
    }
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Verify password
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Generate token pair
  generateTokenPair(user: { id: number; username: string; email: string }) {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

export const authService = new AuthService();

// Authentication middleware - requires valid JWT
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Access token required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = authService.verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Invalid or expired access token'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'internal_error',
      message: 'Authentication error'
    });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = authService.verifyAccessToken(token);
      
      if (decoded) {
        req.user = decoded;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Rate limiting middleware (simple in-memory implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (maxRequests: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    
    const record = rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (record.count >= maxRequests) {
      return res.status(429).json({
        error: 'rate_limit_exceeded',
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      });
    }
    
    record.count++;
    next();
  };
};

// Input validation middleware
export const validateInput = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'validation_error',
          message: 'Invalid input data',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

// ============================================================================
// VALIDATION SCHEMAS EXPORT
// ============================================================================

export const authSchemas = {
  login: loginSchema,
  signup: signupSchema,
  resetPassword: resetPasswordSchema,
};

// ============================================================================
// SECURITY HEADERS MIDDLEWARE
// ============================================================================

export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CORS headers (more restrictive than current setup)
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'];
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};