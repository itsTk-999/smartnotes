import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rewriteAllPlugin from 'vite-plugin-rewrite-all'

// https://vitejs.dev/config/
export default defineConfig({
  // --- ADD THIS LINE ---
  base: './', 
  // ---------------------
  plugins: [
    react(),
    rewriteAllPlugin()
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})