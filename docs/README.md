# Liquid Glass 组件站

基于 Fumadocs、React Router 和 Vite。直接消费上级目录的 `@lec-org/liquidglass` 源码，不复制组件实现。

## 启动与构建

在仓库根目录：

```sh
pnpm install
pnpm docs:dev        # http://127.0.0.1:5174
pnpm docs:build
pnpm --filter @lec-org/liquidglass-docs typecheck
```

构建输出在 `packages/liquidglass/docs/build/client`。HTML、路由数据、搜索索引与 Markdown 内容均在构建时生成，无需数据库和运行时 Node 服务。

```sh
pnpm --filter @lec-org/liquidglass-docs start
```

部署时先提供真实静态文件与目录中的 `index.html`；未知页面使用构建时生成的 `404.html`（内容为 React Router 的 SPA fallback）。不要用覆盖所有无扩展名路径的 rewrite，否则 `/api/search` 会被误返回为 HTML。`serve.json` 提供本地静态预览规则和搜索索引的 JSON 类型。站点默认部署在域名根路径。

## 内容组织

- `content/docs`：中文 MDX 文档与侧边栏顺序。
- `app/components/examples`：可运行 TSX 示例，预览及代码复制读取同一文件。
- `app/lib/components.ts`：组件导航元信息。
- `app/components/playground.tsx`：背景、明暗与组件属性调试。
- `app/routes/home.tsx`：首页真实组件组合。

API 表格通过 Fumadocs TypeScript 插件读取 `../src` 的实际属性类型，在构建时生成。文档用 `Pick` 聚焦常用属性，不重复列出所有原生 DOM 属性。修改组件类型后请重新构建文档，确保类型表同步更新。

添加组件时，在 `examples` 添加示例、在 `components.ts` 添加目录项，然后新增 MDX 与 `meta.json` 导航项。

## 说明

本站直接消费 workspace 源码；组件包仍为私有包，尚未发布到 npm registry。跨仓可以通过 `pnpm pack` 安装包含 ESM、CommonJS 和类型声明的构建产物，具体命令见上级 README。上游来源与 MIT 许可见上级 README 和 LICENSE。

## 浏览器回归检查

```sh
pnpm --filter @lec-org/liquidglass-docs exec playwright install chromium
pnpm docs:test
# 已安装 Google Chrome 时可复用本机浏览器：
PLAYWRIGHT_CHANNEL=chrome pnpm docs:test
```

测试会启动独立的 5176 端口开发服务，检查新增组件文档、1360 / 390 px 布局、明暗预览、原生表单提交与重置、键盘与焦点、Toast 排队及减少动态效果。失败时的截图和 trace 保存在被 Git 忽略的 `test-results` 中。

[视觉规范与回归](http://127.0.0.1:5174/docs/visual-system)提供同屏对照。UI 巡检覆盖全部 53 个组件、两种宽度和明暗主题；截图基线位于 `tests/ui-regression.spec.ts-snapshots`，按平台区分。先审阅差异，再使用 `--update-snapshots` 更新，避免直接接受回归。

Safari 同类引擎可单独验证表单、列表、浮层及场景组合：

```sh
pnpm --filter @lec-org/liquidglass-docs exec playwright install webkit
pnpm --filter @lec-org/liquidglass-docs exec playwright test tests/foundation.spec.ts tests/management.spec.ts tests/blocks.spec.ts tests/calendar-pagination.spec.ts tests/range-navigation.spec.ts --grep-invert '截图' --config playwright.webkit.config.ts
```
