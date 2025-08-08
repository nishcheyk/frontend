import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Vite Modern App',
        short_name: 'ModernApp',
        start_url: '/',
        display: 'standalone',
        background_color: '#1976d2',
        theme_color: '#1976d2',
        description: 'A modern Vite PWA example',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      }
      
        
      
    }),
  ],
});
