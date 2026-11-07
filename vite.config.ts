/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    proxy: { '/api': 'http://localhost:8000' },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // Las pruebas usan siempre la API y Cognito simulados
    env: { VITE_USE_MOCKS: 'true' },
    css: false,
    testTimeout: 30_000,
    // I-06 (SQA): la CI exige al menos 80 % de cobertura, como el backend.
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/mocks/**',
        'src/types/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/pages/DevUiPage.tsx',
      ],
      reporter: ['text-summary', 'text'],
      thresholds: { lines: 80, statements: 80 },
    },
  },
})
