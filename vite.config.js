import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vitest трансформирует тесты через esbuild, а production build — через Oxc.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  ...(mode === 'test' ? { esbuild: { jsx: 'automatic' } } : {}),
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/app/main.jsx'],
      reporter: ['text', 'html', 'json-summary'],
      thresholds: {
        lines: 98,
        branches: 98,
        statements: 98,
        functions: 98,
      },
    },
  },
}));
