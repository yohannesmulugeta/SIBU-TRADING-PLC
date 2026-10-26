import { expect, test } from "@playwright/test";

const routes = [
  "",
  "our-story/",
  "origins/",
  "coffee-processing/",
  "quality-impact/",
  "recognition/",
  "gallery/",
  "contact/",
  "privacy/",
  "terms/",
];

test("unknown routes show the branded 404 with working recovery links", async ({ page }) => {
  const response = await page.goto("page-that-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Let’s get you back to Sibu." })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  await expect(page.getByRole("link", { name: "Go to Home" })).toHaveAttribute("href", "/");
  await expect(page.getByRole("link", { name: "Contact Sibu" })).toHaveAttribute("href", "/contact/");
});

test("contact form links to the privacy policy and footer links to both policies", async ({ page }) => {
  await page.goto("contact/");
  await expect(page.locator(".contact-privacy-note a")).toHaveAttribute("href", "/privacy/");
  const policyLinks = page.getByRole("navigation", { name: "Website information" });
  await expect(policyLinks.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy/");
  await expect(policyLinks.getByRole("link", { name: "Terms of Use" })).toHaveAttribute("href", "/terms/");
});

test("contact page shows the supplied office location and directions", async ({ page }) => {
  await page.goto("contact/");
  const map = page.getByTitle("Map showing Adot Building in Addis Ababa");
  await expect(map).toHaveAttribute("src", /q=8\.9933233,38\.7279965.*output=embed/);
  await expect(map).toHaveAttribute("loading", "lazy");
  await expect(page.getByRole("link", { name: "Open directions in Google Maps" })).toHaveAttribute(
    "href", "https://maps.app.goo.gl/hTur8ZZs6Cmp1NLH8",
  );
});

test("team page and navigation are removed", async ({ page }) => {
  const response = await page.goto("team/");
  expect(response?.status()).toBe(404);
  await page.goto("");
  await expect(page.getByRole("link", { name: "Team", exact: true })).toHaveCount(0);
});

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

test("mobile navigation exposes seven unnumbered routes and the logo links home", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation test");
  await page.goto("");
  const trigger = page.locator(".mobile-menu__trigger");
  await expect(trigger).toHaveAccessibleName("Toggle navigation");
  await trigger.click();
  await expect(page.locator("details.mobile-menu")).toHaveAttribute("open", "");
  const links = page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link");
  await expect(links).toHaveCount(7);
  await expect(links.getByText("Home", { exact: true })).toHaveCount(0);
  await expect(page.locator(".mobile-menu__content nav a > span")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Sibu Trading PLC home" })).toHaveAttribute("href", "/");
  await expect(links.first()).toBeVisible();
  const finalAction = page.locator(".mobile-menu__cta");
  await finalAction.focus();
  await page.keyboard.press("Tab");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("details.mobile-menu")).not.toHaveAttribute("open", "");
  await expect(trigger).toBeFocused();
});

test("homepage has an aerial image and a normally playing video hero", async ({ page }) => {
  await page.goto("");
  const hero = page.locator("[data-video-hero]");
  await expect(hero).toBeVisible();
  await expect(hero.getByRole("heading", { level: 1 })).toContainText("Three generations");
  await expect(hero.locator(".eyebrow")).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(hero.locator(".hero-media__poster")).toHaveAttribute("src", /hero-aerial/);
  const video = hero.locator("video");
  await expect(video).toHaveAttribute("data-video-src", /hero-guji\.mp4$/);
  await expect.poll(() => video.evaluate((element) => !(element as HTMLVideoElement).paused)).toBe(true);
  await expect(hero).toHaveClass(/is-playing/);
  await expect(page.locator(".scroll-story")).toHaveCount(0);
});

test("hero keeps its image visible when video cannot load", async ({ page }) => {
  await page.route("**/video/hero-guji.mp4", (route) => route.abort());
  await page.goto("");
  const hero = page.locator("[data-video-hero]");
  await expect(hero.locator(".hero-media__poster")).toBeVisible();
  await expect(hero).not.toHaveClass(/is-playing/);
});

test("homepage keeps the full navigation visible over the video hero", async ({ page, isMobile }) => {
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

test("data saver keeps the hero poster-only", async ({ page }) => {
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
  const hero = page.locator("[data-video-hero]");
  await expect(hero.locator(".hero-media__poster")).toBeVisible();
  await expect(hero.locator("video")).not.toHaveAttribute("src", /.+/);
  await page.locator(".video-panel").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  expect(videoRequests).toEqual([]);
});

test("reduced motion keeps the hero poster-only", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("");

  const hero = page.locator("[data-video-hero]");
  await expect(hero.locator(".hero-media__poster")).toBeVisible();
  await expect(hero.locator("video")).not.toHaveAttribute("src", /.+/);
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
  await expect(page.locator("[data-video-hero]")).toBeVisible();

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

test("desktop navigation reaches the Our Story page", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop navigation test");
  await page.goto("");
  const navigation = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(navigation.getByRole("link", { name: "Home" })).toHaveCount(0);
  await expect(navigation.locator("a span")).toHaveCount(0);
  await navigation.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/our-story\/$/);
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
