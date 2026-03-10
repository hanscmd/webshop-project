import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production'
    ? '/webshop-project/'   // za GitHub Pages
    : '/'                   // za lokalni dev i Vercel
})