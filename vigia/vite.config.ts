import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true, // corre tsc en paralelo a Vite
      // opcional: eslint: { lintCommand: 'eslint "./src/**/*.{ts,tsx}"' },
    }),
  ],
  server: {
        host: true, // or '0.0.0.0'
      },
})
