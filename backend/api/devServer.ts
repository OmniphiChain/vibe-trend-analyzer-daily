import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { nanoid } from "nanoid";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  try {
    // Dynamic import to avoid issues if vite is not available
    const { createServer: createViteServer, createLogger } = await import("vite");
    
    const viteLogger = createLogger();
    
    const serverOptions = {
      middlewareMode: true,
      hmr: {
        server,
        port: 5000,
        host: "0.0.0.0",
        clientPort: 5000,
        protocol: 'ws' as const
      },
      allowedHosts: true,
      host: "0.0.0.0",
      port: 5000,
      cors: true,
    };

    const vite = await createViteServer({
      configFile: false,
      root: path.resolve(import.meta.dirname, "..", "..", "frontend", "web"),
      customLogger: {
        ...viteLogger,
        error: (msg, options) => {
          viteLogger.error(msg, options);
          // Don't exit on every error - let the app continue
        },
      },
      server: serverOptions,
      appType: "custom",
    });

    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;

      try {
        const clientTemplate = path.resolve(
          import.meta.dirname,
          "..",
          "..",
          "frontend",
          "web",
          "index.html",
        );

        // Check if template exists
        if (!fs.existsSync(clientTemplate)) {
          return res.status(404).send("Frontend not found. Please build the frontend first.");
        }

        // always reload the index.html file from disk incase it changes
        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        template = template.replace(
          `src="/src/main.tsx"`,
          `src="/src/main.tsx?v=${nanoid()}"`,
        );
        const page = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(page);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } catch (error) {
    console.warn("Vite setup failed, serving API only:", error.message);
    // Serve a simple API-only message for non-API routes
    app.use("*", (req, res) => {
      if (req.path.startsWith("/api")) {
        return res.status(404).json({ error: "not_found", message: "API endpoint not found" });
      }
      res.status(200).send(`
        <html>
          <body>
            <h1>Vibe Trend Analyzer API</h1>
            <p>Backend API is running successfully!</p>
            <p>API endpoints available at <a href="/api/health">/api/*</a></p>
            <p>Frontend not available in this mode.</p>
          </body>
        </html>
      `);
    });
  }
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
