import { test, expect, type Page } from "@playwright/test";

// 等待组件站完成激活，再操作预渲染 HTML 中的控件。
async function demo(page: Page, name: string) {
  await page.goto("/docs/components/" + name);
  const preview = page.getByRole("region", { name: name + " 交互示例" });
  await expect(preview).toHaveAttribute("data-interactive", "true");
}

test("Dialog 异步保存阻止重复操作，关闭后恢复焦点", async ({ page }) => {
  await demo(page, "dialog");
  await page.getByRole("button", { name: "编辑资料", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "编辑资料", exact: true });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "编辑资料", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "编辑资料", exact: true }).click();
  const save = dialog.getByRole("button", { name: "保存修改", exact: true });
  await save.click();
  await expect(save).toBeDisabled();
  await expect(save).toHaveAttribute("aria-busy", "true");
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("output")).toContainText("资料已保存");
});

test("Tabs 跳过禁用项并保留编辑状态", async ({ page }) => {
  await demo(page, "tabs");
  await page.getByRole("textbox", { name: "个人签名" }).fill("学习 TypeScript");
  const first = page.getByRole("tab", { name: "基本资料" });
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "近期活动" })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(first).toBeFocused();
  await expect(page.getByRole("textbox", { name: "个人签名" })).toHaveValue(
    "学习 TypeScript",
  );
  const panelId = await first.getAttribute("aria-controls");
  await expect(page.locator('[id="' + panelId + '"]')).toHaveAttribute(
    "role",
    "tabpanel",
  );
});

test("日期范围参与 FormData、约束顺序并响应原生重置", async ({ page }) => {
  await demo(page, "date-range-picker");
  const trigger = page.getByRole("button", { name: "日期范围", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "日期范围", exact: true });
  await dialog.getByRole("button", { name: "2026-11-05", exact: true }).click();
  await dialog.getByRole("button", { name: "2026-11-11", exact: true }).click();
  await dialog.getByRole("button", { name: "应用范围", exact: true }).click();
  await page.getByRole("button", { name: "查询记录", exact: true }).click();
  await expect(page.locator("output")).toContainText(
    "2026-11-05 至 2026-11-11",
  );
  await page.getByRole("button", { name: "重置日期", exact: true }).click();
  await expect(trigger).toContainText("2026/11/01");
});

test("FormField 错误与真实输入关联", async ({ page }) => {
  await demo(page, "form-field");
  await page.getByRole("button", { name: "保存资料", exact: true }).click();
  const input = page.getByLabel("成员姓名", { exact: false });
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveAccessibleDescription(/请填写姓名/);
});

test("Pagination 与局部语言设置", async ({ page }) => {
  await demo(page, "pagination");
  await page.getByRole("button", { name: "第 2 页", exact: true }).click();
  await expect(page.locator("output")).toContainText("当前第 2 页");
  await page.getByRole("combobox", { name: "每页条数" }).click();
  await page.getByRole("option", { name: "20 / 页", exact: true }).click();
  await expect(page.locator("output")).toContainText("当前第 1 页，每页 20 条");
  await demo(page, "config-provider");
  await page.getByRole("button", { name: "切换界面语言" }).click();
  await expect(
    page.getByRole("button", { name: "Previous", exact: true }),
  ).toBeDisabled();
  await expect(page.getByRole("cell", { name: "No data" })).toBeVisible();
});

test("局部 RTL 配置同步标签页方向键", async ({ page }) => {
  await demo(page, "tabs");
  await page.getByRole("button", { name: "切换阅读方向", exact: true }).click();
  await page.getByRole("tab", { name: "基本资料", exact: true }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(
    page.getByRole("tab", { name: "近期活动", exact: true }),
  ).toBeFocused();
});
