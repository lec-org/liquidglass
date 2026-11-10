import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock.core";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import tsx from "shiki/langs/tsx.mjs";
import githubDark from "shiki/themes/github-dark.mjs";

// 只加载示例需要的 TSX 语法和单个主题，不把整套语言包带进组件站。
let highlighter: ReturnType<typeof createHighlighterCore> | undefined;
const getHighlighter = () =>
  (highlighter ??= createHighlighterCore({
    langs: [tsx],
    themes: [githubDark],
    engine: createJavaScriptRegexEngine(),
  }));

export default function HighlightedCode({ code }: { code: string }) {
  return (
    <DynamicCodeBlock
      highlighter={getHighlighter}
      lang="tsx"
      code={code}
      options={{ theme: "github-dark" }}
      codeblock={{ allowCopy: false, keepBackground: true }}
    />
  );
}
