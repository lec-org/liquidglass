import { useState } from "react";
import { Button, Sheet, Switch } from "@lec-space/liquidglass";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>打开底部面板</Button>
      <Sheet open={open} onOpenChange={setOpen} detents={["medium", "large"]}>
        <div style={{ padding: 28 }}>
          <h2>给自己留一点空间</h2>
          <p>拖动顶部把手，调整面板高度。按 Escape 或点击遮罩关闭。</p>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              margin: "24px 0",
            }}
          >
            专注模式 <Switch defaultChecked />
          </label>
          <Button onClick={() => setOpen(false)}>完成</Button>
        </div>
      </Sheet>
    </>
  );
}
