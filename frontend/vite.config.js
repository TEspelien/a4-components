import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables from .env (one folder up)
dotenv.config({ path: '../.env' });
const VITE_API_URL = 'http://localhost:3000' //process.env.VITE_API_URL;

console.log(VITE_API_URL);

const proxyOptions = {
  target: VITE_API_URL,
  changeOrigin: true,
  secure: false, // If you're using HTTP, disable SSL verification
}

export default defineConfig({
  plugins: [react()],
  server: {
    // Use port from .env or fallback to 5173 (vite default)
    port: parseInt(process.env.VITE_PORT, 10) || 5173,
    //proxy in order to avoid CORS issues
    proxy: {
      '/login': proxyOptions,
      '/bookmarks': proxyOptions,
    },
  },
});
