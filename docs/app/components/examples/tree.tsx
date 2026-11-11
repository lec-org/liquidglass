import { useState } from "react";
import { Tree } from "@lec-space/liquidglass";
export default function Example() {
  const [selected, setSelected] = useState("");
  return (
    <div style={{ display: "grid", gap: 18, width: "min(100%, 360px)" }}>
      <Tree
        aria-label="工作室知识库"
        defaultExpandedKeys={["docs"]}
        selectedKey={selected}
        onSelect={setSelected}
        nodes={[
          {
            key: "docs",
            label: "研发文档",
            children: [
              { key: "guide", label: "新人指南" },
              { key: "frontend", label: "前端规范" },
            ],
          },
          {
            key: "projects",
            label: "项目",
            children: [
              { key: "oj", label: "LecOJ" },
              { key: "private", label: "内部草稿", disabled: true },
            ],
          },
        ]}
      />
      <output>当前选择 {selected || "无"}</output>
    </div>
  );
}
