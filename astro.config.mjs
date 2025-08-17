// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mermaid from 'astro-mermaid'

export default defineConfig({
  integrations: [mermaid()],
  vite: { plugins: [tailwindcss()] }
})
