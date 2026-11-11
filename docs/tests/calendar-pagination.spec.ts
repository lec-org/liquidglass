import { expect, test, type Page } from "@playwright/test";
import { fileURLToPath } from "node:url";

const stylePath = fileURLToPath(
  new URL("./ui-screenshot.css", import.meta.url),
);
async function demo(page: Page, name: string, dark = false) {
  await page.goto("/docs/components/" + name);
  const preview = page.locator('[data-interactive="true"]');
  await expect(preview).toBeVisible();
  if (dark) await preview.getByRole("button", { name: "切换深色预览" }).click();
  return preview;
}

for (const width of [1360, 390]) {
  for (const theme of ["light", "dark"] as const) {
    for (const name of ["activity-calendar", "pagination"]) {
      test(`日历与分页截图 ${name} ${width}px ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 1000 });
        await page.emulateMedia({ reducedMotion: "reduce" });
        const preview = await demo(page, name, theme === "dark");
        await expect(preview.locator(".preview-canvas")).toHaveScreenshot(
          `${name}-${width}-${theme}.png`,
          { animations: "disabled", stylePath },
        );
      });
    }
  }
}

test("月历在窄屏等宽排列，今天和选中日期独立", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  const preview = await demo(page, "activity-calendar");
  const calendar = preview.locator(".lg-activity-calendar");
  const bounds = await calendar.boundingBox();
  const content = await preview.locator(".preview-content").boundingBox();
  expect(bounds!.width).toBeGreaterThan(280);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
    content!.x + content!.width + 1,
  );
  await expect(calendar.getByRole("columnheader")).toHaveCount(7);
  await expect(
    calendar.getByRole("button", { name: /2026-11-11/ }),
  ).toHaveAttribute("aria-current", "date");
  const alignment = await calendar.evaluate((element) => {
    const headers = [...element.querySelectorAll('[role="columnheader"]')].map(
      (node) => node.getBoundingClientRect(),
    );
    const dates = [
      ...element.querySelectorAll(
        ".lg-calendar-row:not(.lg-calendar-weekdays)",
      ),
    ].flatMap((row) =>
      [...row.querySelectorAll(".lg-calendar-cell")].map((node, index) => {
        const box = node.getBoundingClientRect();
        return {
          difference: Math.abs(
            box.x + box.width / 2 - headers[index].x - headers[index].width / 2,
          ),
          width: box.width,
        };
      }),
    );
    return {
      maximumOffset: Math.max(...dates.map((day) => day.difference)),
      minimumWidth: Math.min(...dates.map((day) => day.width)),
    };
  });
  expect(alignment.maximumOffset).toBeLessThan(1);
  expect(alignment.minimumWidth).toBeGreaterThan(30);
  await calendar.getByRole("button", { name: /2026-11-12/ }).click();
  await expect(
    calendar.locator('[aria-selected="true"] button'),
  ).toHaveAttribute("data-date", "2026-11-12");
  await expect(
    calendar.getByRole("button", { name: /2026-11-11/ }),
  ).toHaveAttribute("aria-current", "date");
});

test("分页条数复用玻璃选择器，键盘改条数并回到第一页", async ({ page }) => {
  const preview = await demo(page, "pagination");
  await preview.getByRole("button", { name: "第 2 页", exact: true }).click();
  const selector = preview.getByRole("combobox", { name: "每页条数" });
  await expect(selector).toHaveJSProperty("tagName", "BUTTON");
  await selector.click();
  await expect(selector).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(selector).toHaveText("20 / 页");
  await expect(preview.locator("output")).toContainText(
    "当前第 1 页，每页 20 条",
  );
  await expect(
    preview.getByRole("button", { name: "第 8 页", exact: true }),
  ).toBeVisible();
});

test("分页选择器窄屏等高，浮层位于视口内并支持 Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  const preview = await demo(page, "pagination");
  const selector = preview.getByRole("combobox", { name: "每页条数" });
  const button = preview.getByRole("button", { name: "第 1 页", exact: true });
  expect((await selector.boundingBox())!.height).toBe(
    (await button.boundingBox())!.height,
  );
  await selector.click();
  const options = page.getByRole("listbox", { name: "每页条数" });
  const box = (await options.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  await page.keyboard.press("Escape");
  await expect(options).not.toBeVisible();
  await expect(selector).toBeFocused();
});
