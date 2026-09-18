import { expect, test } from "@playwright/test";

const routes = [
  "",
  "our-story/",
  "origins/",
  "coffee-processing/",
  "quality-impact/",
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

test("mobile navigation exposes all six routes", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation test");
  await page.goto("");
  const trigger = page.locator(".mobile-menu__trigger");
  await expect(trigger).toHaveAccessibleName("Toggle navigation");
  await trigger.click();
  await expect(page.locator("details.mobile-menu")).toHaveAttribute("open", "");
  const links = page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link");
  await expect(links).toHaveCount(6);
  await expect(links.first()).toBeVisible();
});
