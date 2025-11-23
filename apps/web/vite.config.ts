import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@atlas/core': path.resolve(__dirname, '../../packages/core/src'),
      '@atlas/storage': path.resolve(__dirname, '../../packages/storage/src'),
      '@atlas/insights': path.resolve(__dirname, '../../packages/insights/src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
