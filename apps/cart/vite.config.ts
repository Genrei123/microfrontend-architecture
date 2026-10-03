import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'cart',
      filename: 'remoteEntry.js',
      exposes: {
        './CartButton': './src/CartButton.tsx',
        './CartPage': './src/pages/CartPage.tsx',
      },
      dts: {
        generateTypes: {
          tsConfigPath: './tsconfig.mf.json',
        },
      },
      shared: ['react', 'react-dom', 'jotai'],
    }),
  ],
});
