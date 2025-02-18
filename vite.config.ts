/// <reference types="vitest/config" />

import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    minify: 'esbuild',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Timelify',
      fileName: 'Timelify',
      formats: ['es', 'cjs', 'iife', 'umd', 'system'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  esbuild: {
    keepNames: true,
    minifyIdentifiers: false,
  },
  plugins: [dts({ rollupTypes: true })],
});
