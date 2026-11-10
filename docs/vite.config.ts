import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import { remarkAutoTypeTable } from "fumadocs-typescript";

export default defineConfig({
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
  server: { strictPort: true, watch: { ignored: ["**/build/**"] } },
});
