import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import { remarkAutoTypeTable } from "fumadocs-typescript";

export default defineConfig({
  // 预览服务和回归服务同时运行时，各自维护依赖缓存，避免首屏脚本出现过期的优化结果。
  cacheDir:
    process.env.LIQUIDGLASS_DOCS_TEST_CACHE === "1"
      ? "node_modules/.vite-test"
      : "node_modules/.vite",
  plugins: [
    // 在构建阶段读取组件的真实类型；发布站点不需要 TypeScript 服务或数据库。
    fumadocsMdx({
      globalOptions: { mdxOptions: { remarkPlugins: [remarkAutoTypeTable] } },
    }),
    tailwindcss(),
    reactRouter(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  // 提前扫描全部客户端示例，避免打开示例后才发现新依赖、导致首屏脚本失效。
  optimizeDeps: {
    entries: ["app/components/preview.tsx"],
    include: [
      "react-dom",
      "react-dom/client",
      "@lec-org/liquidglass > @daypicker/react",
      "@lec-org/liquidglass > @daypicker/react/locale",
      "@lec-org/liquidglass > react-resizable-panels",
    ],
  },
  server: { strictPort: true, watch: { ignored: ["**/build/**"] } },
});
