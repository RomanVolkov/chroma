import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [tailwindcss(), svelte()],
  base: command === 'serve' ? '/' : (process.env.BASE_PATH || '/chroma/'),
  worker: {
    format: 'es',
  },
  server: {
    port: 5173,
    open: false,
  },
}));
