import { useState } from "react";
import { Input } from "@lec-space/liquidglass";
import { ResizableWorkspace } from "@lec-space/liquidglass/workspace";
export default function Example() {
  const [layout, setLayout] = useState("");
  return (
    <div style={{ width: "100%", display: "grid", gap: 12 }}>
      <ResizableWorkspace
        aria-label="编写工作区"
        panels={[
          {
            id: "description",
            title: "题目描述",
            minSize: "20%",
            content: (
              <p>
                拖动中间的分隔条调整阅读与编辑区域。聚焦分隔条后，也可使用方向键调整。
              </p>
            ),
          },
          {
            id: "editor",
            title: "代码编辑",
            minSize: "25%",
            content: (
              <Input
                aria-label="编辑草稿"
                placeholder="这里可以放入项目使用的编辑器"
              />
            ),
          },
        ]}
        onLayoutChange={(next) =>
          setLayout(
            Object.values(next)
              .map((value) => Math.round(value) + "%")
              .join(" / "),
          )
        }
      />
      <output>{layout || "布局可由接入项目保存"}</output>
    </div>
  );
}
