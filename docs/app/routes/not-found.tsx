import type { Route } from "./+types/not-found";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Link } from "react-router";
import { baseOptions } from "@/lib/layout.shared";

export function meta({}: Route.MetaArgs) {
  return [{ title: "页面不存在 · Liquid Glass" }];
}

export default function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="p-4 flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-xl font-bold mb-2">这页还没有被创造。</h1>
        <p className="text-fd-muted-foreground mb-4">
          换个方向，从组件文档继续探索。
        </p>
        <Link
          className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-4 py-2.5"
          to="/docs"
        >
          回到文档
        </Link>
      </div>
    </HomeLayout>
  );
}
