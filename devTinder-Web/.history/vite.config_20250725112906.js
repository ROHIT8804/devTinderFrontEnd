
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Remove the tailwindcss vite plugin as it conflicts with PostCSS
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',
  },
})