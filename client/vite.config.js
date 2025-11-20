import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// FIX: Change named import { vitePluginRewriteAll } to default import and rename it
import rewriteAllPlugin from 'vite-plugin-rewrite-all' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    rewriteAllPlugin() // <--- Use the imported function name here
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