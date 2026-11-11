import { expect, test, type Page } from "@playwright/test";

const names = [
  "checkbox",
  "radio",
  "select",
  "text-area",
  "card",
  "tooltip",
  "popover",
  "toast",
  "tag",
  "badge",
  "avatar",
  "empty",
  "skeleton",
];
async function demo(page: Page, name: string) {
  await page.goto(`/docs/components/${name}`);
  const preview = page.getByRole("region", { name: `${name} 交互示例` });
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAttribute("data-interactive", "true");
  return preview;
}

for (const width of [1360, 390]) {
  test(`all new docs render and fit at ${width}px`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const name of names) {
      const preview = await demo(page, name);
      await expect(preview.locator(".preview-content")).not.toBeEmpty();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
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

test("checkbox maintains checked and mixed states", async ({ page }) => {
  const preview = await demo(page, "checkbox");
  const all = preview.getByRole("checkbox", { name: "全选通知" });
  await expect(all).toHaveJSProperty("indeterminate", true);
  await all.check();
  await expect(preview.getByRole("checkbox", { checked: true })).toHaveCount(4);
  await expect(all).toHaveJSProperty("indeterminate", false);
  await all.focus();
  await page.keyboard.press("Space");
  await expect(preview.getByRole("checkbox", { checked: true })).toHaveCount(0);
  await expect(
    preview.getByRole("checkbox", { name: /系统公告/ }),
  ).toBeDisabled();
});

test("native radio keyboard, form submission and reset", async ({ page }) => {
  const preview = await demo(page, "radio");
  await preview.getByRole("radio", { name: /轻松练习/ }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(preview.getByRole("radio", { name: /专注训练/ })).toBeChecked();
  await preview.getByRole("button", { name: "保存节奏" }).click();
  await expect(preview.locator("output")).toHaveText("已保存：专注训练");
  await preview.getByRole("button", { name: "重置" }).click();
  await expect(preview.getByRole("radio", { name: /轻松练习/ })).toBeChecked();
});

test("select validates, skips disabled options, submits and resets", async ({
  page,
}) => {
  const preview = await demo(page, "select");
  const select = preview.getByRole("combobox", {
    name: "评测语言",
    exact: true,
  });
  await preview.getByRole("button", { name: "确认语言" }).click();
  await expect(select).toBeFocused();
  await expect(select).toHaveAttribute("aria-invalid", "true");
  await expect(preview.getByRole("alert")).toHaveText("请选择一个选项。");
  await expect(preview.locator("output")).not.toContainText("提交值");
  await page.keyboard.press("ArrowDown");
  await expect(preview.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("End");
  const active = await select.getAttribute("aria-activedescendant");
  await expect(page.locator(`[id="${active}"]`)).toHaveText("Java 21");
  await page.keyboard.press("Enter");
  await expect(select).toContainText("Java 21");
  await expect(preview.getByRole("alert")).toHaveCount(0);
  await preview.getByRole("button", { name: "确认语言" }).click();
  await expect(preview.locator("output")).toHaveText("提交值：java");
  await select.focus();
  await page.keyboard.press("p");
  await page.keyboard.press("Enter");
  await expect(select).toContainText("Python 3");
  await select.click();
  await page.keyboard.press("Escape");
  await expect(preview.getByRole("listbox")).toHaveCount(0);
  await expect(select).toBeFocused();
  await preview.getByRole("button", { name: "重置" }).click();
  await expect(select).toContainText("选择评测语言");
});

test("textarea submits and resets its text and counter", async ({ page }) => {
  const preview = await demo(page, "text-area");
  const input = preview.getByRole("textbox", { name: "解题笔记" });
  // 原生校验仍阻止提交，但默认气泡已被取消，错误改为可访问的行内提示。
  await page.evaluate(() => {
    document.addEventListener(
      "invalid",
      (event) => {
        setTimeout(() => {
          document.documentElement.dataset.invalidCanceled = String(
            event.defaultPrevented,
          );
        }, 0);
      },
      true,
    );
  });
  await preview.getByRole("button", { name: "保存笔记" }).click();
  await expect(preview.getByRole("alert")).toHaveText("请填写内容后再提交。");
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("html")).toHaveAttribute(
    "data-invalid-canceled",
    "true",
  );
  await input.fill("记录边界条件");
  await expect(preview.getByRole("alert")).toHaveCount(0);
  await expect(preview.locator(".lg-textarea-count")).toHaveText("6 / 120");
  await preview.getByRole("button", { name: "保存笔记" }).click();
  await expect(preview.locator("output")).toHaveText("已保存：记录边界条件");
  await preview.getByRole("button", { name: "清空" }).click();
  await expect(input).toHaveValue("");
  await expect(preview.locator(".lg-textarea-count")).toHaveText("0 / 120");
});

test("tooltip is described, dismissible and keeps keyboard focus", async ({
  page,
}) => {
  const preview = await demo(page, "tooltip");
  const trigger = preview.getByRole("button", { name: "收藏题目" });
  await trigger.focus();
  const tooltip = preview.getByRole("tooltip");
  await expect(tooltip).toBeVisible();
  await expect(trigger).toHaveAttribute(
    "aria-describedby",
    (await tooltip.getAttribute("id"))!,
  );
  await page.keyboard.press("Escape");
  await expect(tooltip).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("popover supports content interaction, dismissal and focus return", async ({
  page,
}) => {
  const preview = await demo(page, "popover");
  const trigger = preview.getByRole("button", {
    name: "练习偏好",
    exact: true,
  });
  await trigger.click();
  const panel = preview.getByRole("dialog", { name: "练习偏好设置" });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("checkbox")).toBeFocused();
  await panel.getByRole("checkbox").uncheck();
  await panel.getByRole("button", { name: "完成设置" }).click();
  await expect(preview.locator("output")).toHaveText("已关闭解题提示");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await preview.getByRole("button", { name: "切换深色预览" }).click();
  await expect(panel).toHaveCount(0);
});

test("popover stays in mobile viewport and inherits local theme", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 760 });
  const preview = await demo(page, "popover");
  await preview.getByRole("button", { name: "切换深色预览" }).click();
  await preview.getByRole("button", { name: "练习偏好", exact: true }).click();
  const panel = preview.getByRole("dialog");
  const box = await panel.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(760);
  expect(await panel.evaluate((node) => getComputedStyle(node).color)).toBe(
    "rgb(255, 255, 255)",
  );
});

test("toast queues, pauses timers, supports actions and clearing", async ({
  page,
}) => {
  const preview = await demo(page, "toast");
  await page.clock.install();
  await preview.getByRole("button", { name: "排队显示 4 条" }).click();
  const viewport = preview.locator(".lg-toast-viewport");
  await expect(viewport.locator(".lg-toast")).toHaveCount(3);
  await expect(viewport).not.toContainText("第 4 条通知");
  await viewport.locator(".lg-toast").first().hover();
  await page.clock.runFor(2100);
  await expect(viewport).toContainText("第 1 条通知");
  await expect(viewport).toContainText("第 4 条通知");
  await preview.getByRole("button", { name: "清空通知" }).click();
  await expect(viewport.locator(".lg-toast")).toHaveCount(0);
  await preview.getByRole("button", { name: "带操作 · 常驻" }).click();
  await page.clock.runFor(10000);
  await expect(viewport.getByRole("button", { name: "撤销" })).toBeVisible();
  await viewport.getByRole("button", { name: "撤销" }).click();
  await expect(preview.locator("output")).toHaveText("已恢复收藏。");
  await expect(viewport.locator(".lg-toast")).toHaveCount(0);
  await expect(
    preview.getByRole("button", { name: "带操作 · 常驻" }),
  ).toBeFocused();
});

test("removable tags, badges, avatar fallback and empty states", async ({
  page,
}) => {
  let preview = await demo(page, "tag");
  await preview.getByRole("button", { name: "移除数组" }).click();
  await expect(preview.getByRole("button", { name: "移除数组" })).toHaveCount(
    0,
  );
  await preview.getByRole("button", { name: "重置标签" }).click();
  await expect(preview.getByRole("button", { name: "移除数组" })).toBeVisible();
  preview = await demo(page, "badge");
  await preview.getByRole("button", { name: "增加通知" }).click();
  await expect(preview.locator("output")).toHaveText("6 条通知");
  await expect(preview.getByLabel("128", { exact: true })).toHaveText("99+");
  preview = await demo(page, "avatar");
  await preview.getByRole("button", { name: "模拟图片失败" }).click();
  const fallback = preview.getByRole("img", { name: "林", exact: true }).last();
  await expect(fallback.locator("img")).toHaveCount(0);
  await expect(fallback).toHaveText("林");
  await preview.getByRole("button", { name: "恢复图片" }).click();
  await expect(fallback.locator("img")).toBeVisible();
  preview = await demo(page, "empty");
  await preview.getByRole("button", { name: "收藏一道题" }).click();
  await expect(preview.getByText("两数之和")).toBeVisible();
  await preview.getByRole("button", { name: "移除收藏，查看空状态" }).click();
  await expect(preview.getByText("收藏夹还是空的")).toBeVisible();
});

test("skeleton respects reduced motion and is replaced by content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const preview = await demo(page, "skeleton");
  expect(
    await preview
      .locator(".lg-skeleton")
      .first()
      .evaluate((node) => getComputedStyle(node, "::after").animationName),
  ).toBe("none");
  await preview.getByRole("button", { name: "模拟加载完成" }).click();
  await expect(preview.getByText("练习计划已就绪")).toBeVisible();
  await expect(preview.locator(".lg-card")).toHaveAttribute(
    "aria-busy",
    "false",
  );
});
