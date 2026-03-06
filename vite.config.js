import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/webshop-project/', // Zameni sa imenom tvog repozitorijuma
})