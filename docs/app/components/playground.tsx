import { useState, type CSSProperties } from "react";
import {
  Button,
  Glass,
  Slider,
  Switch,
  type ButtonProps,
} from "@lec-org/liquidglass";
import { ArrowUpRight } from "lucide-react";
import { backgrounds, PreviewCanvas, SourceCode } from "./preview";

export function Playground() {
  const [background, setBackground] = useState("aurora");
  const [dark, setDark] = useState(false);
  const [size, setSize] = useState<NonNullable<ButtonProps["size"]>>("regular");
  const [variant, setVariant] =
    useState<NonNullable<ButtonProps["variant"]>>("filled");
  const [tint, setTint] = useState("#087f6f");
  const [transparency, setTransparency] = useState(0.5);
  const [count, setCount] = useState(0);
  const code = `import { Button, Glass } from '@lec-org/liquidglass';\nimport type { CSSProperties } from 'react';\n\nexport default function Example() {\n  return (\n    <div data-theme="${dark ? "dark" : "light"}"\n      style={{ '--lg-transparency': ${transparency} } as CSSProperties}>\n      <Glass style={{ padding: 28, borderRadius: 28 }}>\n        <h3>让想法，浮出水面。</h3>\n        <Button variant="${variant}" size="${size}" tint="${tint}">\n          开始创作\n        </Button>\n      </Glass>\n    </div>\n  );\n}`;
  return (
    <div className="playground not-prose">
      <div className="playground-layout">
        <PreviewCanvas background={background} dark={dark}>
          <div style={{ "--lg-transparency": transparency } as CSSProperties}>
            <Glass className="playground-glass">
              <span className="eyebrow">A LITTLE MORE FEELING</span>
              <h3>
                让想法，
                <br />
                浮出水面。
              </h3>
              <p>
                一点光，一点色彩，
                <br />
                还有下一次点击的可能。
              </p>
              <Button
                variant={variant}
                size={size}
                tint={tint}
                icon={<ArrowUpRight size={17} />}
                onClick={() => setCount(count + 1)}
              >
                开始创作
              </Button>
              <output className="playground-clicks" aria-live="polite">
                {count ? `收到 ${count} 次灵感` : "试着按下按钮"}
              </output>
            </Glass>
          </div>
        </PreviewCanvas>
        <div className="playground-controls">
          <span className="eyebrow">MAKE IT YOURS</span>
          <h3>调一块你的玻璃。</h3>
          <label>
            背景
            <select
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            >
              {backgrounds.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            按钮样式
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as typeof variant)}
            >
              <option value="glass">透明玻璃</option>
              <option value="filled">实色填充</option>
            </select>
          </label>
          <label>
            尺寸
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as typeof size)}
            >
              <option value="small">小号 · 28</option>
              <option value="regular">常规 · 36</option>
              <option value="large">大号 · 52</option>
            </select>
          </label>
          <label>
            强调色
            <input
              type="color"
              value={tint}
              onChange={(e) => setTint(e.target.value)}
            />
          </label>
          <label className="range-control">
            透明度 <output>{transparency.toFixed(2)}</output>
            <Slider
              aria-label="玻璃透明度"
              value={transparency}
              min={0}
              max={1}
              step={0.05}
              onValueChange={setTransparency}
            />
          </label>
          <label>
            深色玻璃
            <Switch checked={dark} onCheckedChange={setDark} />
          </label>
        </div>
      </div>
      <SourceCode code={code} />
    </div>
  );
}
