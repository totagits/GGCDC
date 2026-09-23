import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  base: './', // Relative base path ensures GitHub Pages works seamlessly on any subpath e.g. https://totagits.github.io/GGCDC/
  build: {
    outDir: 'dist-pages',
    emptyOutDir: true,
  },
});
