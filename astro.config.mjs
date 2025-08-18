import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://www.eirequant.com',
  output: 'static',
  integrations: [react()],
});
