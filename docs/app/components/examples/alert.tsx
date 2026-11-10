import { useState } from "react";
import { Alert, Button } from "@lec-org/liquidglass";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {saved ? "已保存，再次打开" : "打开确认弹窗"}
      </Button>
      <Alert
        open={open}
        onOpenChange={setOpen}
        title="保存这次灵感？"
        message="让每一个好想法都有迹可循。"
        actions={[
          { label: "稍后", role: "cancel" },
          { label: "保存", onSelect: () => setSaved(true) },
        ]}
      />
    </>
  );
}
