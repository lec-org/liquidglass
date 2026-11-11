import { useState } from "react";
import { Avatar, Button, Card, Tag } from "@lec-space/liquidglass";
import { ArrowUpRight } from "lucide-react";

export default function Example() {
  const [joined, setJoined] = useState(false);
  return (
    <Card
      style={{ width: "min(100%, 380px)" }}
      title="把灵感，变成解法。"
      description="本周专题 · 数据结构"
      extra={<Avatar name="Lec" shape="rounded" />}
      cover={
        <div
          style={{
            height: 96,
            background:
              "radial-gradient(ellipse at 25% 140%, #c6e9ab, transparent 65%), linear-gradient(120deg, #aacabd77, #ebddbc99)",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            fontSize: 11,
            letterSpacing: "0.18em",
            color: "#234c3d",
          }}
        >
          A LITTLE PROGRESS, EVERY DAY.
        </div>
      }
      footer={
        <Button
          variant="filled"
          icon={<ArrowUpRight size={15} />}
          onClick={() => setJoined(!joined)}
        >
          {joined ? "已加入 · 点击退出" : "加入学习计划"}
        </Button>
      }
    >
      <p style={{ margin: "0 0 16px" }}>
        从一道题开始，让每次练习都有清晰的方向。
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Tag tone="success">12 道精选</Tag>
        <Tag>循序渐进</Tag>
      </div>
    </Card>
  );
}
