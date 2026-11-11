import { expect, test } from "@playwright/test";

const names = [
  "config-provider",
  "typography",
  "form-field",
  "dialog",
  "tabs",
  "table",
  "pagination",
  "date-range-picker",
  "data-table",
  "filter-bar",
  "multi-select",
  "upload",
  "drawer",
  "tree",
  "descriptions",
  "statistic",
  "member-picker",
  "import-wizard",
  "activity-calendar",
  "command-palette",
  "resizable-workspace",
];
for (const width of [1360, 390]) {
  test("新增组件文档与明暗预览 " + width + "px", async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const name of names) {
      await page.goto("/docs/components/" + name);
      const preview = page.getByRole("region", { name: name + " 交互示例" });
      await expect(preview).toHaveAttribute("data-interactive", "true");
      await expect(preview.locator(".preview-content")).not.toBeEmpty();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await preview.getByRole("button", { name: "切换深色预览" }).click();
      await expect(preview.locator(".preview-canvas")).toHaveAttribute(
        "data-theme",
        "dark",
      );
    }
    expect(errors).toEqual([]);
  });
}
