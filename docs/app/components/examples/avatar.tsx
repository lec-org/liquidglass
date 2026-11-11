import { useState } from "react";
import { Avatar, Badge, Button } from "@lec-space/liquidglass";

// 内嵌 SVG 保证离线也能展示图片头像，不依赖外部图片服务。
const picture = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#b6d6c7"/><circle cx="40" cy="31" r="14" fill="#416f60"/><ellipse cx="40" cy="77" rx="29" ry="25" fill="#416f60"/></svg>')}`;

export default function Example() {
  const [broken, setBroken] = useState(false);
  return (
    <div style={{ display: "grid", gap: 24, justifyItems: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <Avatar name="林" size="small" />
        <Avatar name="Apries" />
        <Avatar src={picture} alt="示例用户头像" size="large" />
        <Badge dot tone="success" label="在线">
          <Avatar name="Lec" shape="rounded" />
        </Badge>
        <Avatar aria-label="未设置头像的用户" />
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <Avatar
          key={String(broken)}
          src={broken ? "data:image/png;base64,broken" : picture}
          name="林"
        />
        <Button size="small" onClick={() => setBroken(!broken)}>
          {broken ? "恢复图片" : "模拟图片失败"}
        </Button>
      </div>
    </div>
  );
}
