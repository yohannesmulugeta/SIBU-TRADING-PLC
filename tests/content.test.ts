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
import { featuredTeamMember, teamDemoNotice, teamMembers } from "../src/data/team";
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

  it("keeps team-page placeholders centralized and explicitly labelled", () => {
    expect(teamDemoNotice).toMatch(/demo team layout/i);
    expect(featuredTeamMember.alt).toMatch(/temporary demo portrait/i);
    expect(teamMembers).toHaveLength(3);
    expect(teamMembers.every((member) => member.alt.includes("Temporary demo portrait"))).toBe(true);
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
