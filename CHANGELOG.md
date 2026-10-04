# Changelog

All notable changes to the StarFunnel theme are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-04

Major rewrite on Astro 7. Treat this as a new baseline if you are upgrading from 0.1.x.

### Added

- Typed Content Layer collections via `src/content.config.ts` (glob loaders)
- Astro Actions for contact (`actions.contact`) and newsletter (`actions.subscribe`)
- Shared form providers under `src/lib/forms/` (Mailgun, Postmark, Slack, Mailchimp)
- PhotoSwipe lightbox (`SmartPicture`, `Lightbox`, `LightboxGallery`)
- Astro font loading for **DM Sans** (`fontProviders.fontsource`)
- Custom client directives: `client:interaction`, `client:media-idle`
- Netlify adapter + `netlify.toml` (Node 22)
- Deploy docs for Netlify, Cloudflare Workers, and Vercel
- `.nvmrc` pinned to Node 22.12.0
- `knip.json` ignore list for intentional entrypoints
- Typed nanostores store (`src/store.ts`)

### Changed

- CMS from Static CMS / Decap to **Sveltia CMS** (`/admin`, vendored `public/admin/sveltia-cms.js`)
- Styling from Tailwind v3 + PostCSS config to **Tailwind CSS v4** (`@tailwindcss/vite`)
- Images to `astro:assets` `Picture` with layout-aware `sizes` / `widths`
- Markdown unwrap-images plugin: `remark-unwrap-images` → `rehype-unwrap-images`
- Pricing / license copy aligned with Buy me a coffee attribution license
- Dependency refresh: VueUse 15, marked 18, TypeScript 6, Prettier plugins, cross-env 10
- Minimum Node.js **22.12+**

### Removed

- `/api/*` contact, newsletter, and auth route handlers
- `/images/[slug]` routes and custom image service (`src/image-service/`)
- PanZoom, Picture, and unused `ImageNav` components
- Showcase “Made with StarFunnel” blog posts / category
- Legacy Tailwind / PostCSS config files (`tailwind.config.cjs`, `postcss.config.cjs`)
- Unused helpers (`getGridImageSizes`, old image URL helpers, `formatTime` / `formatPrice`)

### Migration notes

1. Use Node 22.12+ and copy `env.txt` → `.env` (env var names updated; see README).
2. Contact/newsletter secrets now power Astro Actions, not `/api` endpoints.
3. Reconfigure the CMS backend in `src/pages/admin.astro` for your GitHub repo.
4. Only one Astro adapter should be installed (default: Netlify).

## [0.1.1]

- Removed astro image tools
- Custom image service that can crop
- Changed mode to hybrid for native functions
- Fixed image sizes
- Made sizes visible on images in dev mode
- Moved functions to `/src/pages/api`
- Upgraded all packages

## [0.1.0]

- First commit

[1.0.0]: https://github.com/unfolding-io/StarFunnel/compare/v0.1.1...upgrade
[0.1.1]: https://github.com/unfolding-io/StarFunnel/releases/tag/v0.1.1
