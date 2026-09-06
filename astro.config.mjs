import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  // Astro validates proxy hosts before constructing request.url in server routes.
  security: {
    allowedDomains: [...new Set([
      'big-marketing-sand.vercel.app',
      'big-marketing-serchoxx-2999.vercel.app',
      process.env.VERCEL_URL,
      process.env.VERCEL_BRANCH_URL,
    ].filter(Boolean))].map(hostname => ({protocol:'https',hostname})),
  },
  devToolbar: { enabled: false },
});
