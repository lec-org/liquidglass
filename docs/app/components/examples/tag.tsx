import { useState } from "react";
import { Button, Tag } from "@lec-org/liquidglass";

export default function Example() {
  const [tags, setTags] = useState(["数组", "哈希表", "双指针"]);
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Tag>默认</Tag>
        <Tag tone="info">进行中</Tag>
        <Tag tone="success">已通过</Tag>
        <Tag tone="warning">待检查</Tag>
        <Tag tone="danger">未通过</Tag>
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {tags.map((tag) => (
          <Tag
            key={tag}
            tone="info"
            closeLabel={`移除${tag}`}
            onClose={() => setTags(tags.filter((item) => item !== tag))}
          >
            {tag}
          </Tag>
        ))}
        <Button
          size="small"
          onClick={() => setTags(["数组", "哈希表", "双指针"])}
        >
          重置标签
        </Button>
      </div>
    </div>
  );
}
