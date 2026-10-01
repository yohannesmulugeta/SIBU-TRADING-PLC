import { expect, test } from "@playwright/test";

const routes = [
  "",
  "our-story/",
  "team/",
  "origins/",
  "coffee-processing/",
  "quality-impact/",
  "recognition/",
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
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\//);
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

test("mobile navigation exposes all nine routes", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation test");
  await page.goto("");
  const trigger = page.locator(".mobile-menu__trigger");
  await expect(trigger).toHaveAccessibleName("Toggle navigation");
  await trigger.click();
  await expect(page.locator("details.mobile-menu")).toHaveAttribute("open", "");
  await page.locator(".mobile-nav__group > summary").click();
  const links = page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link");
  await expect(links).toHaveCount(9);
  await expect(links.first()).toBeVisible();
  const finalAction = page.locator(".mobile-menu__cta");
  await finalAction.focus();
  await page.keyboard.press("Tab");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("details.mobile-menu")).not.toHaveAttribute("open", "");
  await expect(trigger).toBeFocused();
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

test("homepage defers the hero film until the visitor interacts", async ({ page }) => {
  await page.goto("");
  const video = page.locator(".scroll-story__video");
  await expect.poll(() => video.evaluate((element) => (element as HTMLVideoElement).currentSrc)).toBe("");

  await page.mouse.wheel(0, 240);
  await expect.poll(() => video.evaluate((element) => (element as HTMLVideoElement).currentSrc), { timeout: 10_000 }).toMatch(/coffee-scrub-.*\.mp4$/);
});

test("homepage keeps the full navigation visible over the scroll story", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop navigation visibility test");
  await page.goto("");
  const header = page.locator(".site-header");
  const navigation = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(header).not.toHaveClass(/site-header--revealed/);
  await expect(navigation).toBeVisible();
  await expect(page.getByRole("link", { name: "Skip the film" })).toHaveCount(0);

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
  await page.locator(".video-panel").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  expect(videoRequests).toEqual([]);
});

test("reduced motion renders a static story without hydration errors", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("");

  const story = page.getByRole("region", { name: "Three generations of Sibu coffee heritage" });
  await expect(story).toHaveClass(/scroll-story--static/);
  await expect(story.locator("[data-story-copy]")).toHaveCount(4);
  expect(errors).toEqual([]);
});

test("contact form has progressive validation and a delivery fallback", async ({ page }) => {
  await page.goto("contact/");
  const form = page.locator(".enquiry-form");
  await form.scrollIntoViewIfNeeded();
  await expect(form).toHaveAttribute("action", /^mailto:/);
  await form.getByRole("button", { name: "Prepare email enquiry" }).click();
  await expect(form.locator(":invalid")).not.toHaveCount(0);
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

test("gallery page includes a five-image operations gallery after the main collection", async ({ page }) => {
  await page.goto("gallery/");
  const gallery = page.getByRole("region", { name: /Operations and quality gallery/ });
  await expect(gallery).toBeVisible();
  await expect(gallery.locator(".operations-gallery__item")).toHaveCount(5);
  await expect(page.getByText(/does not confirm a Sibu facility, employee, or process/)).toBeVisible();
  await expect(page.locator(".gallery-grid")).toBeVisible();
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

test("team page labels fictional people and contact route correctly", async ({ page }) => {
  await page.goto("team/");
  await expect(page.getByRole("heading", { name: "The people behind every lot." })).toBeVisible();
  await expect(page.getByRole("note")).toContainText("AI-generated portraits");
  await expect(page.getByAltText("AI-generated fictional demo portrait for the Sibu Trading team-page layout")).toHaveCount(4);
  await expect(page.getByRole("link", { name: /Contact Sibu Trading/ })).toHaveAttribute("href", /\/contact\/$/);
});

test("desktop navigation reaches the team page", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop navigation test");
  await page.goto("");
  const aboutMenu = page.locator(".desktop-nav__group");
  await aboutMenu.locator("summary").click();
  await aboutMenu.getByRole("link", { name: "Team" }).click();
  await expect(page).toHaveURL(/\/team\/$/);
});

test("mobile generational journey is a swipeable, keyboard-accessible rail", async ({ page, isMobile }) => {
  test.skip(!isMobile || (page.viewportSize()?.width ?? Number.POSITIVE_INFINITY) > 700, "Narrow mobile journey test");
  await page.goto("our-story/");
  const journey = page.getByRole("region", { name: "Sibu's generational journey chapters" });
  await journey.scrollIntoViewIfNeeded();
  await expect(journey).toBeVisible();
  await expect(journey).toHaveCSS("scroll-snap-type", "x mandatory");
  await expect(page.getByText("Swipe left to explore")).toBeVisible();
  await expect(page.locator(".generation-journey__cue strong")).toHaveText("01 / 03");

  await journey.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".generation-journey__cue strong")).toHaveText("02 / 03");
});

test("mobile gallery preview is a swipeable, keyboard-accessible rail", async ({ page, isMobile }) => {
  test.skip(!isMobile || (page.viewportSize()?.width ?? Number.POSITIVE_INFINITY) > 700, "Narrow mobile gallery preview test");
  await page.goto("");
  const preview = page.locator("[data-gallery-scroll]");
  const rail = preview.getByRole("region", { name: "Three views of the coffee journey" });
  await preview.scrollIntoViewIfNeeded();
  await expect(rail).toHaveCSS("scroll-snap-type", "x mandatory");
  await expect(preview.getByText("Swipe left to explore")).toBeVisible();
  await expect(preview.locator("[data-gallery-current]")).toHaveText("01 / 03");

  await rail.focus();
  await page.keyboard.press("ArrowRight");
  await expect(preview.locator("[data-gallery-current]")).toHaveText("02 / 03");
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

test("recognition filters historical records and opens accessible detail", async ({ page }) => {
  await page.goto("recognition/");
  const cards = page.locator("[data-recognition-card]");
  await expect(cards).toHaveCount(20);

  await page.getByRole("button", { name: "Certifications", exact: true }).click();
  await expect(page.locator("[data-recognition-card]:visible")).toHaveCount(3);

  const firstCard = page.locator("[data-recognition-card]:visible").first();
  await firstCard.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[data-dialog-status]")).toContainText(/Expired|Historical/);
  await expect(dialog.getByRole("button", { name: "Close recognition" })).toBeFocused();
  await dialog.getByRole("button", { name: "Close recognition" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(firstCard).toBeFocused();
});
