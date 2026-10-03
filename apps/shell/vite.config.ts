import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        products: {
          type: 'module',
          name: 'products',
          entry: 'http://localhost:5002/remoteEntry.js',
        },
        cart: {
          type: 'module',
          name: 'cart',
          entry: 'http://localhost:5001/remoteEntry.js',
        },
      },
      shared: ['react', 'react-dom'],
    }),
  ],
});
