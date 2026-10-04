import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import rehypeExternalLinks from "rehype-external-links";
import rehypeUnwrapImages from "rehype-unwrap-images";
import fauxRemarkEmbedder from "@remark-embedder/core";
import fauxOembedTransformer from "@remark-embedder/transformer-oembed";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import clientMediaIdle from "./src/integrations/clientMediaIdle.ts";
import clientInteraction from "./src/integrations/clientInteraction.ts";

// Default adapter: Netlify (powers Astro Actions for contact/newsletter).
// Swap for another host: `npx astro add cloudflare` or `npx astro add vercel`.
import netlify from "@astrojs/netlify";

const remarkEmbedder = fauxRemarkEmbedder.default ?? fauxRemarkEmbedder;
const oembedTransformer = fauxOembedTransformer.default ?? fauxOembedTransformer;

// https://astro.build/config
export default defineConfig({
  site: "https://starfunnel.unfolding.io",

  fonts: [
    {
      name: "DM Sans",
      cssVariable: "--font-dm-sans",
      provider: fontProviders.fontsource(),
      styles: ["normal"],
      weights: ["300 800"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
    {
      name: "DM Sans",
      cssVariable: "--font-dm-sans",
      provider: fontProviders.fontsource(),
      styles: ["italic"],
      weights: [600],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
  ],

  integrations: [
    icon(),
    mdx({}),
    sitemap(),
    vue({
      appEntrypoint: "/src/pages/_app",
    }),
    clientMediaIdle(),
    clientInteraction(),
  ],

  markdown: {
    processor: unified({
      remarkPlugins: [
        [
          remarkEmbedder,
          {
            transformers: [oembedTransformer],
          },
        ],
      ],
      rehypePlugins: [
        rehypeUnwrapImages,
        [
          rehypeExternalLinks,
          {
            rel: ["nofollow"],
            target: ["_blank"],
          },
        ],
      ],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: [],
      },
      assetsInlineLimit: 10096,
    },
  },

  build: {
    inlineStylesheets: "always",
  },

  scopedStyleStrategy: "attribute",

  prefetch: {
    defaultStrategy: "hover",
  },

  adapter: netlify(),
});
