import { describe, expect, it } from "vitest";
import {
  certifications,
  companyStats,
  exportMarkets,
  generations,
  navigation,
  originFacilities,
  origins,
  processes,
} from "../src/data/site";
import { galleryCategories, galleryItems } from "../src/data/gallery";
import { heroStoryChapters, heroStoryIntro } from "../src/data/heroStory";

describe("Sibu website content model", () => {
  it("defines the approved seven-page navigation", () => {
    expect(navigation).toHaveLength(7);
    expect(navigation.map((item) => item.href)).toEqual([
      "/",
      "/our-story/",
      "/origins/",
      "/coffee-processing/",
      "/quality-impact/",
      "/gallery/",
      "/contact/",
    ]);
  });

  it("keeps the core story and process sequences complete", () => {
    expect(generations).toHaveLength(3);
    expect(origins).toHaveLength(4);
    expect(processes).toHaveLength(5);
  });

  it("defines a complete three-chapter scroll story", () => {
    expect(heroStoryIntro.title).toEqual(["Three generations.", "One origin. One legacy."]);
    expect(heroStoryChapters).toHaveLength(3);
    expect(heroStoryChapters.map((chapter) => chapter.number)).toEqual(["01", "02", "03"]);
    expect(heroStoryChapters.at(-1)?.range[1]).toBe(1);
  });

  it("keeps profile proof and gallery content complete", () => {
    expect(companyStats).toHaveLength(5);
    expect(certifications).toHaveLength(5);
    expect(originFacilities).toHaveLength(3);
    expect(exportMarkets).toHaveLength(9);
    expect(galleryCategories).toHaveLength(6);
    expect(galleryItems).toHaveLength(22);
    expect(new Set(galleryItems.map((item) => item.id)).size).toBe(galleryItems.length);
  });
});
