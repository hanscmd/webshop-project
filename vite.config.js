import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isVercel = process.env.VERCEL

export default defineConfig({
  plugins: [react()],
  base: isVercel ? '/' : '/webshop-project/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
