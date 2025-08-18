// astro.config.mjs
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mermaid from 'astro-mermaid';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.eirequant.com',
  base: '/',
  integrations: [react(), mermaid()],
  vite: {
    plugins: [tailwindcss()],  // Tailwind v4 via Vite
  },
});
