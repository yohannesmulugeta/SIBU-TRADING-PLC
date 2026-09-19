import { expect, test } from "@playwright/test";

const routes = [
  "",
  "our-story/",
  "origins/",
  "coffee-processing/",
  "quality-impact/",
  "gallery/",
  "contact/",
];

for (const route of routes) {
  test(`${route || "home"} renders without horizontal overflow`, async ({ page }) => {
    const browserErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") browserErrors.push(message.text());
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));

    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator("main h1").first()).toBeVisible();
    const overflow = await page.evaluate(() => {
      const viewport = document.documentElement.clientWidth;
      const offenders = [...document.querySelectorAll<HTMLElement>("body *")]
        .map((element) => {
          const bounds = element.getBoundingClientRect();
          return {
            element: `${element.tagName.toLowerCase()}.${element.className}`,
            left: Math.round(bounds.left),
            right: Math.round(bounds.right),
          };
        })
        .filter(({ left, right }) => left < -1 || right > viewport + 1)
        .slice(0, 8);

      const containers = [...document.querySelectorAll<HTMLElement>("body *")]
        .filter((element) => element.scrollWidth > element.clientWidth + 1)
        .slice(0, 8)
        .map((element) => ({
          element: `${element.tagName.toLowerCase()}.${element.className}`,
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          before: getComputedStyle(element, "::before").content,
          after: getComputedStyle(element, "::after").content,
        }));

      return {
        hasOverflow: document.documentElement.scrollWidth > viewport,
        viewport,
        rootWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        offenders,
        containers,
      };
    });
    expect(overflow.hasOverflow, JSON.stringify(overflow, null, 2)).toBe(false);
    expect(browserErrors, browserErrors.join("\n")).toEqual([]);
  });
}

test("mobile navigation exposes all seven routes", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation test");
  await page.goto("");
  const trigger = page.locator(".mobile-menu__trigger");
  await expect(trigger).toHaveAccessibleName("Toggle navigation");
  await trigger.click();
  await expect(page.locator("details.mobile-menu")).toHaveAttribute("open", "");
  const links = page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link");
  await expect(links).toHaveCount(7);
  await expect(links.first()).toBeVisible();
});

test("homepage exposes the scroll story and responsive video sources", async ({ page }) => {
  await page.goto("");
  const story = page.getByRole("region", { name: "Three generations of Sibu coffee heritage" });
  await expect(story).toBeVisible();
  await expect(story.getByRole("heading", { level: 1 })).toContainText("Three generations");

  const video = story.locator("video");
  await expect(video).toHaveAttribute("data-src-low", /coffee-scrub-low\.mp4$/);
  await expect(video).toHaveAttribute("data-src-sd", /coffee-scrub-sd\.mp4$/);
  await expect(video).toHaveAttribute("data-src-hd", /coffee-scrub-hd\.mp4$/);
  await expect(story.locator("[data-progress-item]")).toHaveCount(3);
});

test("homepage reveals the full navigation after the scroll story", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop navigation reveal test");
  await page.goto("");
  const header = page.locator(".site-header");
  const navigation = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(header).not.toHaveClass(/site-header--revealed/);
  await expect(navigation).toBeHidden();

  await page.locator(".story-intro").scrollIntoViewIfNeeded();
  await expect(header).toHaveClass(/site-header--revealed/);
  await expect(navigation).toBeVisible();
});

test("data saver keeps the scroll story poster-only", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true, effectiveType: "2g", downlink: 0.4 },
    });
  });

  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".mp4")) videoRequests.push(request.url());
  });

  await page.goto("");
  const story = page.getByRole("region", { name: "Three generations of Sibu coffee heritage" });
  await expect(story).toHaveAttribute("data-media-mode", "poster");
  expect(videoRequests).toEqual([]);
});

test("origins visualizes Ethiopia-to-market connections", async ({ page }) => {
  await page.goto("origins/");
  const map = page.locator(".trade-map");
  await expect(map).toBeVisible();
  await expect(map.locator(".trade-map__routes path")).toHaveCount(6);
  await expect(map.getByText("Ethiopia · Sibu origin")).toBeVisible();
  await expect(map.locator(".trade-map__markets > div")).toHaveCount(9);
});

test("homepage continues from the hero into one concise Sibu story", async ({ page }) => {
  await page.goto("");
  const story = page.getByRole("region", { name: "Three generations of Sibu coffee heritage" });
  await expect(story).toBeVisible();

  const sibuStory = page.locator(".story-intro");
  await expect(sibuStory.getByRole("heading", { level: 2 })).toHaveText(
    "Before Sibu became a company, coffee was already our heritage.",
  );
  await expect(sibuStory.getByText("2014", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Built across three generations" })).toHaveCount(0);
});

test("homepage includes profile proof and a three-panel scroll gallery", async ({ page }) => {
  await page.goto("");
  await expect(page.getByRole("heading", { name: "Built to protect quality at scale" })).toBeVisible();
  const gallery = page.locator("[data-gallery-scroll]");
  await expect(gallery).toHaveCount(1);
  await expect(gallery.locator(".gallery-scroll__panel")).toHaveCount(3);
  await expect(gallery.getByRole("link", { name: "Explore the gallery" })).toHaveAttribute("href", /\/gallery\/$/);
});

test("operational figures count up when they enter the viewport", async ({ page }) => {
  await page.goto("");
  const metrics = page.locator("#company-scale [data-profile-metrics]");
  await metrics.scrollIntoViewIfNeeded();
  await expect(metrics).toHaveAttribute("data-counted", "true");
  await expect(metrics.locator("[data-counter]").first()).toHaveText("400+");
});

test("our story pairs every generation with its portrait", async ({ page }) => {
  await page.goto("our-story/");
  const journey = page.locator(".generation-journey");
  await expect(journey.locator(".generation-card")).toHaveCount(3);
  await expect(journey.locator(".generation-card__portrait img")).toHaveCount(3);
  await expect(page.getByAltText("Traditional carved Buna Qalaa coffee bowl filled with coffee beans")).toBeVisible();
  await expect(page.getByAltText("Coffee teams tending raised drying beds in the Guji highlands")).toBeVisible();
});

test("gallery filters images and opens the full-screen viewer", async ({ page }) => {
  await page.goto("gallery/");
  const cards = page.locator("[data-gallery-card]");
  await expect(cards).toHaveCount(22);

  await page.getByRole("button", { name: "People", exact: true }).click();
  await expect(page.locator("[data-gallery-card]:visible")).toHaveCount(4);

  await page.locator("[data-gallery-card]:visible").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[data-dialog-image]")).toBeVisible();
  await dialog.getByRole("button", { name: "Close image" }).click();
  await expect(dialog).not.toBeVisible();
});
