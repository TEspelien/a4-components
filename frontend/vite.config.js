import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_PORT, 10) || 5173, // Use port from .env or fallback to 5173
    //proxy in order to avoid CORS issues
    proxy: {
      '/login': 'http://localhost:3000',
      '/bookmarks/data': 'http://localhost:3000',
      '/bookmarks/add': 'http://localhost:3000',
      '/bookmarks/delete': 'http://localhost:3000',
    },
  },
});
