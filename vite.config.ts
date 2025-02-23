import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import svg from './src/index.mjs';

export default defineConfig({
  root: "./",
  base: "./",
  plugins: [
    solid(),
    svg({
      include: ['**/*.svg?solid'],
    }),
  ],
  server: {
    port: 4000,
  },
  build: {
    target: 'esnext',
  },
});