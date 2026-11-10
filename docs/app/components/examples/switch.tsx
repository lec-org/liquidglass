import { useState } from "react";
import { Switch } from "@lec-org/liquidglass";

export default function Example() {
  const [checked, setChecked] = useState(true);
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <span>消息通知 · {checked ? "已开启" : "已关闭"}</span>
      <Switch checked={checked} onCheckedChange={setChecked} />
    </label>
  );
}
