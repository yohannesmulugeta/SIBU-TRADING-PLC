# Sibu Trading PLC website

A static Astro website for Sibu Trading PLC, published at https://sibutradingplc.com/ through Cloudflare Pages.

## Commands

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run check
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

The local site is served at `/`, matching the production domain.

## Media workflow

The `image and video/` directory contains high-resolution masters and is intentionally ignored by Git. Run `npm.cmd run media:prepare` to regenerate selected web images. The generated files under `src/assets/media/` are committed.

Video masters are also ignored. `scripts/prepare-video.mjs` creates four lightweight, muted clips when `FFMPEG_PATH` points to a local FFmpeg executable.

## Publishing

Pushing `main` triggers the GitHub verification workflow. Cloudflare Pages builds the same branch with `npm run build` and publishes `dist`.

## Content boundaries

- Cultural wording around Buna Qalaa should receive family or cultural-adviser approval before final publication.
- Certifications and lot eligibility must be confirmed for the current crop year.
- The enquiry form prepares an email draft; it does not send or store submissions unless a verified `PUBLIC_FORM_ENDPOINT` is configured.
