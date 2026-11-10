import { useState } from "react";
import { Message } from "@lec-org/liquidglass";

export default function Example() {
  const [retry, setRetry] = useState(false);
  return (
    <div style={{ width: 320, display: "grid", gap: 14 }}>
      <Message>更改已自动保存在当前设备。</Message>
      <Message
        tone={retry ? "info" : "error"}
        action={{ label: "重试", onClick: () => setRetry(true) }}
      >
        {retry ? "连接已恢复。" : "连接中断，请稍后重试。"}
      </Message>
    </div>
  );
}
