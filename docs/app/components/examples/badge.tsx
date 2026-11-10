import { useState } from "react";
import { Avatar, Badge, Button } from "@lec-org/liquidglass";
import { Bell, Minus, Plus } from "lucide-react";

export default function Example() {
  const [count, setCount] = useState(5);
  return (
    <div style={{ display: "grid", gap: 28, justifyItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <Badge count={count} label={`${count} 条未读通知`}>
          <Button icon={<Bell size={18} />} aria-label="通知" />
        </Badge>
        <Badge dot tone="success" label="在线">
          <Avatar name="林" />
        </Badge>
        <Badge count={128} max={99} />
        <Badge count={0} showZero tone="neutral" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Button
          icon={<Minus size={16} />}
          aria-label="减少通知"
          disabled={count === 0}
          onClick={() => setCount(Math.max(0, count - 1))}
        />
        <output>{count} 条通知</output>
        <Button
          icon={<Plus size={16} />}
          aria-label="增加通知"
          onClick={() => setCount(count + 1)}
        />
      </div>
    </div>
  );
}
