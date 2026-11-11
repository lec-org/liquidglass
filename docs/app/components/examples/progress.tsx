import { useState } from "react";
import { Button, Progress, Spinner } from "@lec-space/liquidglass";

export default function Example() {
  const [value, setValue] = useState(0.4);
  return (
    <div style={{ width: 280, display: "grid", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Spinner aria-label="处理中" />
        <span>上传进度 {Math.round(value * 100)}%</span>
      </div>
      <Progress aria-label="上传进度" value={value} />
      <Button
        onClick={() => setValue((v) => (v >= 1 ? 0 : Math.min(1, v + 0.2)))}
      >
        推进 / 重新开始
      </Button>
    </div>
  );
}
