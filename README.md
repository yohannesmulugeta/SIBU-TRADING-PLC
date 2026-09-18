# Sibu Trading PLC website

A six-page, static Astro website for Sibu Trading PLC. It is designed for GitHub Pages first and can later move to another static or server-capable host without a redesign.

## Commands

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run check
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

The local site is served under `/SIBU-TRADING-PLC/` to match the GitHub Pages repository path.

## Media workflow

The `image and video/` directory contains high-resolution masters and is intentionally ignored by Git. Run `npm.cmd run media:prepare` to regenerate selected web images. The generated files under `src/assets/media/` are committed.

Video masters are also ignored. `scripts/prepare-video.mjs` creates four lightweight, muted clips when `FFMPEG_PATH` points to a local FFmpeg executable.

## Publishing

Pushing `main` triggers `.github/workflows/deploy.yml`. In GitHub repository settings, Pages must use **GitHub Actions** as its source.

## Content boundaries

- Cultural wording around Buna Qalaa should receive family or cultural-adviser approval before final publication.
- Certifications and lot eligibility must be confirmed for the current crop year.
- The GitHub Pages enquiry form prepares an email draft; it does not send or store submissions.
