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
    test(`范围选择与导航截图 ${width}px ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const tabs = await demo(page, "tab-bar", theme === "dark");
      await expect(tabs.locator(".preview-canvas")).toHaveScreenshot(
        `tab-bar-${width}-${theme}.png`,
        { animations: "disabled", stylePath },
      );
      const range = await demo(page, "date-range-picker", theme === "dark");
      await expect(range.locator(".preview-canvas")).toHaveScreenshot(
        `date-range-${width}-${theme}.png`,
        { animations: "disabled", stylePath },
      );
      await range
        .getByRole("button", { name: "日期范围", exact: true })
        .click();
      const dialog = page.getByRole("dialog", {
        name: "日期范围",
        exact: true,
      });
      await expect(dialog.locator(".lg-range-month")).toHaveCount(
        width < 640 ? 1 : 2,
      );
      await expect(dialog).toHaveScreenshot(
        `range-panel-${width}-${theme}.png`,
        { animations: "disabled", stylePath },
      );
    });
  }
}
test("图标和标签组合居中，选中副本使用相同的行高与间距", async ({ page }) => {
  const preview = await demo(page, "tab-bar");
  const measurements = await preview
    .locator(".lg-tab-face,.lg-tab-copy")
    .evaluateAll((faces) =>
      faces.map((face) => {
        const icon = face
          .querySelector(".lg-tab-icon")!
          .getBoundingClientRect();
        const label = face
          .querySelector(".lg-tab-label")!
          .getBoundingClientRect();
        const box = face.getBoundingClientRect();
        return {
          offset: Math.abs(
            (icon.top + label.bottom) / 2 - box.top - box.height / 2,
          ),
          gap: label.top - icon.bottom,
          lineHeight: getComputedStyle(face.querySelector(".lg-tab-label")!)
            .lineHeight,
        };
      }),
    );
  for (const item of measurements) {
    expect(item.offset).toBeLessThan(1);
    expect(item.gap).toBeCloseTo(4);
    expect(item.lineHeight).toBe("14px");
  }
  await preview.getByRole("tab", { name: "探索", exact: true }).click();
  await expect(
    preview.getByRole("tab", { name: "探索", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(preview.locator("output")).toContainText("explore");
});
test("日期范围取消不修改已应用值，范围外日期不可选", async ({ page }) => {
  const preview = await demo(page, "date-range-picker");
  const trigger = preview.getByRole("button", {
    name: "日期范围",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "日期范围", exact: true });
  await expect(
    dialog.getByRole("button", { name: "2026-12-21", exact: true }),
  ).toBeDisabled();
  await dialog.getByRole("button", { name: "2026-11-05", exact: true }).click();
  await dialog.getByRole("button", { name: "取消", exact: true }).click();
  await expect(trigger).toContainText("2026/11/01");
  await expect(trigger).toContainText("2026/11/11");
  await expect(trigger).toHaveAccessibleDescription("2026/11/01 – 2026/11/11");
  await expect(trigger).toBeFocused();
});
test("清除后保留原生必填校验与重置行为", async ({ page }) => {
  const preview = await demo(page, "date-range-picker");
  const trigger = preview.getByRole("button", {
    name: "日期范围",
    exact: true,
  });
  await preview.getByRole("button", { name: "清除", exact: true }).click();
  await preview.getByRole("button", { name: "查询记录", exact: true }).click();
  await expect(preview.getByRole("alert")).toHaveText(
    /请选择开始日期和结束日期/,
  );
  await expect(trigger).toHaveAttribute("aria-invalid", "true");
  await expect(trigger).toBeFocused();
  await preview.getByRole("button", { name: "重置日期", exact: true }).click();
  await expect(trigger).toContainText("2026/11/01");
  await expect(preview.getByRole("alert")).toHaveCount(0);
});
test("窄屏范围浮层显示单月，Escape 返回入口并保留值", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  const preview = await demo(page, "date-range-picker");
  const trigger = preview.getByRole("button", {
    name: "日期范围",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "日期范围", exact: true });
  await expect(dialog.locator(".lg-range-month")).toHaveCount(1);
  const box = (await dialog.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(trigger).toContainText("2026/11/11");
});
test("短视口内日期与确认栏可交互，支持应用跨月范围", async ({ page }) => {
  await page.setViewportSize({ width: 1360, height: 620 });
  const preview = await demo(page, "date-range-picker");
  await preview.getByRole("button", { name: "日期范围", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "日期范围", exact: true });
  const confirm = dialog.getByRole("button", { name: "应用范围", exact: true });
  const panel = (await dialog.boundingBox())!;
  const action = (await confirm.boundingBox())!;
  expect(action.y + action.height).toBeLessThanOrEqual(panel.y + panel.height);
  await dialog.getByRole("button", { name: "2026-11-29", exact: true }).click();
  await dialog.getByRole("button", { name: "2026-12-10", exact: true }).click();
  await confirm.click();
  await preview.getByRole("button", { name: "查询记录", exact: true }).click();
  await expect(preview.locator("output")).toHaveText(
    "2026-11-29 至 2026-12-10",
  );
});
for (const timezoneId of ["America/Los_Angeles", "Asia/Shanghai"]) {
  test(`键盘选择日期范围不因时区漂移 ${timezoneId}`, async ({ browser }) => {
    const context = await browser.newContext({ timezoneId });
    try {
      const page = await context.newPage();
      const preview = await demo(page, "date-range-picker");
      await preview
        .getByRole("button", { name: "日期范围", exact: true })
        .click();
      const dialog = page.getByRole("dialog", {
        name: "日期范围",
        exact: true,
      });
      await dialog
        .getByRole("button", { name: "2026-11-05", exact: true })
        .focus();
      await page.keyboard.press("ArrowRight");
      await expect(
        dialog.getByRole("button", { name: "2026-11-06", exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Enter");
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("Enter");
      await dialog
        .getByRole("button", { name: "应用范围", exact: true })
        .click();
      await preview
        .getByRole("button", { name: "查询记录", exact: true })
        .click();
      await expect(preview.locator("output")).toHaveText(
        "2026-11-06 至 2026-11-07",
      );
    } finally {
      await context.close();
    }
  });
}
