// @ts-check
import { defineConfig } from 'astro/config'

/*
 * SITE_URL e BASE_PATH são preenchidos automaticamente pelo GitHub Actions
 * (veja .github/workflows/deploy.yml). No seu computador, o site roda em "/".
 * Quando tiverem domínio próprio, troque SITE_URL pelo domínio e BASE_PATH por "/".
 */
export default defineConfig({
  site: process.env.SITE_URL || 'https://imarjunior.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  // Carrega a próxima página quando o mouse passa no link: a troca fica quase instantânea
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
  // O Three.js (oceano 3D) é grande, mas é carregado à parte, depois do resto da página
  vite: { build: { chunkSizeWarningLimit: 800 } },
})
