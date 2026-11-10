import { uiTranslations } from "fumadocs-ui/i18n";

const chinese: Record<string, string> = {
  Search: "搜索文档",
  "Open Search": "搜索文档",
  "Close Search": "关闭搜索",
  "No results found": "没有找到相关内容",
  "Search failed": "搜索失败",
  "Search failed, showing results for {query}": "搜索失败，显示 {query} 的结果",
  "On this page": "本页内容",
  "Table of Contents": "本页内容",
  "No Headings": "暂无目录",
  "Toggle Theme": "切换主题",
  Light: "浅色",
  Dark: "深色",
  System: "跟随系统",
  Theme: "主题",
  "Skip to Content": "跳到内容",
  "Toggle Menu": "展开导航",
  "Open Sidebar": "展开目录",
  "Close Sidebar": "关闭目录",
  "Collapse Sidebar": "收起目录",
  "Copy Text": "复制代码",
  "Copied Text": "已复制",
  "Copy Anchor Link": "复制段落链接",
  "Copied Anchor Link": "已复制链接",
  "Copy Link": "复制链接",
  "Copied Link": "已复制链接",
  Prop: "属性",
  Type: "类型",
  Default: "默认值",
  Parameters: "参数",
  Returns: "返回值",
  "Previous Page": "上一页",
  "Next Page": "下一页",
};

// Fumadocs 的键带有使用场景后缀；从公开的键清单映射，避免遗漏同一文字在不同位置的翻译。
export const translations = Object.fromEntries(
  uiTranslations().keys.flatMap((key) => {
    const value = chinese[key.split("(")[0]];
    return value ? [[key, value]] : [];
  }),
);
