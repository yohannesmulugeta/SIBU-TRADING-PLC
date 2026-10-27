# Sibu Trading PLC website

Production: https://sibutradingplc.com/ — Astro static pages on Cloudflare Workers Static Assets, with a protected email enquiry endpoint.

## Development and checks

Use Node.js 24, then `npm ci`, `npm test`, `npm run build` and `npm run test:e2e`.
`npm run dev` previews the pages. `npm run dev:worker` previews the built pages and Worker locally.

## Deployment

Cloudflare Workers Builds watches `main`: build with `npm run build`, then deploy with `npx wrangler deploy`. `wrangler.jsonc` declares the production Worker, static assets, custom domain, email binding, rate limiter and custom 404 behavior. GitHub Actions verifies unit tests, production build and desktop/mobile browser tests. Production should only be promoted after checks pass.

The site uses `sibucoffee.ethio@gmail.com` for every public contact link and enquiry recipient. Cloudflare Email Routing must be enabled and this destination verified before automatic email delivery works. `TURNSTILE_SECRET_KEY` is a Cloudflare Worker secret; never commit it. The public Turnstile site key is in the contact page. Configure secrets separately for any preview environment. The form only reports success after the email service accepts the enquiry, and retains entered details on failure. The native send_email binding only permits verified destinations; the handler fixes the recipient and validates the visitor's address as Reply-To.

For rollback, choose the preceding successful version in the Cloudflare deployment history. Never roll back to an unknown version without checking its bindings and domain configuration.

## Operations

- Cloudflare DNS owns the www-to-apex redirect, HTTPS enforcement, managed firewall, DNSSEC and email DNS records.
- Static response security and cache headers are versioned in `public/_headers`. API responses carry no-store headers.
- Cloudflare Web Analytics is enabled. Review trends and real-user performance in the Cloudflare dashboard.
- Keep Cloudflare/GitHub account two-factor authentication enabled and review account access periodically.
- Verify Google Search Console ownership, then submit `https://sibutradingplc.com/sitemap-index.xml`.

## Media and content

High-resolution masters in `image and video/` are ignored. Selected web media is committed. `npm run media:prepare` regenerates web images; `npm run media:recognition` prepares recognition images. `scripts/prepare-video.mjs` uses a local FFmpeg executable via `FFMPEG_PATH`.

Historical and expired certificates remain labelled. Current certification and lot eligibility must be confirmed with Sibu. Operational figures are attributed to the supplied company profile. The representative Hayked gallery section is held back from publication; only approved Sibu imagery should be published. Management should confirm company facts, cultural wording and image rights before the public announcement.
