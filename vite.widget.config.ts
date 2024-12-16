import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget/index.tsx'),
      name: 'CommissionCalculatorWidget',
      fileName: 'commission-calculator-widget',
      formats: ['iife'],
    },
    rollupOptions: {
      external: [],
    },
    outDir: 'dist/widget',
  },
});