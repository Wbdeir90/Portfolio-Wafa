import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './', // Keep the root as the main folder (where package.json is)
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Alias to point to the 'src' folder
    },
  },
  build: {
    outDir: './dist', // Build output goes to the 'dist' folder at the root
  },
  server: {
    port: 3000, // Development server runs on port 3000
  },
});
