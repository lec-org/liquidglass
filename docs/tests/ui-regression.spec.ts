import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { components } from "../app/lib/components";

// 只在截图时隐藏文档站的固定导航，防止它遮住长示例的开头；不改变组件布局。
const screenshotStylePath = fileURLToPath(
  new URL("./ui-screenshot.css", import.meta.url),
);
const screenshotStyle = readFileSync(screenshotStylePath, "utf8");

async function prepare(page: Page, path: string, dark: boolean) {
  await page.goto(path);
  const preview = page.locator('[data-interactive="true"]');
  await expect(preview).toBeVisible();
  if (dark) await preview.getByRole("button", { name: "切换深色预览" }).click();
  return preview;
}

for (const width of [1360, 390]) {
  for (const theme of ["light", "dark"] as const) {
    test(`全部 ${components.length} 个组件的视觉巡检 ${width}px ${theme}`, async ({ page }) => {
      test.setTimeout(240_000);
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      for (const component of components) {
        const preview = await prepare(
          page,
          "/docs/components/" + component.slug,
          theme === "dark",
        );
        await expect(preview.locator(".preview-canvas")).toHaveAttribute(
          "data-theme",
          theme,
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          component.slug,
        ).toBe(true);
        await preview.locator(".preview-canvas").screenshot({
          path: test.info().outputPath(component.slug + ".png"),
          animations: "disabled",
          style: screenshotStyle,
        });
      }
      expect(errors).toEqual([]);
    });

    test(`视觉规范与弹窗截图基线 ${width}px ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      const preview = await prepare(
        page,
        "/docs/visual-system",
        theme === "dark",
      );
      await expect(preview.locator(".preview-canvas")).toHaveScreenshot(
        `visual-system-${width}-${theme}.png`,
        { animations: "disabled", stylePath: screenshotStylePath },
      );
      await preview
        .getByRole("button", { name: "预览详情", exact: true })
        .click();
      const dialog = page.getByRole("dialog", {
        name: "成员资料",
        exact: true,
      });
      await expect(dialog.locator(".lg-dialog-panel")).toHaveScreenshot(
        `dialog-${width}-${theme}.png`,
        { animations: "disabled", stylePath: screenshotStylePath },
      );
      await page.keyboard.press("Escape");
      await expect(
        preview.getByRole("button", { name: "预览详情", exact: true }),
      ).toBeFocused();
    });
  }
}

test("同一密度的控件等高、图标命中区域为正方形、错误和焦点可辨认", async ({
  page,
}) => {
  const preview = await prepare(page, "/docs/visual-system", false);
  for (const [name, height] of [
    ["regular-controls", 40],
    ["compact-controls", 32],
  ] as const) {
    const sizes = await preview
      .getByTestId(name)
      .locator(".lg-input,.lg-select-trigger,.lg-button")
      .evaluateAll((elements) =>
        elements.map((element) =>
          Math.round(element.getBoundingClientRect().height),
        ),
      );
    expect(sizes).toEqual([height, height, height]);
  }
  const icon = await preview
    .getByRole("button", { name: "调整设置" })
    .boundingBox();
  expect(icon?.width).toBe(icon?.height);
  await preview.getByRole("textbox", { name: "查找成员" }).focus();
  await expect(
    preview.getByTestId("regular-controls").locator(".lg-input"),
  ).toHaveCSS("outline-style", "solid");
  await expect(
    preview.getByRole("textbox", { name: "名称校验" }),
  ).toHaveAttribute("aria-invalid", "true");
  await expect(
    preview.getByRole("textbox", { name: "名称校验" }).locator(".."),
  ).toHaveCSS("outline-style", "solid");
});

test("触屏控件至少 44px，输入字体避免系统自动放大", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 900 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  try {
    const preview = await prepare(page, "/docs/visual-system", false);
    const heights = await preview
      .locator(
        '[data-testid="regular-controls"] .lg-input,[data-testid="regular-controls"] .lg-select-trigger,[data-testid="button-sizes"] .lg-button',
      )
      .evaluateAll((elements) =>
        elements.map((element) => element.getBoundingClientRect().height),
      );
    expect(heights.every((height) => height >= 44)).toBe(true);
    await expect(preview.getByRole("textbox", { name: "查找成员" })).toHaveCSS(
      "font-size",
      "16px",
    );
  } finally {
    await context.close();
  }
});

for (const theme of ["light", "dark"] as const) {
  test(`基础表面上语义文字与主要操作对比度 ${theme}`, async ({ page }) => {
    const preview = await prepare(
      page,
      "/docs/visual-system",
      theme === "dark",
    );
    const result = await preview.evaluate((root) => {
      const context = document.createElement("canvas").getContext("2d")!;
      function rgb(color: string) {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        return [...context.getImageData(0, 0, 1, 1).data];
      }
      function luminance(color: number[]) {
        return color.slice(0, 3).reduce((sum, channel, i) => {
          const value = channel / 255;
          return (
            sum +
            (value <= 0.04045
              ? value / 12.92
              : ((value + 0.055) / 1.055) ** 2.4) *
              [0.2126, 0.7152, 0.0722][i]
          );
        }, 0);
      }
      function contrast(a: number[], b: number[]) {
        const x = luminance(a),
          y = luminance(b);
        return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
      }
      const surface = rgb(
        getComputedStyle(
          root.querySelector(".preview-canvas")!,
        ).getPropertyValue("--lg-sheet-opaque"),
      );
      const text = [
        ...root.querySelectorAll(
          '[data-testid="semantic-text"] .lg-typography',
        ),
      ].map((node) => contrast(rgb(getComputedStyle(node).color), surface));
      const buttons = [
        ...root.querySelectorAll(
          '.lg-button[data-variant="filled"]:not(:disabled)',
        ),
      ].map((node) => {
        const style = getComputedStyle(node);
        const fill = rgb(style.backgroundColor);
        const alpha = fill[3] / 255;
        const background = fill.map((value, i) =>
          i < 3 ? value * alpha + surface[i] * (1 - alpha) : 255,
        );
        return contrast(rgb(style.color), background);
      });
      return { text, buttons };
    });
    for (const value of [...result.text, ...result.buttons])
      expect(value).toBeGreaterThanOrEqual(4.5);
  });
}

test("高对比度与减少透明度模式覆盖内容面板和玻璃控件", async ({ page }) => {
  const preview = await prepare(page, "/docs/visual-system", false);
  const session = await page.context().newCDPSession(page);
  for (const feature of ["prefers-contrast", "prefers-reduced-transparency"]) {
    await session.send("Emulation.setEmulatedMedia", {
      features: [
        {
          name: feature,
          value: feature === "prefers-contrast" ? "more" : "reduce",
        },
      ],
    });
    await expect(preview.locator(".lg-input").first()).toHaveCSS(
      "backdrop-filter",
      "none",
    );
    await expect(preview.locator(".lg-table-scroll")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    await preview
      .getByRole("button", { name: "预览详情", exact: true })
      .click();
    await expect(page.locator(".lg-dialog-panel")).toHaveCSS(
      "backdrop-filter",
      "none",
    );
    await page.keyboard.press("Escape");
  }
});
