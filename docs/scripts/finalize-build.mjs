import { copyFile, cp, rm } from 'node:fs/promises';

const output = new URL('../build/client/', import.meta.url);
const basePath = process.env.DOCS_BASE_PATH || '/';
const segments = basePath.split('/').filter(Boolean);
if (segments.some((part) => part === '.' || part === '..')) {
  throw new Error('DOCS_BASE_PATH 不能包含相对目录。');
}

if (segments.length > 0) {
  // React Router 把预渲染页面放在 basename 目录，Pages artifact 自身已挂载于该路径。
  // 先保存根目录的 SPA fallback，再提升预渲染页面，避免首页空白或出现双重路径。
  const pages = new URL(`${segments.join('/')}/`, output);
  await copyFile(new URL('index.html', output), new URL('404.html', output));
  await cp(pages, output, { recursive: true });
  await rm(pages, { recursive: true });
} else {
  await copyFile(new URL('__spa-fallback.html', output), new URL('404.html', output));
}
