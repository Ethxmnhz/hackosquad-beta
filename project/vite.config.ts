import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'firebase/firestore': 'firebase/firestore/lite',
      'firebase/auth': 'firebase/auth/dist/index.esm.js',
      'firebase/storage': 'firebase/storage/dist/index.esm.js'
    }
  },
  build: {
    sourcemap: true
  }
});