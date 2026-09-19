# Sibu Recognition Media Catalog

Prepared: 2026-09-19

## Source handling

- Original source: `Certificate of Merit.pdf` (22 scanned pages, approximately 198 MB).
- Separate source: 960 x 1280 photograph of the 2014 Oromia trade and industry plaque.
- Extracted masters are stored in ignored `media-masters/recognition/` and remain unchanged.
- Website derivatives are stored in `src/assets/recognition/` as optimized WebP images.
- Web copies use conventional rotation, cropping, resizing, mild sharpening and explicit redaction only. No text, seal, signature or award content was generated or reconstructed.
- Page 19, the building-contractor award, is intentionally excluded.
- PDF page 3 is excluded because page 4 is a clearer view of the same Co-op Bank appreciation certificate.

## Prepared website assets

| Website asset | PDF page | Category | Publication note |
| --- | ---: | --- | --- |
| `coop-bank-merit-2020.webp` | 1 | Company recognition | Historical award to Sibu Coffee Exporter. |
| `hijra-bank-silver-recognition-2026.webp` | 2 | Leadership recognition | Certificate issued to Kedir Hasen Aredo. Pair with the trophy photograph from page 18. |
| `coop-bank-appreciation.webp` | 4 | Company recognition | Clearer of the two supplied views. Date is not visible. |
| `ecocert-eu-organic-2021-2023.webp` | 5 | Historical certification | Expired 31 March 2023. Certificate identifier is withheld on the web copy. |
| `oromia-tax-recognition-2011.webp` | 6 | Leadership recognition | Personal recognition issued to Kadir Hasan Araddoo. |
| `oromia-investment-performance-2014.webp` | 7 | Leadership recognition | Best Investment Performance recognition issued to Kadir Hasan. |
| `oromia-government-recognition-2009.webp` | 8 | Leadership recognition | Personal regional-government recognition. |
| `gelan-investment-recognition-2014.webp` | 9 | Company recognition | Recognition issued to Sibu Trading. |
| `cup-of-excellence-ethiopia-2020.webp` | 11 | Coffee award | Cup of Excellence Ethiopia 2020 national award winner, score shown as 85.79. |
| `oromia-tax-recognition-2013.webp` | 12 | Leadership recognition | Personal tax recognition issued to Kadir Hasan. |
| `ecocert-nop-organic-2021.webp` | 13 | Historical certification | 2021 NOP organic-operation certificate. Certificate identifier is withheld. Current status is not established by this document. |
| `cafeshow-green-booth-2019.webp` | 14 | Sustainability recognition | Cafe Show Seoul 2019 environmental commitment recognition. |
| `rainforest-alliance-certificate-2021-2024.webp` | 15 | Historical certification | Expired 15 April 2024. Certificate identifier is withheld. |
| `oromia-award-trophy-2011.webp` | 16 | Trophy photograph | Physical award; exact matching certificate should not be asserted without confirmation. |
| `oromia-tax-award-trophy-2017.webp` | 17 | Trophy photograph | Physical award; exact matching certificate should not be asserted without confirmation. |
| `hijra-bank-silver-award-2026.webp` | 18 | Leadership recognition | Physical trophy corresponding to the Hijra Bank certificate on page 2. |
| `ministry-revenue-recognition-2025.webp` | 20 | Company recognition | Ministry of Revenue tax-compliance recognition issued to Sibu Trading PLC. |
| `gfoundation-appreciation-2025.webp` | 21 | Community partnership | Bilingual appreciation certificate dated 21 November 2025. |
| `sibu-recognition-display.webp` | 22 | Editorial photograph | Overview image suitable for a recognition-page hero or closing panel. |
| `oromia-trade-industry-plaque-2014.webp` | Separate image | Plaque photograph | Include as supplied; avoid inventing an English translation of its inscription. |

## Website use

- Use the display photograph as the recognition-page hero.
- Use individual documents and trophies in a lazy-loaded gallery.
- Describe expired documents as historical evidence, never as proof of current certification.
- Do not offer the original PDF or high-resolution masters as public downloads.
- Astro should generate responsive card and lightbox widths from these canonical WebP files.
