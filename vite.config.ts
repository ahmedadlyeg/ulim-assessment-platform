import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ulim-assessment-platform/',
  
  plugins: [react()],
})
