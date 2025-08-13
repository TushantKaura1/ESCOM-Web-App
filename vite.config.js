import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    cors: true,
    allowedHosts: [
      '5fb7aaf6a53a.ngrok-free.app',  // new ngrok host
      'localhost',
      '127.0.0.1',
    ],
  },
})
