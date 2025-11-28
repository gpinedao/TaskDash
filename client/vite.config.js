import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // keep the same port Vite is using
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
})