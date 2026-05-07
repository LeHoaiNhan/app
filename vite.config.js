import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],base:"/app/",
  server: {
    proxy: {
      '/auth': 'http://localhost:4000',
      '/orders': 'http://localhost:4000',
      '/uploads': 'http://localhost:4000',
      '/countries': 'http://localhost:4000',
    }
  }
})
