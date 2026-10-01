import type { ImageMetadata } from "astro";
import harvestCherries from "../assets/representative-hayked/harvest-cherries.webp";
import qualityReview from "../assets/representative-hayked/quality-review.webp";
import processingEnvironment from "../assets/representative-hayked/processing-environment.webp";
import organizedStorage from "../assets/representative-hayked/organized-storage.webp";
import warehouseAisle from "../assets/representative-hayked/warehouse-aisle.webp";

type OperationsGalleryLayout = "hero" | "quality" | "processing" | "warehouse" | "export";

export type OperationsGalleryItem = {
  id: string;
  number: string;
  title: string;
  caption: string;
  alt: string;
  image: ImageMetadata;
  layout: OperationsGalleryLayout;
};

// This set is supplied representative imagery from the legacy Hayked collection.
// It is intentionally kept here, separate from confirmed Sibu gallery media.
export const operationsGallery: readonly OperationsGalleryItem[] = [
  {
    id: "representative-harvest-detail",
    number: "01",
    title: "Harvest detail",
    caption: "Coffee begins with careful selection at origin.",
    alt: "Representative photograph of freshly harvested red coffee cherries; not confirmed as a Sibu operation",
    image: harvestCherries,
    layout: "hero",
  },
  {
    id: "representative-quality-review",
    number: "02",
    title: "Quality review",
    caption: "A closer look at green coffee preparation.",
    alt: "Representative photograph of hands reviewing green coffee beans on burlap; not confirmed as a Sibu operation",
    image: qualityReview,
    layout: "quality",
  },
  {
    id: "representative-processing-environment",
    number: "03",
    title: "Processing environment",
    caption: "Preparation connects origin coffee to export-ready lots.",
    alt: "Representative photograph of coffee processing equipment; not confirmed as a Sibu facility",
    image: processingEnvironment,
    layout: "processing",
  },
  {
    id: "representative-organized-storage",
    number: "04",
    title: "Organized storage",
    caption: "Coffee is handled with space for clear lot management.",
    alt: "Representative photograph of bagged coffee stored beside processing equipment; not confirmed as a Sibu facility",
    image: organizedStorage,
    layout: "warehouse",
  },
  {
    id: "representative-warehouse-aisle",
    number: "05",
    title: "Warehouse aisle",
    caption: "Storage is one step in the journey toward shipment.",
    alt: "Representative photograph of a warehouse aisle between coffee sacks; not confirmed as a Sibu facility",
    image: warehouseAisle,
    layout: "export",
  },
] as const;
