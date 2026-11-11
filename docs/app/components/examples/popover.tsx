import { useState } from "react";
import { Button, Checkbox, Popover } from "@lec-space/liquidglass";
import { SlidersHorizontal } from "lucide-react";

export default function Example() {
  const [hints, setHints] = useState(true);
  const [saved, setSaved] = useState("");
  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 20 }}>
      <Popover
        label="练习偏好"
        aria-label="练习偏好设置"
        title="专注你的解题过程"
        trigger={{ icon: <SlidersHorizontal size={16} /> }}
      >
        {({ close }) => (
          <div style={{ display: "grid", gap: 18 }}>
            <Checkbox
              checked={hints}
              onCheckedChange={setHints}
              description="遇到困难时显示思路提示"
            >
              开启提示
            </Checkbox>
            <p
              style={{ margin: 0, fontSize: 12, color: "var(--lg-secondary)" }}
            >
              设置仅在这个示例中生效。
            </p>
            <Button
              variant="filled"
              onClick={() => {
                setSaved(hints ? "已开启解题提示" : "已关闭解题提示");
                close();
              }}
            >
              完成设置
            </Button>
          </div>
        )}
      </Popover>
      <output style={{ fontSize: 12 }}>
        {saved || "点击按钮，展开一张轻盈的玻璃卡片。"}
      </output>
    </div>
  );
}
