import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    minify: 'esbuild',
    sourcemap: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'schedi',
      fileName: 'schedi',
      formats: ['es', 'cjs', 'iife', 'umd'],
    },
    rollupOptions: {
      external: ['uuid'], // Mark uuid as external
      output: {
        globals: {
          uuid: 'uuid', // Define the global variable for uuid
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  esbuild: {
    keepNames: false,
    minifyIdentifiers: true,
    treeShaking:true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
  plugins: [dts({ rollupTypes: true })],
});
