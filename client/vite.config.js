import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  server: {
    port: 5174,
    proxy: {
      '/ws': {
        target: 'http://localhost:5173',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      'playcanvas': resolve('node_modules/playcanvas'),
    },
  },
});
