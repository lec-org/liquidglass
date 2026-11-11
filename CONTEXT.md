# @lec-space/liquidglass

本仓库维护 LEC 共用的 Liquid Glass React 组件、样式、工作台布局与组件文档站。源码通过 Lec Platform 的 `packages/liquidglass` 子模块固定版本。

平台集成开发使用 Lec Platform 根 workspace 与根锁文件。本仓也保留只含自身及 docs 的 workspace 与锁文件，用于独立检出、验证和 GitHub Actions；两种安装范围各自使用 frozen lockfile，修改依赖时需同时更新。

公开 npm 包为 `@lec-space/liquidglass`，初始版本为 `1.0.0`。业务 API 与 OJ 协议由应用仓库维护。

变更先在本仓提交并推送，再更新 Lec Platform 的子模块引用。安装、构建与测试应使用平台记录的一组子模块版本。
