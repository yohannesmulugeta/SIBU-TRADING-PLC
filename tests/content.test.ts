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
import { operationsGallery } from "../src/data/operationsGallery";
import { teamMembers } from "../src/data/team";
import { heroStoryChapters, heroStoryIntro } from "../src/data/heroStory";
import {
  homepageRecognition,
  qualityRecognition,
  recognitionCategories,
  recognitionItems,
} from "../src/data/recognition";

describe("Sibu website content model", () => {
  it("defines the approved nine-page navigation", () => {
    expect(navigation).toHaveLength(9);
    expect(navigation.map((item) => item.href)).toEqual([
      "/",
      "/our-story/",
      "/team/",
      "/origins/",
      "/coffee-processing/",
      "/quality-impact/",
      "/recognition/",
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
    expect(operationsGallery).toHaveLength(5);
    expect(new Set(operationsGallery.map((item) => item.id)).size).toBe(operationsGallery.length);
  });

  it("lists the five supplied team members with their roles and portraits", () => {
    expect(teamMembers.map(({ name, role }) => [name, role])).toEqual([
      ["Isayas Mitiku Fufa", "Export Manager"],
      ["Helen Assefa Sete", "Export Documentation Head"],
      ["Sileshi Olani", "Quality Manager"],
      ["Husnia Muzeyin", "Finance Head"],
      ["Melkamu Kenea", "HR and Administration Head"],
    ]);
    expect(teamMembers.every(({ name, alt }) => alt === `Portrait of ${name}`)).toBe(true);
  });

  it("defines a complete, deduplicated recognition archive", () => {
    expect(recognitionCategories).toHaveLength(5);
    expect(recognitionItems).toHaveLength(20);
    expect(new Set(recognitionItems.map((item) => item.id)).size).toBe(recognitionItems.length);
    expect(recognitionItems.some((item) => /contractor/i.test(`${item.title} ${item.summary}`))).toBe(false);
    expect(homepageRecognition).toHaveLength(3);
    expect(qualityRecognition).toHaveLength(3);
  });
});
