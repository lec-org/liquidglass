# @lec-org/liquidglass

LecOJ 的 Liquid Glass workspace 包，源码来自 [onlymoein/liquidglass v0.14.0](https://github.com/onlymoein/liquidglass/tree/dd81a55b5fb14530073cee6280b8067f51314399)，保留上游 MIT 许可证。

组件站位于 [`docs`](./docs/README.md)，包含首页、组件交互示例、源码生成的 API 表格和主题调试台。在仓库根目录运行 `pnpm docs:dev`，访问 `http://127.0.0.1:5174`；`pnpm docs:build` 生成静态站点。

`Menu` 可以通过 `renderContent({ close })` 渲染自定义内容。菜单负责玻璃动画、定位、点外部关闭、Escape 和焦点恢复。自定义内容负责按钮交互和键盘导航，可用 `data-lg-menu-initial-focus` 指定打开时的默认焦点。

## 常用组件

- 表单：`Checkbox`（含半选）、`Radio`、`Select`（单选）、`TextArea`。
- 内容：`Card`、`Tag`、`Badge`、`Avatar`、`Empty`、`Skeleton`。
- 浮层与反馈：`Tooltip`、`Popover`、`Toast`。全局通知通过 `ToastProvider` 与 `useToast()` 管理。

这些组件复用现有玻璃表面、`data-theme` 和 `--lg-*` 变量。表单控件保留原生提交与校验；浮层使用原生 Popover API 保留局部主题并进入浏览器顶层。用法、键盘操作、边界条件与可交互示例见组件站。
