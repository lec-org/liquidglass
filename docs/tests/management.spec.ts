import { expect, test, type Page } from "@playwright/test";

async function demo(page: Page, name: string) {
  await page.goto("/docs/components/" + name);
  const preview = page.getByRole("region", { name: name + " 交互示例" });
  await expect(preview).toHaveAttribute("data-interactive", "true");
  return preview;
}

test("DataTable 排序、全选与列显隐", async ({ page }) => {
  const preview = await demo(page, "data-table");
  await preview.getByRole("button", { name: /本周时长/ }).click();
  await expect(preview.locator("tbody tr").first()).toContainText("陈同学");
  await preview.getByRole("checkbox", { name: "全选", exact: true }).check();
  await expect(preview.locator("output")).toContainText("已选 3 人");
  await preview.getByRole("checkbox", { name: "选择 chen" }).uncheck();
  await expect(
    preview.getByRole("checkbox", { name: "全选", exact: true }),
  ).toHaveJSProperty("indeterminate", true);
  await preview.getByRole("button", { name: "显示列", exact: true }).click();
  await page
    .getByRole("dialog", { name: "显示列" })
    .getByRole("checkbox", { name: "本周时长" })
    .uncheck();
  await expect(
    preview.getByRole("columnheader", { name: /本周时长/ }),
  ).toHaveCount(0);
});

test("搜索多选保留筛选前的选择并参与表单提交与重置", async ({ page }) => {
  const preview = await demo(page, "multi-select");
  await preview.getByRole("button", { name: "保存方向", exact: true }).click();
  await expect(preview.getByRole("alert")).toContainText("请至少选择一项");
  await preview
    .getByRole("button", { name: "选择技术方向", exact: true })
    .click();
  const panel = page.getByRole("dialog", { name: "选择技术方向" });
  await panel.getByRole("checkbox", { name: "React", exact: true }).check();
  await panel.getByRole("searchbox", { name: "搜索", exact: true }).fill("Go");
  await panel.getByRole("checkbox", { name: "Go", exact: true }).check();
  await page.keyboard.press("Escape");
  await preview.getByRole("button", { name: "保存方向", exact: true }).click();
  await expect(preview.locator("output")).toContainText("react、go");
  await preview.getByRole("button", { name: "重置方向", exact: true }).click();
  await expect(
    preview.getByRole("button", { name: "选择技术方向", exact: true }),
  ).toHaveText("选择技术方向");
});

test("Upload 校验所有输入来源并保留有效文件", async ({ page }) => {
  const preview = await demo(page, "upload");
  const input = preview.locator('input[type="file"]');
  await input.setInputFiles({
    name: "notes.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("notes"),
  });
  await expect(preview.locator("output")).toContainText("已选择 1 个文件");
  await input.setInputFiles({
    name: "app.exe",
    mimeType: "application/octet-stream",
    buffer: Buffer.from("bad"),
  });
  await expect(preview.getByRole("alert")).toContainText("app.exe");
  await expect(preview.locator("output")).toContainText("已选择 1 个文件");
  await preview.getByRole("button", { name: "清除 notes.txt" }).click();
  await expect(preview.locator("output")).toContainText("已选择 0 个文件");
});

test("Tree 支持层级键盘导航与禁用项", async ({ page }) => {
  const preview = await demo(page, "tree");
  const root = preview.getByRole("treeitem", { name: "研发文档", exact: true });
  await root.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    preview.getByRole("treeitem", { name: "新人指南", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(preview.locator("output")).toHaveText("当前选择 guide");
  await page.keyboard.press("ArrowLeft");
  await expect(root).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(root).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("End");
  const project = preview.getByRole("treeitem", { name: "项目", exact: true });
  await expect(project).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(preview.locator("output")).toHaveText("当前选择 guide");
});

test("Drawer Escape 关闭并恢复触发点", async ({ page }) => {
  const preview = await demo(page, "drawer");
  const trigger = preview.getByRole("button", {
    name: "查看成员详情",
    exact: true,
  });
  await trigger.click();
  await expect(
    page.getByRole("dialog", { name: "成员详情", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});
