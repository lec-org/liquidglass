import { expect, test, type Page } from "@playwright/test";

async function demo(page: Page, name: string) {
  await page.goto("/docs/components/" + name);
  const preview = page.getByRole("region", { name: name + " 交互示例" });
  await expect(preview).toHaveAttribute("data-interactive", "true");
  return preview;
}
test("成员选择展示分组并返回稳定 ID", async ({ page }) => {
  const preview = await demo(page, "member-picker");
  await preview
    .getByRole("button", { name: "选择项目成员", exact: true })
    .click();
  await page
    .getByRole("dialog", { name: "选择项目成员" })
    .getByRole("checkbox", { name: /林同学/ })
    .check();
  await page.keyboard.press("Escape");
  await expect(preview.locator("output")).toContainText("已选 1 位成员");
});
test("ImportWizard 预检失败后可重新选择并完成发布", async ({ page }) => {
  const preview = await demo(page, "import-wizard");
  const input = preview.locator('input[type="file"]');
  await input.setInputFiles({
    name: "members.json",
    mimeType: "application/json",
    buffer: Buffer.from("{}"),
  });
  await preview.getByRole("button", { name: "开始预检", exact: true }).click();
  await expect(preview.getByRole("alert")).toContainText("姓名数组");
  await input.setInputFiles({
    name: "members.json",
    mimeType: "application/json",
    buffer: Buffer.from('["林同学","陈同学"]'),
  });
  await preview.getByRole("button", { name: "开始预检", exact: true }).click();
  await expect(
    preview.getByRole("table", { name: "待导入的成员" }),
  ).toBeVisible();
  await preview.getByRole("button", { name: "确认发布", exact: true }).click();
  await expect(preview.getByRole("status")).toHaveText("导入完成");
  await preview.getByRole("button", { name: "继续导入", exact: true }).click();
  await expect(
    preview.getByRole("button", { name: "开始预检", exact: true }),
  ).toBeDisabled();
});
test("活动日历键盘选择与跨月", async ({ page }) => {
  const preview = await demo(page, "activity-calendar");
  const first = preview.getByRole("button", { name: /2026-11-01/ });
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(preview.locator("output")).toContainText("11 月 2 日");
  await preview.getByRole("button", { name: "下个月", exact: true }).click();
  await expect(preview.getByRole("grid")).toHaveAccessibleName(
    "练习活动 2026-12",
  );
});
test("命令面板搜索、键盘执行与焦点恢复", async ({ page }) => {
  const preview = await demo(page, "command-palette");
  const trigger = preview.getByRole("button", {
    name: "打开快捷命令",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "快捷命令", exact: true });
  const input = dialog.getByRole("combobox", { name: "搜索", exact: true });
  await expect(input).toBeFocused();
  await input.fill("document");
  await expect(dialog.getByRole("option")).toHaveCount(1);
  await input.press("Enter");
  await expect(preview.locator("output")).toHaveText("已选择新建文档");
  await expect(trigger).toBeFocused();
});
test("分栏调整保留面板内容", async ({ page }) => {
  const preview = await demo(page, "resizable-workspace");
  await preview.getByRole("textbox", { name: "编辑草稿" }).fill("保留草稿");
  const separator = preview.getByRole("separator", { name: "调整分栏" });
  await separator.focus();
  await page.keyboard.press("ArrowRight");
  await expect(preview.getByRole("textbox", { name: "编辑草稿" })).toHaveValue(
    "保留草稿",
  );
  await expect(preview.locator("output")).toContainText("%");
});

test("完整成员管理示例的分页、筛选与详情组合", async ({ page }) => {
  await page.goto("/docs/examples/member-management");
  const preview = page.getByRole("region", {
    name: "member-management 交互示例",
  });
  await expect(preview).toHaveAttribute("data-interactive", "true");
  await preview.getByRole("button", { name: "第 2 页", exact: true }).click();
  await expect(
    preview.getByRole("cell", { name: "李同学", exact: true }),
  ).toBeVisible();
  await preview.getByRole("textbox", { name: "查询成员姓名" }).fill("林");
  await expect(
    preview.getByRole("button", { name: "第 1 页", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await preview
    .getByRole("button", { name: "查看 林同学", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "林同学", exact: true }),
  ).toContainText("Web 前端");
});

test("重新选择文件后忽略上一轮预检结果", async ({ page }) => {
  await page.addInitScript(() => {
    const original = File.prototype.text;
    File.prototype.text = async function () {
      if (this.name === "slow.json") {
        await new Promise<void>((resolve) => {
          (window as Window & { releaseSlow?: () => void }).releaseSlow =
            resolve;
        });
      }
      return original.call(this);
    };
  });
  const preview = await demo(page, "import-wizard");
  const input = preview.locator('input[type="file"]');
  await input.setInputFiles({
    name: "slow.json",
    mimeType: "application/json",
    buffer: Buffer.from('["旧数据"]'),
  });
  await preview.getByRole("button", { name: "开始预检", exact: true }).click();
  await preview.getByRole("button", { name: "重新选择", exact: true }).click();
  await input.setInputFiles({
    name: "next.json",
    mimeType: "application/json",
    buffer: Buffer.from('["新数据"]'),
  });
  await preview.getByRole("button", { name: "开始预检", exact: true }).click();
  await expect(
    preview.getByRole("cell", { name: "新数据", exact: true }),
  ).toBeVisible();
  await page.evaluate(() =>
    (window as Window & { releaseSlow?: () => void }).releaseSlow?.(),
  );
  await expect(
    preview.getByRole("cell", { name: "旧数据", exact: true }),
  ).toHaveCount(0);
});

test("窄屏表格横向滚动，成员姓名保持单行", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/docs/examples/member-management");
  const preview = page.getByRole("region", {
    name: "member-management 交互示例",
  });
  await expect(preview).toHaveAttribute("data-interactive", "true");
  const cell = preview.getByRole("cell", { name: "林同学", exact: true });
  await expect(cell).toHaveCSS("white-space", "nowrap");
  expect(
    await preview
      .locator(".lg-table-scroll")
      .evaluate((element) => element.scrollWidth > element.clientWidth),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
