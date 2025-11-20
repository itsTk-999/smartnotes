import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rewriteAllPlugin from 'vite-plugin-rewrite-all'

// Setting 'base' to './' is the most reliable way to tell Vite
// to serve assets relative to the current location (Vercel domain).
export default defineConfig({
  base: './', 
  plugins: [
    react(),
    rewriteAllPlugin()
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000' || 'https://smart-notes-i54i.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});