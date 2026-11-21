import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const DEFAULT_DEV_PORT = 5173;
const DEFAULT_API_TARGET = 'http://localhost:4000';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: Number(process.env.FRONTEND_PORT) || DEFAULT_DEV_PORT,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || DEFAULT_API_TARGET,
        changeOrigin: true,
      },
    },
  },
});
