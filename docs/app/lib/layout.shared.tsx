import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, gitConfig } from "./shared";
import { Droplets } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="brand">
          <span className="brand-mark">
            <Droplets size={19} strokeWidth={1.6} />
          </span>
          {appName}
          <span className="brand-tag">UI</span>
        </span>
      ),
    },
    links: [
      { text: "文档", url: "/docs" },
      { text: "组件", url: "/docs/components" },
      { text: "调试台", url: "/docs/playground" },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
