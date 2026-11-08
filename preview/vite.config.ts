import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves the site under /Color-theory/; a custom domain (Cloudflare Pages) serves it at the root.
  // Set BASE_PATH=/ in that build.
  base: process.env.BASE_PATH ?? '/Color-theory/',
})
