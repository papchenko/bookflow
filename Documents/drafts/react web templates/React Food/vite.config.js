import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import browserSync from 'vite-plugin-browser-sync'

export default defineConfig({
  base: '/some-food/',
  server: {
    host: '0.0.0.0',
    port: 5000,
  },
  plugins: [
    react(),
    browserSync({
      open: false,
      host: '0.0.0.0',
      port: 3000,
      proxy: 'http://localhost:5000',
    }),
  ],
})