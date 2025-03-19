import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true  // This allows external connections
  },
  plugins: [react(), glsl()]
})