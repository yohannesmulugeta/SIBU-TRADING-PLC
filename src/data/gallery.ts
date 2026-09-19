import type { ImageMetadata } from "astro";
import aerialDrying from "../assets/media/aerial-drying.webp";
import aerialScale from "../assets/media/aerial-scale.webp";
import aerialStation from "../assets/media/aerial-station.webp";
import baggingTeam from "../assets/media/bagging-team.webp";
import beanInspection from "../assets/media/bean-inspection.webp";
import cherrySorting from "../assets/media/cherry-sorting.webp";
import coffeeHost from "../assets/media/coffee-host.webp";
import coffeeHands from "../assets/media/coffee-in-hands.webp";
import coffeePicker from "../assets/media/coffee-picker.webp";
import communityPortrait from "../assets/media/community-portrait.webp";
import communityTeam from "../assets/media/community-team.webp";
import dryingLandscape from "../assets/media/drying-landscape.webp";
import dryingPortrait from "../assets/media/drying-portrait.webp";
import dryingWorker from "../assets/media/drying-worker.webp";
import greenCoffee from "../assets/media/green-coffee.webp";
import heroAerial from "../assets/media/hero-aerial.webp";
import qualityReview from "../assets/media/quality-review.webp";
import sortingDuo from "../assets/media/sorting-duo.webp";
import sortingLine from "../assets/media/sorting-line.webp";
import warehouseCoffee from "../assets/media/warehouse-coffee.webp";
import washingTeam from "../assets/media/washing-team.webp";
import wetProcessing from "../assets/media/wet-processing.webp";

export const galleryCategories = ["Farms", "Harvest", "Processing", "People", "Warehouse", "Export"] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export type GalleryItem = {
  id: string;
  category: GalleryCategory;
  title: string;
  location: string;
  alt: string;
  image: ImageMetadata;
};

export const galleryItems: GalleryItem[] = [
  { id: "guji-highlands", category: "Farms", title: "Guji highlands", location: "Guji, Ethiopia", alt: "Aerial view of the Guji highlands and coffee landscape", image: heroAerial },
  { id: "station-landscape", category: "Farms", title: "Station landscape", location: "Guji", alt: "Aerial view of a coffee station surrounded by green highlands", image: aerialStation },
  { id: "drying-infrastructure", category: "Farms", title: "Coffee at scale", location: "At origin", alt: "Wide aerial view of coffee drying infrastructure", image: aerialScale },
  { id: "forest-drying-beds", category: "Farms", title: "Drying among the forest", location: "Guji", alt: "Coffee drying beds positioned within a forested landscape", image: aerialDrying },
  { id: "origin-landscape", category: "Farms", title: "A landscape shaped by coffee", location: "Southern Ethiopia", alt: "Coffee drying landscape surrounded by trees", image: dryingLandscape },
  { id: "selective-picking", category: "Harvest", title: "Selective cherry picking", location: "At the farm", alt: "Coffee picker harvesting ripe cherries from a coffee tree", image: coffeePicker },
  { id: "cherry-selection", category: "Harvest", title: "Ripe cherry selection", location: "At origin", alt: "Fresh red coffee cherries being carefully selected", image: cherrySorting },
  { id: "wet-processing", category: "Processing", title: "Wet processing", location: "Washing station", alt: "Coffee workers managing wet processing at a station", image: wetProcessing },
  { id: "washing-team", category: "Processing", title: "Work at the washing station", location: "At origin", alt: "Coffee team working together at a washing station", image: washingTeam },
  { id: "drying-work", category: "Processing", title: "Careful drying", location: "Drying beds", alt: "Coffee worker managing parchment on raised drying beds", image: dryingWorker },
  { id: "hand-sorting", category: "Processing", title: "Hand sorting", location: "Preparation site", alt: "Coffee workers sorting parchment by hand", image: sortingLine },
  { id: "bean-inspection", category: "Processing", title: "Physical inspection", location: "Quality control", alt: "Coffee professional inspecting a green coffee bean", image: beanInspection },
  { id: "coffee-host", category: "People", title: "Knowledge at origin", location: "Guji", alt: "Coffee professional presenting prepared coffee", image: coffeeHost },
  { id: "community-portrait", category: "People", title: "People behind the coffee", location: "Coffee community", alt: "Portrait of a community member at a coffee site", image: communityPortrait },
  { id: "community-team", category: "People", title: "Shared work", location: "Processing station", alt: "Members of a coffee-producing community together", image: communityTeam },
  { id: "drying-portrait", category: "People", title: "Experience and attention", location: "Drying station", alt: "Portrait of a coffee worker at the drying beds", image: dryingPortrait },
  { id: "warehouse-review", category: "Warehouse", title: "Warehouse preparation", location: "Sibu facility", alt: "Coffee team reviewing prepared beans in a warehouse", image: sortingDuo },
  { id: "stored-coffee", category: "Warehouse", title: "Prepared green coffee", location: "Warehouse", alt: "Prepared green coffee stored inside a warehouse", image: warehouseCoffee },
  { id: "bagging-team", category: "Warehouse", title: "Bagging and preparation", location: "Warehouse", alt: "Coffee team preparing export bags", image: baggingTeam },
  { id: "quality-release", category: "Export", title: "Quality before release", location: "Export preparation", alt: "Coffee professionals reviewing quality before shipment", image: qualityReview },
  { id: "green-coffee", category: "Export", title: "Green coffee prepared to specification", location: "Export preparation", alt: "Close view of prepared Ethiopian green coffee", image: greenCoffee },
  { id: "coffee-in-hand", category: "Export", title: "The prepared lot", location: "Ready for presentation", alt: "Prepared green coffee held for inspection", image: coffeeHands },
];
