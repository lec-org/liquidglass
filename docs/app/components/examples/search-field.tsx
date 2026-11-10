import { useState } from "react";
import { SearchField } from "@lec-org/liquidglass";

export default function Example() {
  const [query, setQuery] = useState("");
  const items = ["Button 按钮", "Glass 玻璃容器", "Menu 菜单"];
  return (
    <div style={{ width: 280, display: "grid", gap: 16 }}>
      <SearchField
        aria-label="筛选示例组件"
        placeholder="搜索组件…"
        value={query}
        onValueChange={setQuery}
      />
      <output aria-live="polite">
        {items
          .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
          .join(" · ") || "没有匹配的组件"}
      </output>
    </div>
  );
}
