# @lec-org/liquidglass

本仓库作为 `lec-platform/packages/liquidglass` 子模块维护。开发时从 [Lec Platform](https://github.com/lec-org/lec-platform) 递归检出源码，并在平台根目录执行 `pnpm install --frozen-lockfile`。下文的 workspace 命令均从平台根目录运行。

LEC 平台的 Liquid Glass 共享包，源码来自 [onlymoein/liquidglass v0.14.0](https://github.com/onlymoein/liquidglass/tree/dd81a55b5fb14530073cee6280b8067f51314399)，保留上游 MIT 许可证。

组件站位于 [`docs`](./docs/README.md)，包含首页、组件交互示例、源码生成的 API 表格和主题调试台。在平台根目录运行 `pnpm docs:dev`，访问 `http://127.0.0.1:5174`；`pnpm docs:build` 生成静态站点。

`Menu` 可以通过 `renderContent({ close })` 渲染自定义内容。菜单负责玻璃动画、定位、点外部关闭、Escape 和焦点恢复。自定义内容负责按钮交互和键盘导航，可用 `data-lg-menu-initial-focus` 指定打开时的默认焦点。

## 常用组件

- 表单：`Checkbox`（含半选）、`Radio`、`Select`（单选）、`TextArea`。
- 内容：`Card`、`Tag`、`Badge`、`Avatar`、`Empty`、`Skeleton`。
- 浮层与反馈：`Tooltip`、`Popover`、`Toast`。全局通知通过 `ToastProvider` 与 `useToast()` 管理。

这些组件复用现有玻璃表面、`data-theme` 和 `--lg-*` 变量。表单控件保留原生提交与校验；浮层使用原生 Popover API 保留局部主题并进入浏览器顶层。用法、键盘操作、边界条件与可交互示例见组件站。

视觉规则与同屏对照见组件站的「视觉规范与回归」。默认控件高度统一为 32 / 40 / 48px，粗指针设备至少 44px；间距、字阶、状态色和焦点环通过共享变量控制。按钮与导航保留折射和按压效果，长文本与数据使用较实的表面。

## 通用组件与场景组合

组件站当前提供 53 组组件示例，并提供「成员管理工作台」完整页面，覆盖统计、筛选、排序、跨页选择和侧边详情。

- 基础能力包括 ConfigProvider、Typography、FormField、Dialog、Tabs、Table、Pagination、DateRangePicker，以及 Button 的 loading。
- 管理页面可以组合 DataTable、FilterBar、MultiSelect、Upload、Drawer、Tree、Descriptions 和 Statistic。
- MemberPicker、ImportWizard、ActivityCalendar 和 CommandPalette 接收业务数据与回调，查询接口、认证和权限规则由宿主项目提供。
- ResizableWorkspace 从独立的 `@lec-org/liquidglass/workspace` 入口加载，需要安装兼容的 `react-resizable-panels`。主入口没有这个运行时依赖。

DateRangePicker 复用 React DayPicker 的范围选择逻辑和本库的玻璃浮层，以 `YYYY-MM-DD` 字符串传递值，确认后应用。DataTable 的 `data` 是当前页数据，服务端排序设置 `manualSorting`；分页和跨页选择由宿主维护。Upload 负责选择和校验文件，网络上传由项目请求层处理。

## 独立打包与跨仓接入

在平台根目录执行：

```sh
pnpm --filter @lec-org/liquidglass build
pnpm --filter @lec-org/liquidglass pack --out /tmp/liquidglass.tgz
```

workspace 内继续直接使用源码以保留热更新。打包时使用 `publishConfig.exports` 切换到 `dist`，包含 ESM、CommonJS、类型声明和显式 CSS 入口。tarball 可安装到其他仓库，当前包保持 private，尚未发布到 npm registry。

主入口自动注入样式，`@lec-org/liquidglass/styles.css` 也提供独立样式文件。基础主题通过 ConfigProvider 配置语言、方向、密度和 CSS token，局部配置会继承上层未覆盖的选项。完整用法、键盘行为、受控与非受控边界见组件站。
