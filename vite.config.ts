import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const API_PORT = process.env.PORT || 8787;

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    // SECURITY: no `define` injection of GEMINI_API_KEY here anymore — the key
    // never enters the client bundle. The browser talks to /api/* instead,
    // which is proxied to the local Express server (see server/index.ts).
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': {
          target: `http://localhost:${API_PORT}`,
          changeOrigin: true,
        },
      },
    },
  };
});
