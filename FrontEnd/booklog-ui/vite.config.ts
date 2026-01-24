import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy /api -> backend so the frontend can call "/api/books" without CORS pain.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5051',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
