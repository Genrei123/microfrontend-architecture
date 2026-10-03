import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'products',
      filename: 'remoteEntry.js',
      remotes: {
        cart: {
          type: 'module',
          name: 'cart',
          entry: 'http://localhost:5001/remoteEntry.js',
        },
      },
      exposes: {
        './ProductPage': './src/ProductPage.tsx',
      },
      dts: {
        generateTypes: {
          tsConfigPath: './tsconfig.mf.json',
        },
      },
      shared: ['react', 'react-dom'],
    }),
  ],
});
