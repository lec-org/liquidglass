import { useState } from "react";
import { Button } from "@lec-org/liquidglass";
import { ArrowUpRight, Plus } from "lucide-react";

export default function Example() {
  const [busy, setBusy] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Button>玻璃按钮</Button>
      <Button variant="filled" tint="#087f6f" icon={<ArrowUpRight size={16} />}>
        开始创作
      </Button>
      <Button icon={<Plus size={18} />} aria-label="新建" />
      <Button disabled>暂不可用</Button>
      <Button
        loading={busy}
        onClick={() => {
          setBusy(true);
          window.setTimeout(() => setBusy(false), 800);
        }}
      >
        保存设置
      </Button>
    </div>
  );
}
