# Sibu website handover

## Website and publishing

- Public website: https://sibutradingplc.com/
- Source repository: https://github.com/yohannesmulugeta/SIBU-TRADING-PLC
- The site is built with Astro and a Cloudflare Worker for enquiries. Changes pushed to `main` are verified by GitHub Actions; Cloudflare Workers Builds publishes the static assets and Worker from `main`.
- Domain registration and Cloudflare account owner: **confirm with Sibu management**. Record the account owner and renewal contact in the company password manager, not in this repository.
- Website editor and backup contact: **confirm with Sibu management**.

## Enquiries and content

- Contact email shown on the site and configured as the enquiry recipient: sibucoffee.ethio@gmail.com. The form submits to the same-origin `/api/contact` Worker, which relies on Cloudflare Email Routing and a verified destination. Assign a person to monitor the inbox and confirm delivery with a real external test.
- WhatsApp link: +251 94 430 3070. Assign a person to monitor it and test the link on a phone.
- The downloadable company profile is `public/Sibu-Trading-PLC-Company-Profile.pdf`. It is based on the supplied 13-page profile, with the current email, website and WhatsApp contact. Confirm the names, operational figures, photographs, and certification descriptions with management before treating the profile as final.
- Confirm current certificate validity and lot eligibility directly with Sibu for each crop year and buyer requirement. Historical and expired documents on the site remain labelled as such.

## Updating the site

1. Edit the relevant file in `src/pages/`, `src/components/`, or `src/data/`.
2. Run `npm.cmd run check`, `npm.cmd test`, `npm.cmd run build`, and `npm.cmd run test:e2e` in PowerShell.
3. Review the change, push to `main`, then check the Cloudflare deployment and the public URL.
