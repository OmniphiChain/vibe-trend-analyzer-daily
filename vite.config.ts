import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const plugins = [
  react(),
  runtimeErrorOverlay(),
];

// Note: Cartographer plugin loading is handled at request time in the backend
// rather than at config time to avoid import issues

const config = {
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    hmr: {
      port: 5000,
      host: "0.0.0.0",
      clientPort: 5000,
      protocol: 'ws'
    },
    cors: true,
    strictPort: true,
  },
};

export default config;
