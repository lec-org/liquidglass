# @lec-org/liquidglass

LecOJ 的 Liquid Glass workspace 包，源码来自 [onlymoein/liquidglass v0.14.0](https://github.com/onlymoein/liquidglass/tree/dd81a55b5fb14530073cee6280b8067f51314399)，保留上游 MIT 许可证。

`Menu` 可以通过 `renderContent({ close })` 渲染自定义内容。菜单负责玻璃动画、定位、点外部关闭、Escape 和焦点恢复。自定义内容负责按钮交互和键盘导航，可用 `data-lg-menu-initial-focus` 指定打开时的默认焦点。
