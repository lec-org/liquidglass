import {
  lazy,
  Suspense,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { Check, Copy, Code2, Moon, Sun } from "lucide-react";
import { Link } from "react-router";
import { components, type ComponentName } from "@/lib/components";

const HighlightedCode = lazy(() => import("./highlighted-code"));

// Vite 同时读取可执行示例与原始源码，复制的内容始终对应当前预览。
const examples = import.meta.glob<{ default: ComponentType }>(
  "./examples/*.tsx",
  { eager: true },
);
const sources = import.meta.glob<string>("./examples/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
});
export const backgrounds = [
  { id: "aurora", label: "极光" },
  { id: "dawn", label: "晨曦" },
  { id: "ocean", label: "海蓝" },
  { id: "grid", label: "网格" },
] as const;

export function CopyButton({ text }: { text: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
    }
  }
  return (
    <button
      type="button"
      className="copy-button"
      onClick={copy}
      aria-live="polite"
    >
      {status === "copied" ? <Check size={14} /> : <Copy size={14} />}
      {status === "copied"
        ? "已复制"
        : status === "error"
          ? "复制失败，请手动复制"
          : "复制代码"}
    </button>
  );
}

export function SourceCode({ code }: { code: string }) {
  return (
    <div className="demo-code">
      <div className="code-toolbar">
        <span>
          <Code2 size={14} /> React · TSX
        </span>
        <CopyButton text={code} />
      </div>
      <Suspense
        fallback={
          <pre tabIndex={0}>
            <code>{code}</code>
          </pre>
        }
      >
        <HighlightedCode code={code} />
      </Suspense>
    </div>
  );
}

export function PreviewCanvas({
  children,
  background = "aurora",
  dark = false,
}: {
  children: ReactNode;
  background?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`preview-canvas scene-${background}`}
      data-theme={dark ? "dark" : "light"}
    >
      <div className="scene-art" data-liquidglass-backdrop aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="preview-content">{children}</div>
    </div>
  );
}

export function ComponentPreview({
  name,
}: {
  name: ComponentName | "member-management" | "visual-system";
}) {
  const [interactive, setInteractive] = useState(false);
  useEffect(() => setInteractive(true), []);
  const [background, setBackground] = useState("aurora");
  const [dark, setDark] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const Example = examples[`./examples/${name}.tsx`]?.default;
  const code = sources[`./examples/${name}.tsx`];
  if (!Example || !code) throw new Error(`示例不存在：${name}`);
  return (
    <section
      className="component-preview not-prose"
      aria-label={`${name} 交互示例`}
      data-interactive={interactive}
      aria-busy={!interactive}
      inert={!interactive}
    >
      <div className="preview-toolbar">
        <div className="preview-view-switch">
          <button
            type="button"
            aria-pressed={!showCode}
            onClick={() => setShowCode(false)}
          >
            预览
          </button>
          <button
            type="button"
            aria-pressed={showCode}
            onClick={() => setShowCode(true)}
          >
            代码
          </button>
        </div>
        <div className="preview-tools">
          <div className="background-swatches" aria-label="预览背景">
            {backgrounds.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.label}
                aria-label={`${item.label}背景`}
                aria-pressed={background === item.id}
                className={`swatch scene-${item.id}`}
                onClick={() => setBackground(item.id)}
              />
            ))}
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label={dark ? "切换浅色预览" : "切换深色预览"}
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
      {/* 保留预览实例，切换到代码后输入状态不丢失。 */}
      <div hidden={showCode}>
        <PreviewCanvas background={background} dark={dark}>
          <Example />
        </PreviewCanvas>
      </div>
      {showCode && <SourceCode code={code} />}
      <div className="preview-caption">
        <span className="live-dot" />
        {interactive ? "真实组件 · 点击、拖动，试试看" : "正在准备交互…"}
        <span className="preview-caption-right">@lec-org/liquidglass</span>
      </div>
    </section>
  );
}

export function ComponentGrid() {
  return (
    <div className="component-grid not-prose">
      {components.map((item) => (
        <Link
          to={`/docs/components/${item.slug}`}
          className="component-card"
          key={item.slug}
        >
          <span className="component-category">
            {item.category}
            <span>↗</span>
          </span>
          <strong>{item.name}</strong>
          <span className="component-label">{item.label}</span>
          <p>{item.description}</p>
        </Link>
      ))}
    </div>
  );
}
