import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import indexNowSubmitter from "./src/lib/indexNowAstro.ts"

export default defineConfig({
  site: "https://traceroutex.vercel.app",
  output: "static",
  compressHTML: true,

  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: {
        theme: "github-dark",
      },
    }),
    react(),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: { en: "en-US" },
      },
      changefreq: "weekly",
      priority: 0.7,
    }),
    indexNowSubmitter("dcaf3c5ee7764f1682bc927ce510e7f4", "https://traceroutex.vercel.app"),
  ],

  vite: {
    ssr: {
      noExternal: ["@traceroutex/ui"],
      external: ["@traceroutex/db"],
    },
    build: {
      rollupOptions: {
        external: ["@traceroutex/db"],
      },
    },
  },
})

// Trigger Astro restart
