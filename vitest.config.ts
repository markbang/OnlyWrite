import path from 'node:path'
import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    css: true,
    include: [
      'test/**/*.test.ts',
      'test/**/*.test.tsx',
      'test/**/*.spec.ts',
      'test/**/*.spec.tsx',
    ],
    exclude: ['**/node_modules/**', 'test/visual/**', 'src-tauri/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
