# StarFunnel | Astro 7 + Sveltia CMS

[![License: CC BY-ND 4.0](https://img.shields.io/badge/License-CC_BY--ND_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nd/4.0/)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Astro](https://img.shields.io/badge/Astro-7-BC52EE)
![Node](https://img.shields.io/badge/node-%3E%3D22.12-339933)

Fast sales-funnel theme built on **Astro 7**, **Tailwind CSS v4**, **Vue 3**, typed **content collections**, and **Sveltia CMS**.

## Features

- Funnel landing pages with video hero, pricing, FAQs, and lead capture
- Typed Content Layer collections (`src/content.config.ts`)
- Optimized images via `astro:assets` `Picture` with layout-aware `sizes` / `widths`
- PhotoSwipe lightbox for image enlargement (no `/images` routes)
- Sveltia CMS admin at `/admin`
- Contact + newsletter via [Astro Actions](https://docs.astro.build/en/guides/actions/) (Mailgun, Postmark, Slack, Mailchimp)
- Deferred Vue islands (`client:interaction`, `client:media-idle`)

See [`CHANGELOG.md`](CHANGELOG.md) for the full **1.0.0** release notes and migration guide.

## Stack

| Layer | Package / note |
| --- | --- |
| Framework | `astro` 7 |
| UI islands | `vue` 3 + `@vueuse/*` 15 |
| Styles | `tailwindcss` 4 + `@tailwindcss/vite` |
| CMS | Sveltia (`public/admin/sveltia-cms.js`) |
| Forms | Astro Actions + `src/lib/forms/` |
| Markdown | `@astrojs/mdx`, `marked` 18, Unified remark/rehype plugins |
| Types | TypeScript 6 (`astro check`) |
| Default host | `@astrojs/netlify` |

## Requirements

- Node.js **22.12+** (see `.nvmrc`)
- npm 10+

## Getting started

```bash
cp env.txt .env
npm install
npm run dev
```

Demo env shortcut:

```bash
npm run dev:demo
```

## Environment

Template: [`env.txt`](env.txt). Copy to `.env` locally and mirror the same keys on your host.

| Variable | Purpose |
| --- | --- |
| `BLOG_SLUG` | Blog URL segment (default `news`) |
| `WEBSITE_LANGUAGE` | Locale for UI strings |
| `CURRENCY` / `UNITS` | Display preferences |
| `NEWSLETTER_PROVIDER` | Newsletter provider (`mailchimp`) |
| `MAILCHIMP_*` | Mailchimp API key, server prefix, list id |
| `CONTACT_FORM_ENDPOINT` | Contact provider override: `mailgun` \| `postmark` \| `slack` |
| `FROM_EMAIL_ADDRESS` / `TO_EMAIL_ADDRESS` | Mail sender / default recipient |
| `MAILGUN_*` / `POSTMARK_*` / `SLACK_*` | Provider credentials |

## CMS (Sveltia)

Open `/admin` in the browser. Collection definitions live in [`src/cms/`](src/cms/). Media is stored under `src/assets`.

On **localhost**, Sveltia offers “Work with local repository” (File System Access). Choose this repo root (the folder that contains `.git`). For production, sign in with GitHub; backend settings are in [`src/pages/admin.astro`](src/pages/admin.astro).

## Forms (Astro Actions)

Contact and newsletter run as Astro Actions under [`src/actions/`](src/actions/) with shared providers in [`src/lib/forms/`](src/lib/forms/).

| Action | Used by | Providers |
| --- | --- | --- |
| `actions.contact` | Contact dialog (`#contact`) | `mailgun`, `postmark`, `slack` |
| `actions.subscribe` | Footer / dialog newsletter | `mailchimp` |

Pages stay statically prerendered; the adapter only serves the action endpoints. Set the matching secrets in `.env` (local) and in your host’s environment UI (production).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run dev:demo` | Dev server with demo env vars |
| `npm run check` | Type-check with `astro check` |
| `npm run build` | Production build |
| `npm run preview` | Preview `dist/` |

## Deploy

StarFunnel is mostly static HTML. An [Astro adapter](https://docs.astro.build/en/guides/on-demand-rendering/) is required so Actions can run on the server. The repo ships with **`@astrojs/netlify`**.

Official deploy guides: [Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/) · [Netlify](https://docs.astro.build/en/guides/deploy/netlify/) · [Vercel](https://docs.astro.build/en/guides/deploy/vercel/)

### Netlify (default)

Already configured (`adapter: netlify()` in [`astro.config.mjs`](astro.config.mjs), [`netlify.toml`](netlify.toml)).

1. Connect the Git repo in the Netlify UI (or use the Netlify CLI).
2. Build command: `npm run build` · publish directory: `dist` (set by `netlify.toml`).
3. Add the same secrets from `env.txt` under **Site configuration → Environment variables**.
4. Deploy.

### Cloudflare Workers

1. Swap the adapter:

   ```bash
   npx astro add cloudflare
   ```

2. Set secrets / vars in the Cloudflare dashboard for Mailchimp / Mailgun / Postmark / Slack as needed.
3. Local preview / deploy:

   ```bash
   npx astro build && npx wrangler dev
   npx astro build && npx wrangler deploy
   ```

### Vercel

1. Swap the adapter:

   ```bash
   npx astro add vercel
   ```

2. Import the project in Vercel. Framework preset: Astro.
3. Add environment variables from `env.txt`.
4. Deploy.

### Switching hosts later

Only one adapter should be active. After `npx astro add <platform>`, remove the unused adapter package if it remains in `package.json`, and keep host-specific config aligned with the platform you actually use.

## Upgrading from 0.1.x

This is a **breaking** major release. Highlights:

- Node 22.12+ required (was 18/20)
- `/api/*` form routes → Astro Actions
- Static CMS → Sveltia CMS
- Custom image service / `/images` routes → `astro:assets` + PhotoSwipe

Full details: [`CHANGELOG.md`](CHANGELOG.md).

## License

CC BY-ND 4.0 — see [`LICENSE.md`](LICENSE.md). Attribution in the footer must remain visible unless you purchase a [Buy me a coffee](https://buymeacoffee.com/unfolding.io) license — see [pricing](https://starfunnel.unfolding.io/pricing).
