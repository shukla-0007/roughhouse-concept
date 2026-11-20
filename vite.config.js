import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Media lives in /public/media. The production build is served from
// GitHub Pages at /roughhouse-concept/, so assets need that base path.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/roughhouse-concept/' : '/',
  plugins: [react()],
  server: { port: 5181 },
}))
