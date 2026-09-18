import { describe, expect, it } from "vitest";
import { generations, navigation, origins, processes } from "../src/data/site";

describe("Sibu website content model", () => {
  it("defines the approved six-page navigation", () => {
    expect(navigation).toHaveLength(6);
    expect(navigation.map((item) => item.href)).toEqual([
      "/",
      "/our-story/",
      "/origins/",
      "/coffee-processing/",
      "/quality-impact/",
      "/contact/",
    ]);
  });

  it("keeps the core story and process sequences complete", () => {
    expect(generations).toHaveLength(3);
    expect(origins).toHaveLength(4);
    expect(processes).toHaveLength(5);
  });
});
