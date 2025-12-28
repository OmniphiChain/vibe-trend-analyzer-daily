import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./devServer";

// ============================================================================
// PRODUCTION-READY EXPRESS APP SETUP
// ============================================================================

const app = express();

// Security middleware (helmet for production security headers)
if (process.env.NODE_ENV === "production") {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "wss:", "https:"],
      },
    },
  }));
}

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Trust proxy for accurate IP addresses (important for rate limiting)
app.set('trust proxy', 1);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      // Only log response for errors or in development
      if (process.env.NODE_ENV === "development" && capturedJsonResponse) {
        const responseStr = JSON.stringify(capturedJsonResponse);
        if (responseStr.length > 100) {
          logLine += ` :: ${responseStr.slice(0, 97)}...`;
        } else {
          logLine += ` :: ${responseStr}`;
        }
      }

      log(logLine);
    }
  });

  next();
});

// ============================================================================
// STARTUP & ERROR HANDLING
// ============================================================================

(async () => {
  try {
    // Validate required environment variables
    const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0 && process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    // Register all API routes
    const server = await registerRoutes(app);

    // Global error handler (must be after routes)
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error('Unhandled error:', err);
      
      const status = err.status || err.statusCode || 500;
      const message = process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : err.message || 'Internal Server Error';

      res.status(status).json({ 
        error: 'internal_error',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
    });

    // 404 handler for API routes
    app.use('/api/*', (req, res) => {
      res.status(404).json({
        error: 'not_found',
        message: `API endpoint ${req.method} ${req.path} not found`
      });
    });

    // Setup Vite in development or serve static files in production
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start server
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      log(`🚀 Server running on port ${port}`);
      log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      log(`💾 Database: ${process.env.DATABASE_URL ? 'Connected' : 'In-memory'}`);
      
      if (process.env.NODE_ENV === 'development') {
        log(`🔧 API Documentation: http://localhost:${port}/api/health`);
      }
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal: string) => {
      log(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        log('Server closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
