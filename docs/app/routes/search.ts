import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

// 默认 multilingual 分词同时支持中文说明和英文组件名，索引构建后静态部署。
const server = createFromSource(source);

export async function loader() {
  return server.staticGET();
}
