import { copyFile } from 'node:fs/promises';

// 先提供预渲染页面和无扩展名的搜索索引，再让未知路径进入客户端 404 页。
// 全局 rewrite 会把 /api/search 错当成 HTML，不能用于这个静态输出结构。
await copyFile(
  new URL('../build/client/__spa-fallback.html', import.meta.url),
  new URL('../build/client/404.html', import.meta.url),
);
