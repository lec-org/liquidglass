import { useState } from "react";
import { Button, Card, Empty, Tag } from "@lec-space/liquidglass";

export default function Example() {
  const [added, setAdded] = useState(false);
  return (
    <Card style={{ width: "min(100%, 380px)" }} padding="small">
      {added ? (
        <div style={{ display: "grid", gap: 18, padding: 12 }}>
          <Tag tone="success">已加入收藏</Tag>
          <strong>两数之和</strong>
          <span style={{ color: "var(--lg-secondary)", fontSize: 13 }}>
            从一题开始，积累你的解题工具箱。
          </span>
          <Button onClick={() => setAdded(false)}>移除收藏，查看空状态</Button>
        </div>
      ) : (
        <Empty
          title="收藏夹还是空的"
          description="把值得再做一遍的题目放在这里。"
        >
          <Button variant="filled" onClick={() => setAdded(true)}>
            收藏一道题
          </Button>
        </Empty>
      )}
    </Card>
  );
}
