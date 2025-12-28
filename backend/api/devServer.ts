import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import viteConfig from "../../vite.config";
import { nanoid } from "nanoid";

const viteLogger = {
  warn: (msg: string) => console.warn(msg),
  info: (msg: string) => console.info(msg),
  error: (msg: string) => console.error(msg),
  debug: (msg: string) => console.debug(msg),
};

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
  // Dynamically import vite to avoid conflicts with local vite.ts file
  // Using eval to force Node to resolve from node_modules instead of the local vite.ts
  const viteImport = eval('import("vite")');
  const { createServer: createViteServer } = await viteImport;

  const serverOptions = {
    middlewareMode: true,
    hmr: {
      server,
      port: 5000,
      host: "0.0.0.0",
      clientPort: 5000,
      protocol: 'ws'
    },
    allowedHosts: true,
    host: "0.0.0.0",
    port: 5000,
    cors: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg: string, options?: any) => {
        viteLogger.error(msg);
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
