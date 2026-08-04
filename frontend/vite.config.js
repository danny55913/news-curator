import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api 로 시작하는 요청은 Spring Boot(8080)로 우회
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})