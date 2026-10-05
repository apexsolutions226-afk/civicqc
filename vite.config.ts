import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { publicPagePaths, legacyRedirects } from './src/routes';

// Serve the correct pre-rendered HTML for each clean URL in the local production preview.
// The deployed static host uses public/_redirects or equivalent host routing rules.
const prerenderedPreview: Plugin = {
  name: 'civicqc-prerendered-preview',
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = new URL(req.url || '/', 'http://preview.internal');
      const route = url.pathname.replace(/\/$/, '') || '/';
      if (legacyRedirects[route]) {
        res.statusCode = 301;
        res.setHeader('Location', `${legacyRedirects[route]}${url.search}`);
        res.end();
        return;
      }
      if (route !== '/' && publicPagePaths.includes(route)) {
        req.url = `${route}/index.html${url.search}`;
      } else if (
        route !== '/' &&
        !route.split('/').pop()?.includes('.') &&
        req.headers.accept?.includes('text/html')
      ) {
        const notFound = path.resolve(server.config.root, server.config.build.outDir, '404.html');
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(fs.readFileSync(notFound, 'utf-8'));
        return;
      }
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), prerenderedPreview],
  server: { host: '0.0.0.0', allowedHosts: true },
  preview: { host: '0.0.0.0', allowedHosts: true },
});
