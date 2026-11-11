import { useState } from "react";
import { ContextMenu, Glass } from "@lec-space/liquidglass";

export default function Example() {
  const [action, setAction] = useState("右键或长按这张卡片");
  return (
    <ContextMenu
      items={[
        { label: "复制", onSelect: () => setAction("已选择复制") },
        { label: "收藏", onSelect: () => setAction("已收藏") },
        "separator",
        {
          label: "删除",
          destructive: true,
          onSelect: () => setAction("已选择删除（演示）"),
        },
      ]}
    >
      <Glass style={{ padding: 32, borderRadius: 24 }}>
        <span aria-live="polite">{action}</span>
      </Glass>
    </ContextMenu>
  );
}
