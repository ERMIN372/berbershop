import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base должен совпадать с именем репозитория: https://ERMIN372.github.io/berbershop/
export default defineConfig({
  base: '/berbershop/',
  plugins: [react(), tailwindcss()],
})
