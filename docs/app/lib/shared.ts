import { createGetUrl } from "fumadocs-core/source";

export const appName = "Liquid Glass";
export const docsRoute = "/docs";
export const docsContentRoute = "/llms.mdx/docs";

export const gitConfig = {
  user: "lec-org",
  repo: "liquidglass",
  branch: "main",
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, "content.md"];

  return { segments, url: getContentUrl(segments, page.locale) };
}
