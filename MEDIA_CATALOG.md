# Sibu Website Media Catalog

Reviewed: 2026-09-18

Source folder: `image and video/`

## Inventory

- 131 JPEG photographs, all landscape orientation.
- 117 photographs are 7008 x 4672 pixels; the remaining drone and edited images are also high resolution.
- 2 edited 4K H.264 videos with stereo AAC audio.
- The original files have not been moved, renamed, resized, or modified.

## Photo categories

Every JPEG in the source folder is included below.

| Category | Files | Count | Recommended website use |
| --- | --- | ---: | --- |
| Aerial facility and drying beds | `sibu_drone_photos-1-2.jpg`, `sibu_drone_photos-1.jpg`, `sibu_drone_photos-2.jpg`, `sibu_drone_photos-9.jpg` through `sibu_drone_photos-15.jpg` | 10 | Homepage hero, Guji origin, infrastructure and scale |
| Coffee handler / presenter portraits at drying beds | `sibu_export-4.jpg` through `sibu_export-11.jpg`, `sibu_export-17.jpg`, `sibu_export-20.jpg` through `sibu_export-26.jpg` | 16 | People-led introduction, process storytelling and editorial portraits |
| Experimental night portraits | `sibu_export-29.jpg`, `sibu_export-30.jpg` | 2 | Optional campaign/editorial use; not a core operational image |
| Night cherry reception and processing | `sibu_export-33.jpg`, `sibu_export-34.jpg` | 2 | Process transition, cherry intake and cinematic detail |
| Women sorting and drying parchment coffee | `sibu_export-35.jpg` through `sibu_export-55.jpg` | 21 | People behind the coffee, sorting, drying and community sections |
| Wet processing and washing-station teamwork | `sibu_export-56.jpg` through `sibu_export-67.jpg` | 12 | Farm-to-export process, washing, fermentation and teamwork |
| Male workers and physical quality checks | `sibu_export-68.jpg` through `sibu_export-75.jpg` | 8 | Quality control, worker portraits and coffee inspection |
| Women sorting red coffee cherries | `sibu_export-76.jpg` through `sibu_export-88.jpg` | 13 | Selective sorting, people, harvest and quality-at-origin sections |
| Community, team portraits and work briefing | `sibu_export-89.jpg` through `sibu_export-101.jpg` | 13 | Employment, community, responsibility and team storytelling |
| Drying-bed worker portraits | `sibu_export-114.jpg` through `sibu_export-119.jpg`, `sibu_export-141.jpg` | 7 | Human-centered story cards and profile transitions |
| Green coffee texture and product details | `sibu_export-142.jpg` through `sibu_export-145.jpg` | 4 | Coffee portfolio, quality and product backgrounds |
| Ground-level drying landscapes | `sibu_export-146.jpg` through `sibu_export-148.jpg` | 3 | Origin, scale and section-divider imagery |
| Warehouse, bagging, inspection and prepared coffee | `sibu_export-149.jpg` through `sibu_export-164.jpg` | 16 | Dry mill, warehouse, quality assurance and export preparation |
| Coffee picking in the forest | `sibu_export-165.jpg` through `sibu_export-168.jpg` | 4 | Farm origin, harvest and closing the farm-to-export journey |

Photo category total: 131.

## Video categories

### `final.mp4`

- Duration: 7 minutes 3.10 seconds.
- Resolution: 3840 x 2160 at 24 fps.
- Size: approximately 578 MB.
- Type: documentary/interview film.
- Visible content: sunrise aerials, drying beds, workers covering and tending coffee, washing-station infrastructure, named Sibu farmer interviews, coffee forest and cherry picking, green coffee, additional staff interviews and closing facility aerials.
- Best use: a dedicated "Our People / Our Origin" film, with short silent excerpts prepared separately for the homepage.
- The full file is too large to load directly as a website background.

### `process.mp4`

- Duration: 2 minutes 10.92 seconds.
- Resolution: 3840 x 2160 at 24 fps.
- Size: approximately 174 MB.
- Type: process and facility montage.
- Visible content: sunrise drone footage, drying-bed aerials, forest and coffee picking, cherry sorting, wet processing, parchment handling, warehouse work and closing aerials.
- Best use: source footage for the homepage scroll journey and a shorter "From Cherry to Export" film.
- The source should be cut into short web clips rather than embedded at its current size.

## Strongest initial website selections

### Homepage hero

- `process.mp4` opening sunrise and aerial sequence.
- `sibu_drone_photos-2.jpg`
- `sibu_drone_photos-10.jpg`
- `sibu_drone_photos-12.jpg`
- `sibu_drone_photos-14.jpg`

### People behind the coffee

- `sibu_export-17.jpg`
- `sibu_export-42.jpg`
- `sibu_export-48.jpg`
- `sibu_export-56.jpg`
- `sibu_export-68.jpg`
- `sibu_export-75.jpg`
- `sibu_export-78.jpg`
- `sibu_export-90.jpg`
- `sibu_export-101.jpg`

### Processing and quality

- `sibu_export-34.jpg`
- `sibu_export-58.jpg`
- `sibu_export-61.jpg`
- `sibu_export-62.jpg`
- `sibu_export-83.jpg`
- `sibu_export-142.jpg`
- `sibu_export-153.jpg`
- `sibu_export-155.jpg`

### Warehouse and export preparation

- `sibu_export-150.jpg`
- `sibu_export-151.jpg`
- `sibu_export-155.jpg`
- `sibu_export-159.jpg`
- `sibu_export-163.jpg`
- `sibu_export-164.jpg`

### Farm and harvest

- `sibu_export-146.jpg`
- `sibu_export-147.jpg`
- `sibu_export-148.jpg`
- `sibu_export-165.jpg`
- `sibu_export-167.jpg`

## Curation and production notes

- Many photographs are alternate frames from the same scene. The website should use one or two strong images from each sequence rather than displaying every variation.
- Files `sibu_export-161.jpg` and `sibu_export-162.jpg` visibly show bags marked `O.C.F.C.U` and `BUNA`. Confirm ownership and context before using them as Sibu-branded export evidence.
- The videos contain interview audio and visible name/title graphics. Homepage excerpts should be reviewed for context before their audio is removed or captions are changed.
- Verify consent for recognizable workers and community members before public publication.
- Source JPEGs range from roughly 2.6 MB to 15.4 MB. Create responsive AVIF/WebP derivatives; do not ship the original full-resolution files to normal page visitors.
- Create poster images and short 4-8 second muted clips for scrolling sections. Preserve the two MP4 files as master sources.
- The current collection strongly covers modern operations and people. It does not contain the family-generation portraits, historical photographs, Sibu logo artwork, Buna Qalaa ceremony references, certificates, product packaging, cupping laboratory or international shipment/container scenes needed for the complete planned story.

## Proposed implementation folders

Do not move the masters until the site repository and asset pipeline are confirmed. Derived website assets can later be organized as:

```text
public/media/
  hero/
  origin/
  people/
  processing/
  quality/
  warehouse-export/
  harvest/
  video/
  posters/
```
